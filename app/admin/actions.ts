"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createUser, deletePost, deleteUser, savePost, updateUserPassword } from "@/lib/cms-store";
import type { ContentBlock, ContentType, UserGroup } from "@/lib/cms-types";
import { saveUploadedImage } from "@/lib/media-storage";
import { plainTextToRichHtml, sanitizeRichText } from "@/lib/rich-text";

const contentTypes = new Set<ContentType>(["news", "product", "activity", "event"]);
const groups = new Set<UserGroup>(["Admin", "User"]);

function required(formData: FormData, name: string, maxLength = 3000) {
  const value = String(formData.get(name) || "").trim();
  if (!value) throw new Error(`${name} is required.`);
  return value.slice(0, maxLength);
}

function optional(formData: FormData, name: string, maxLength = 3000) {
  const value = String(formData.get(name) || "").trim();
  return value ? value.slice(0, maxLength) : undefined;
}

function publicationDate(formData: FormData) {
  const value = required(formData, "publishedAt", 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Please select a valid publication date.");
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error("Please select a valid publication date.");
  }
  return date.toISOString();
}

function safeMediaUrl(value: unknown) {
  if (typeof value !== "string") return "";
  const url = value.trim();
  if (url.startsWith("/") && !url.startsWith("//")) return url.slice(0, 1000);
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.toString().slice(0, 1000) : "";
  } catch {
    return "";
  }
}

function parseBlocks(raw: string): ContentBlock[] {
  const source = JSON.parse(raw) as unknown;
  if (!Array.isArray(source)) throw new Error("Invalid content blocks.");

  return source.slice(0, 100).flatMap((candidate): ContentBlock[] => {
    if (!candidate || typeof candidate !== "object") return [];
    const block = candidate as Record<string, unknown>;
    const id = typeof block.id === "string" ? block.id.slice(0, 100) : randomUUID();
    const text = typeof block.text === "string" ? block.text.slice(0, 20_000) : "";

    if (block.type === "heading") {
      return [{ id, type: "heading", level: block.level === 3 ? 3 : 2, text }];
    }
    if (block.type === "paragraph") {
      const rawHtml = typeof block.html === "string" ? block.html : plainTextToRichHtml(text);
      return [{ id, type: "paragraph", text, html: sanitizeRichText(rawHtml) }];
    }
    if (block.type === "quote") {
      return [{
        id,
        type: "quote",
        text,
        citation: typeof block.citation === "string" ? block.citation.slice(0, 300) : undefined,
      }];
    }
    if (block.type === "list") {
      const items = Array.isArray(block.items)
        ? block.items.filter((item): item is string => typeof item === "string").slice(0, 50)
        : [];
      return [{ id, type: "list", items: items.map((item) => item.slice(0, 1000)) }];
    }
    if (block.type === "image") {
      const src = safeMediaUrl(block.src);
      return [{
        id,
        type: "image",
        src,
        alt: typeof block.alt === "string" ? block.alt.slice(0, 500) : "",
        caption: typeof block.caption === "string" ? block.caption.slice(0, 1000) : undefined,
      }];
    }
    if (block.type === "youtube") {
      const url = safeMediaUrl(block.url);
      if (!url) return [];
      return [{
        id,
        type: "youtube",
        url,
        caption: typeof block.caption === "string" ? block.caption.slice(0, 1000) : undefined,
      }];
    }
    if (block.type === "slideshow") {
      const images = Array.isArray(block.images)
        ? block.images.slice(0, 100).flatMap((image): Array<{ src: string; alt: string; caption?: string }> => {
            if (!image || typeof image !== "object") return [];
            const item = image as Record<string, unknown>;
            const src = safeMediaUrl(item.src);
            if (!src) return [];
            return [{
              src,
              alt: typeof item.alt === "string" ? item.alt.slice(0, 500) : "",
              caption: typeof item.caption === "string" ? item.caption.slice(0, 1000) : undefined,
            }];
          })
        : [];
      return [{ id, type: "slideshow", images }];
    }
    return [];
  });
}

async function applyImageUploads(blocks: ContentBlock[], formData: FormData) {
  const result: ContentBlock[] = [];
  for (const block of blocks) {
    if (block.type === "image") {
      const uploaded = await saveUploadedImage(formData.get(`imageUpload:${block.id}`));
      const src = uploaded || block.src;
      if (src) result.push({ ...block, src });
      continue;
    }
    if (block.type === "slideshow") {
      const uploadedImages: Array<{ src: string; alt: string; caption?: string }> = [];
      for (const value of formData.getAll(`slideshowUpload:${block.id}`)) {
        const src = await saveUploadedImage(value);
        if (src) {
          const originalName = value instanceof File ? value.name.replace(/\.[^.]+$/, "") : "Gallery image";
          uploadedImages.push({ src, alt: originalName, caption: originalName });
        }
      }
      result.push({
        ...block,
        images: [...block.images.filter((image) => Boolean(image.src)), ...uploadedImages].slice(0, 100),
      });
      continue;
    }
    result.push(block);
  }
  return result;
}

function errorRedirect(path: string, error: unknown): never {
  const message = error instanceof Error ? error.message : "The request could not be completed.";
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function savePostAction(formData: FormData) {
  const user = await requireAdmin();
  const id = optional(formData, "id", 100);
  const type = String(formData.get("type") || "") as ContentType;
  const status = formData.get("status") === "draft" ? "draft" : "published";

  let savedSlug = "";
  try {
    if (!contentTypes.has(type)) throw new Error("Please select a valid content type.");
    const uploadedFeaturedImage = await saveUploadedImage(formData.get("featuredImageUpload"));
    const featuredImage = uploadedFeaturedImage || safeMediaUrl(String(formData.get("featuredImage") || ""));
    const blocks = await applyImageUploads(
      parseBlocks(required(formData, "blocksJson", 500_000)),
      formData,
    );
    const post = await savePost(
      {
        id,
        slug: optional(formData, "slug", 180) || "",
        title: required(formData, "title", 220),
        type,
        category: required(formData, "category", 120),
        summary: required(formData, "summary", 1000),
        featuredImage,
        featuredImageAlt: featuredImage ? required(formData, "featuredImageAlt", 500) : "",
        status,
        publishedAt: publicationDate(formData),
        cargo: optional(formData, "cargo", 500),
        route: optional(formData, "route", 500),
        client: optional(formData, "client", 500),
        specification: optional(formData, "specification", 500),
        scope: optional(formData, "scope", 1000),
        blocks,
      },
      user.id,
    );
    savedSlug = post.slug;
  } catch (error) {
    errorRedirect(id ? `/admin/posts/${id}/edit` : "/admin/posts/new", error);
  }
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${savedSlug}`);
  redirect(`/admin?message=${id ? "updated" : "created"}`);
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  try {
    await deletePost(required(formData, "id", 100));
  } catch (error) {
    errorRedirect("/admin", error);
  }
  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/admin?message=deleted");
}

export async function createUserAction(formData: FormData) {
  await requireAdmin();
  try {
    const group = String(formData.get("group") || "") as UserGroup;
    if (!groups.has(group)) throw new Error("Please select a valid group.");
    const password = required(formData, "password", 200);
    if (password.length < 3) throw new Error("Password must contain at least 3 characters.");
    await createUser({
      username: required(formData, "username", 80),
      displayName: required(formData, "displayName", 120),
      password,
      group,
    });
  } catch (error) {
    errorRedirect("/admin/users", error);
  }
  revalidatePath("/admin/users");
  redirect("/admin/users?message=created");
}

export async function deleteUserAction(formData: FormData) {
  const currentUser = await requireAdmin();
  try {
    await deleteUser(required(formData, "id", 100), currentUser.id);
  } catch (error) {
    errorRedirect("/admin/users", error);
  }
  revalidatePath("/admin/users");
  redirect("/admin/users?message=deleted");
}

export async function updateUserPasswordAction(formData: FormData) {
  await requireAdmin();
  try {
    const password = required(formData, "password", 200);
    const confirmation = required(formData, "passwordConfirmation", 200);
    if (password.length < 3) throw new Error("Password must contain at least 3 characters.");
    if (password !== confirmation) throw new Error("Password confirmation does not match.");
    await updateUserPassword(required(formData, "userId", 100), password);
  } catch (error) {
    errorRedirect("/admin/users", error);
  }
  revalidatePath("/admin/users");
  redirect("/admin/users?message=password-updated");
}

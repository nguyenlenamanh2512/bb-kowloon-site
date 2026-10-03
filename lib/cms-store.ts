import "server-only";

import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { projects } from "@/data/projects";
import type {
  CmsDatabase,
  CmsPost,
  CmsUser,
  ContentBlock,
  PublicUser,
  UserGroup,
} from "@/lib/cms-types";
import { getKvBinding, getRuntimeTextBinding } from "@/lib/runtime-env";

const dataDirectory =
  process.env.DATA_DIR || path.join(process.cwd(), "storage");
const databasePath = path.join(dataDirectory, "cms-data.json");
const kvDatabaseKey = "cms-data:v1";
let writeQueue: Promise<unknown> = Promise.resolve();

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function createPassword(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  return {
    passwordSalt,
    passwordHash: hashPassword(password, passwordSalt),
  };
}

function safeUser(user: CmsUser): PublicUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    group: user.group,
    createdAt: user.createdAt,
  };
}

function textBlock(text: string): ContentBlock {
  return { id: randomUUID(), type: "paragraph", text };
}

function initialDatabase(options?: {
  username?: string;
  displayName?: string;
  password?: string;
}): CmsDatabase {
  const createdAt = new Date().toISOString();
  const adminId = randomUUID();
  const initialPassword = options?.password || "123";
  const adminPassword = createPassword(initialPassword);
  const userPassword = createPassword(initialPassword);

  const seededPosts: CmsPost[] = projects.map((project, index) => ({
    id: randomUUID(),
    slug: project.slug,
    title: project.title,
    type: index % 3 === 0 ? "activity" : "product",
    category: project.category,
    summary: project.summary,
    featuredImage: project.image,
    featuredImageAlt: `${project.title} cargo operation`,
    status: "published",
    cargo: project.cargo,
    route: project.route,
    client: project.client,
    specification: project.specification,
    scope: project.scope,
    blocks: [
      {
        id: randomUUID(),
        type: "heading",
        level: 2,
        text: "Operation overview",
      },
      textBlock(project.summary),
      {
        id: randomUUID(),
        type: "quote",
        text: "Safe coordination, clear communication and careful cargo handling guide every operation.",
        citation: "BB Kowloon operations team",
      },
    ],
    publishedAt: createdAt,
    createdAt,
    updatedAt: createdAt,
    authorId: adminId,
  }));

  seededPosts.unshift({
    id: randomUUID(),
    slug: "mekong-project-cargo-showcase",
    title: "Mekong Project Cargo Showcase",
    type: "event",
    category: "Demo event",
    summary:
      "A complete demo article showing rich content blocks, an embedded YouTube clip and an image slideshow.",
    featuredImage: "/images/profile/hero-barge.webp",
    featuredImageAlt: "Barge carrying project cargo on the Mekong River",
    status: "published",
    route: "Vietnam → Cambodia via the Mekong River",
    cargo: "Project and oversized cargo",
    scope: "Planning, loading supervision, barging and delivery coordination",
    blocks: [
      {
        id: randomUUID(),
        type: "heading",
        level: 2,
        text: "One article, every content feature",
      },
      textBlock(
        "This demo entry is ready for review. Administrators can edit, reorder or remove each block independently in the CMS.",
      ),
      {
        id: randomUUID(),
        type: "list",
        items: [
          "Reusable text, headings, quotes and lists",
          "YouTube embeds with a privacy-enhanced player",
          "Responsive image slideshow with keyboard-friendly controls",
        ],
      },
      {
        id: randomUUID(),
        type: "youtube",
        url: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
        caption: "YouTube embed demonstration — replace this URL with your own operation video.",
      },
      {
        id: randomUUID(),
        type: "slideshow",
        images: [
          {
            src: "/images/profile/barge-river.webp",
            alt: "Cargo barge navigating the river",
            caption: "River transport along the Mekong corridor",
          },
          {
            src: "/images/profile/steel-cargo.webp",
            alt: "Steel cargo lifted beside a vessel",
            caption: "Coordinated breakbulk cargo handling",
          },
          {
            src: "/images/profile/oversized-pipes.webp",
            alt: "Oversized pipes loaded on a barge",
            caption: "Oversized project cargo preparation",
          },
        ],
      },
    ],
    publishedAt: createdAt,
    createdAt,
    updatedAt: createdAt,
    authorId: adminId,
  });

  return {
    version: 1,
    users: [
      {
        id: adminId,
        username: options?.username || "namanh",
        displayName: options?.displayName || "Nam Anh",
        group: "Admin",
        ...adminPassword,
        createdAt,
      },
      {
        id: randomUUID(),
        username: "Namem",
        displayName: "Namem",
        group: "User",
        ...userPassword,
        createdAt,
      },
    ],
    posts: seededPosts,
  };
}

async function persist(database: CmsDatabase) {
  const kv = await getKvBinding();
  if (kv) {
    await kv.put(kvDatabaseKey, JSON.stringify(database));
    return;
  }

  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = `${databasePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(database, null, 2), "utf8");
  try {
    await rename(temporaryPath, databasePath);
  } catch {
    await writeFile(databasePath, JSON.stringify(database, null, 2), "utf8");
  }
}

async function readDatabase(): Promise<CmsDatabase> {
  const kv = await getKvBinding();
  if (kv) {
    const existing = await kv.get<CmsDatabase>(kvDatabaseKey, "json");
    if (existing) return existing;

    const password = await getRuntimeTextBinding("CMS_BOOTSTRAP_PASSWORD");
    if (!password || password.length < 12) {
      throw new Error("CMS_BOOTSTRAP_PASSWORD with at least 12 characters is required for Cloudflare KV.");
    }
    const database = initialDatabase({
      username: (await getRuntimeTextBinding("CMS_BOOTSTRAP_USERNAME")) || "namanh",
      displayName: (await getRuntimeTextBinding("CMS_BOOTSTRAP_DISPLAY_NAME")) || "Nam Anh",
      password,
    });
    await kv.put(kvDatabaseKey, JSON.stringify(database));
    return database;
  }

  try {
    const raw = await readFile(databasePath, "utf8");
    return JSON.parse(raw) as CmsDatabase;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code && nodeError.code !== "ENOENT") throw error;
    const database = initialDatabase();
    await persist(database);
    return database;
  }
}

async function mutate<T>(operation: (database: CmsDatabase) => T | Promise<T>) {
  const next = writeQueue.then(async () => {
    const database = await readDatabase();
    const result = await operation(database);
    await persist(database);
    return result;
  });
  writeQueue = next.catch(() => undefined);
  return next;
}

export async function authenticateUser(username: string, password: string) {
  const database = await readDatabase();
  const user = database.users.find(
    (candidate) => candidate.username.toLowerCase() === username.trim().toLowerCase(),
  );
  if (!user) return null;

  const actual = Buffer.from(user.passwordHash, "hex");
  const supplied = Buffer.from(hashPassword(password, user.passwordSalt), "hex");
  if (actual.length !== supplied.length || !timingSafeEqual(actual, supplied)) return null;
  return safeUser(user);
}

export async function getUserById(id: string) {
  const database = await readDatabase();
  const user = database.users.find((candidate) => candidate.id === id);
  return user ? safeUser(user) : null;
}

export async function listUsers() {
  const database = await readDatabase();
  return database.users.map(safeUser).sort((a, b) => a.username.localeCompare(b.username));
}

export async function createUser(input: {
  username: string;
  displayName: string;
  password: string;
  group: UserGroup;
}) {
  return mutate((database) => {
    if (
      database.users.some(
        (user) => user.username.toLowerCase() === input.username.trim().toLowerCase(),
      )
    ) {
      throw new Error("Username already exists.");
    }
    const user: CmsUser = {
      id: randomUUID(),
      username: input.username.trim(),
      displayName: input.displayName.trim(),
      group: input.group,
      ...createPassword(input.password),
      createdAt: new Date().toISOString(),
    };
    database.users.push(user);
    return safeUser(user);
  });
}

export async function deleteUser(id: string, currentUserId: string) {
  return mutate((database) => {
    if (id === currentUserId) throw new Error("You cannot delete your own account.");
    const user = database.users.find((candidate) => candidate.id === id);
    if (!user) throw new Error("Account not found.");
    if (user.username.toLowerCase() === "namanh") {
      throw new Error("The seeded administrator account cannot be deleted.");
    }
    database.users = database.users.filter((candidate) => candidate.id !== id);
  });
}

export async function updateUserPassword(id: string, password: string) {
  return mutate((database) => {
    const user = database.users.find((candidate) => candidate.id === id);
    if (!user) throw new Error("Account not found.");
    Object.assign(user, createPassword(password));
    return safeUser(user);
  });
}

export async function listPosts(options?: { publishedOnly?: boolean }) {
  const database = await readDatabase();
  return database.posts
    .filter((post) => !options?.publishedOnly || post.status === "published")
    .sort((a, b) => {
      const aDate = a.publishedAt || a.createdAt || a.updatedAt;
      const bDate = b.publishedAt || b.createdAt || b.updatedAt;
      return bDate.localeCompare(aDate);
    });
}

export async function getPostBySlug(slug: string) {
  const database = await readDatabase();
  return database.posts.find((post) => post.slug === slug) ?? null;
}

export async function getPostById(id: string) {
  const database = await readDatabase();
  return database.posts.find((post) => post.id === id) ?? null;
}

function normalizedSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `post-${Date.now()}`;
}

export async function savePost(
  input: Omit<CmsPost, "id" | "createdAt" | "updatedAt" | "authorId"> & {
    id?: string;
  },
  authorId: string,
) {
  return mutate((database) => {
    const now = new Date().toISOString();
    const baseSlug = normalizedSlug(input.slug || input.title);
    let slug = baseSlug;
    let suffix = 2;
    while (database.posts.some((post) => post.slug === slug && post.id !== input.id)) {
      slug = `${baseSlug}-${suffix++}`;
    }

    if (input.id) {
      const index = database.posts.findIndex((post) => post.id === input.id);
      if (index < 0) throw new Error("Content item not found.");
      const existing = database.posts[index];
      const updated: CmsPost = {
        ...existing,
        ...input,
        id: existing.id,
        slug,
        updatedAt: now,
        authorId,
      };
      database.posts[index] = updated;
      return updated;
    }

    const post: CmsPost = {
      ...input,
      id: randomUUID(),
      slug,
      createdAt: now,
      updatedAt: now,
      authorId,
    };
    database.posts.unshift(post);
    return post;
  });
}

export async function deletePost(id: string) {
  return mutate((database) => {
    const originalLength = database.posts.length;
    database.posts = database.posts.filter((post) => post.id !== id);
    if (database.posts.length === originalLength) throw new Error("Content item not found.");
  });
}

export function stableContentDigest(post: CmsPost) {
  return createHash("sha256").update(JSON.stringify(post)).digest("hex").slice(0, 12);
}

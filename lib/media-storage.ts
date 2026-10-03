import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDirectory = process.env.DATA_DIR || path.join(process.cwd(), "storage");
const uploadsDirectory = path.join(dataDirectory, "uploads");
const maximumImageSize = 8 * 1024 * 1024;

const extensionsByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function saveUploadedImage(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) return null;
  const extension = extensionsByType[value.type];
  if (!extension) throw new Error("Only JPG, PNG, WebP, GIF and AVIF images are supported.");
  if (value.size > maximumImageSize) throw new Error("Each uploaded image must be 8 MB or smaller.");

  await mkdir(uploadsDirectory, { recursive: true });
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  await writeFile(path.join(uploadsDirectory, filename), Buffer.from(await value.arrayBuffer()));
  return `/media/${filename}`;
}

export async function readUploadedImage(filename: string) {
  if (!/^[a-zA-Z0-9.-]+$/.test(filename) || filename.includes("..")) return null;
  const extension = path.extname(filename).toLowerCase().slice(1);
  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    avif: "image/avif",
  };
  const contentType = contentTypes[extension];
  if (!contentType) return null;
  try {
    return { bytes: await readFile(path.join(uploadsDirectory, filename)), contentType };
  } catch {
    return null;
  }
}

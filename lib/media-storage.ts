import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { getKvBinding } from "@/lib/runtime-env";

const dataDirectory = process.env.DATA_DIR || path.join(process.cwd(), "storage");
const uploadsDirectory = path.join(dataDirectory, "uploads");
const maximumImageSize = 8 * 1024 * 1024;
const maximumKvMediaBytes = 100 * 1024 * 1024;
const kvMediaPrefix = "media:";
const kvMediaIndexKey = "media:index:v1";

type KvMediaMetadata = {
  contentType: string;
  size: number;
};

type KvMediaIndex = Record<string, number>;

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

  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const kv = await getKvBinding();
  if (kv) {
    const index = (await kv.get<KvMediaIndex>(kvMediaIndexKey, "json")) || {};
    const usedBytes = Object.values(index).reduce((total, size) => total + size, 0);
    if (usedBytes + value.size > maximumKvMediaBytes) {
      throw new Error("The test media quota of 100 MB has been reached.");
    }
    const key = `${kvMediaPrefix}${filename}`;
    await kv.put(key, await value.arrayBuffer(), {
      metadata: { contentType: value.type, size: value.size } satisfies KvMediaMetadata,
    });
    index[key] = value.size;
    await kv.put(kvMediaIndexKey, JSON.stringify(index));
    return `/media/${filename}`;
  }

  await mkdir(uploadsDirectory, { recursive: true });
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

  const kv = await getKvBinding();
  if (kv) {
    const stored = await kv.getWithMetadata<KvMediaMetadata>(
      `${kvMediaPrefix}${filename}`,
      "arrayBuffer",
    );
    if (!stored.value) return null;
    return {
      bytes: stored.value,
      contentType: stored.metadata?.contentType || contentType,
    };
  }

  try {
    return { bytes: await readFile(path.join(uploadsDirectory, filename)), contentType };
  } catch {
    return null;
  }
}

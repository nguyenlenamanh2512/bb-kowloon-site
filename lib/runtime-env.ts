import "server-only";

type AppCloudflareEnv = {
  CMS_KV?: KVNamespace;
  AUTH_SECRET?: string;
  CMS_BOOTSTRAP_USERNAME?: string;
  CMS_BOOTSTRAP_DISPLAY_NAME?: string;
  CMS_BOOTSTRAP_PASSWORD?: string;
};

let cloudflareEnvPromise: Promise<AppCloudflareEnv | null> | undefined;

async function loadCloudflareEnv(): Promise<AppCloudflareEnv | null> {
  try {
    const cloudflare = await import("cloudflare:workers");
    return cloudflare.env as unknown as AppCloudflareEnv;
  } catch {
    return null;
  }
}

export function getCloudflareEnv() {
  cloudflareEnvPromise ??= loadCloudflareEnv();
  return cloudflareEnvPromise;
}

export async function getKvBinding() {
  return (await getCloudflareEnv())?.CMS_KV ?? null;
}

export async function getRuntimeTextBinding(name: keyof AppCloudflareEnv) {
  const value = (await getCloudflareEnv())?.[name];
  if (typeof value === "string" && value.trim()) return value.trim();
  return process.env[name]?.trim() || undefined;
}

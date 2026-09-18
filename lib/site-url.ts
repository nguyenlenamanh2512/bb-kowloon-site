const DEFAULT_SITE_URL = "https://www.bb-kowloon.com";

export function getSiteUrl(): string {
  const configuredUrl = process.env.SITE_URL?.trim();
  if (!configuredUrl) return DEFAULT_SITE_URL;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return DEFAULT_SITE_URL;
    }

    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

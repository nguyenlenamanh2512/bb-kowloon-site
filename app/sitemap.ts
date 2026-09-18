import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  return ["", "/about", "/services", "/projects", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : path === "/contact" ? 0.7 : 0.8,
  }));
}

const allowedTags = new Map([
  ["b", "strong"],
  ["strong", "strong"],
  ["i", "em"],
  ["em", "em"],
  ["u", "u"],
  ["s", "s"],
  ["strike", "s"],
  ["br", "br"],
  ["p", "p"],
  ["div", "div"],
  ["a", "a"],
]);

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function plainTextToRichHtml(value: string) {
  return escapeHtml(value.replace(/\r\n?/g, "\n")).replaceAll("\n", "<br>");
}

export function sanitizeRichText(value: string) {
  const withoutDangerousBlocks = value
    .slice(0, 40_000)
    .replaceAll("\0", "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|svg|math)[^>]*>[\s\S]*?<\/\1\s*>/gi, "");

  return withoutDangerousBlocks.replace(/<\s*(\/?)\s*([a-z0-9]+)((?:\s[^<>]*?)?)\s*\/?>/gi, (_match, closing: string, rawTag: string, attributes: string) => {
    const normalized = allowedTags.get(rawTag.toLowerCase());
    if (!normalized) return "";
    if (normalized === "br") return closing ? "" : "<br>";
    if (normalized === "a") {
      if (closing) return "</a>";
      const hrefMatch = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i);
      const rawHref = (hrefMatch?.[1] || hrefMatch?.[2] || hrefMatch?.[3] || "").trim().replace(/&amp;/gi, "&");
      const safeHref = /^(https?:\/\/|mailto:|tel:)/i.test(rawHref) || (rawHref.startsWith("/") && !rawHref.startsWith("//"))
        ? rawHref
        : "";
      if (!safeHref) return "";
      const externalAttributes = /^https?:\/\//i.test(safeHref) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeHtml(safeHref)}"${externalAttributes}>`;
    }
    return closing ? `</${normalized}>` : `<${normalized}>`;
  });
}

export function paragraphHtml(block: { text: string; html?: string }) {
  return sanitizeRichText(block.html?.trim() || plainTextToRichHtml(block.text));
}

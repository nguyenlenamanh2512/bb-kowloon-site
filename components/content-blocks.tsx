import type { ContentBlock } from "@/lib/cms-types";
import { Slideshow } from "@/components/slideshow";
import { paragraphHtml } from "@/lib/rich-text";

function youtubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0];
    if (parsed.hostname.endsWith("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2];
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

export function ContentBlocks({
  blocks,
  details = [],
}: {
  blocks: ContentBlock[];
  details?: Array<[string, string]>;
}) {
  const textBlocks = blocks.filter((block) => !["image", "youtube", "slideshow"].includes(block.type));
  const mediaBlocks = blocks.filter((block) => ["image", "youtube", "slideshow"].includes(block.type));

  return (
    <div className="content-blocks">
      <div className="content-blocks__text">
        {textBlocks.map((block) => {
          if (block.type === "heading") {
            return block.level === 3
              ? <h3 key={block.id}>{block.text}</h3>
              : <h2 key={block.id}>{block.text}</h2>;
          }
          if (block.type === "paragraph") {
            return <div className="content-paragraph" key={block.id} dangerouslySetInnerHTML={{ __html: paragraphHtml(block) }} />;
          }
          if (block.type === "quote") {
            return <blockquote key={block.id}><p>{block.text}</p>{block.citation ? <cite>{block.citation}</cite> : null}</blockquote>;
          }
          if (block.type === "list") {
            return <ul key={block.id}>{block.items.filter(Boolean).map((item, index) => <li key={`${block.id}-${index}`}>{item}</li>)}</ul>;
          }
          return null;
        })}
      </div>
      {details.length ? (
        <section className="article-facts" aria-labelledby="operation-details-title">
          <p className="eyebrow" id="operation-details-title">Operation details</p>
          <dl>
            {details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </section>
      ) : null}
      {mediaBlocks.length ? (
        <section className="content-media">
          {mediaBlocks.map((block) => {
            if (block.type === "image") return <Slideshow key={block.id} images={[{ src: block.src, alt: block.alt, caption: block.caption }]} />;
            if (block.type === "youtube") {
              const id = youtubeId(block.url);
              if (!id) return null;
              return (
                <figure key={block.id} className="content-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
                    title={block.caption || "YouTube video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                  {block.caption ? <figcaption>{block.caption}</figcaption> : null}
                </figure>
              );
            }
            if (block.type === "slideshow") return <Slideshow key={block.id} images={block.images} />;
            return null;
          })}
        </section>
      ) : null}
    </div>
  );
}

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { contentTypeLabels, type CmsPost } from "@/lib/cms-types";

export function ContentCard({ post }: { post: CmsPost }) {
  return (
    <article className="project-card content-card">
      <Link href={`/projects/${post.slug}`} aria-label={`Read ${post.title}`}>
        <div className={`project-card__image${post.featuredImage ? "" : " project-card__image--empty"}`}>
          {post.featuredImage ? <img src={post.featuredImage} alt={post.featuredImageAlt} loading="lazy" /> : <span>No featured image</span>}
          <span className={`content-type content-type--${post.type}`}>{contentTypeLabels[post.type]}</span>
        </div>
        <div className="project-card__body">
          <div><p className="eyebrow">{post.category}</p><h3>{post.title}</h3></div>
          <ArrowUpRight aria-hidden="true" />
          <p>{post.summary}</p>
          {post.type === "product" && post.route ? <span>{post.route}</span> : null}
        </div>
      </Link>
    </article>
  );
}

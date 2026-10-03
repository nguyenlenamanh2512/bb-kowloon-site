import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentBlocks } from "@/components/content-blocks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPostBySlug } from "@/lib/cms-store";
import { contentTypeLabels } from "@/lib/cms-types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return {};
  return { title: post.title, description: post.summary };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const details = [
    ["Cargo", post.cargo],
    ["Route", post.type === "product" ? post.route : undefined],
    ["Client", post.client],
    ["Specification", post.specification],
    ["Scope", post.scope],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  const hasFeaturedImage = Boolean(post.featuredImage);
  const publicationDate = post.publishedAt || post.createdAt || post.updatedAt;

  return (
    <main className="article-page">
      <SiteHeader />
      <section className="article-section">
        <div className="article-shell">
          <Link href="/projects" className="content-back"><ArrowLeft /> Back to Cargo &amp; Projects</Link>
          <header className={`article-hero${hasFeaturedImage ? "" : " article-hero--text-only"}`}>
            <div className="article-hero__copy">
              <p className="eyebrow">{contentTypeLabels[post.type]} · {post.category}</p>
              <h1>{post.title}</h1>
              <p>{post.summary}</p>
              <time dateTime={publicationDate}>Published {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(publicationDate))}</time>
            </div>
            {hasFeaturedImage ? (
              <figure className="article-hero__image">
                <img src={post.featuredImage} alt={post.featuredImageAlt} />
                {post.featuredImageAlt ? <figcaption>{post.featuredImageAlt}</figcaption> : null}
              </figure>
            ) : null}
          </header>
          <article className="article-body">
            <ContentBlocks blocks={post.blocks} details={details} />
          </article>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

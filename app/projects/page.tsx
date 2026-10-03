import type { Metadata } from "next";
import Link from "next/link";

import { ContentCard } from "@/components/content-card";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { ports } from "@/data/company";
import { listPosts } from "@/lib/cms-store";
import { contentTypeLabels, type ContentType } from "@/lib/cms-types";

export const metadata: Metadata = {
  title: "Cargo & Projects",
  description: "Selected cargo operations documented in the BB Kowloon company profile.",
};

export const dynamic = "force-dynamic";

const filterTypes = Object.keys(contentTypeLabels) as ContentType[];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const requestedType = (await searchParams).type;
  const selectedType = filterTypes.includes(requestedType as ContentType)
    ? requestedType as ContentType
    : null;
  const allPosts = await listPosts({ publishedOnly: true });
  const posts = selectedType
    ? allPosts.filter((post) => post.type === selectedType)
    : allPosts;
  return (
    <main>
      <PageHero
        eyebrow="Cargo & projects"
        title="Operational experience across cargo types"
        intro="Selected movements documented in the company profile, presented without unsupported project statistics."
        image="/images/profile/steel-cargo.webp"
        imageAlt="Steel cargo being lifted beside a vessel"
      />

      <section className="section section--paper" id="selected-operations">
        <div className="site-shell">
          <SectionHeading
            eyebrow="Selected operations"
            title="Cargo moved by barge and breakbulk vessel"
            intro="Routes, cargo details, clients and dimensions are shown only where they are stated in the source profile."
          />
          <nav className="content-filter" aria-label="Filter Cargo and Projects by content type">
            <Link
              className={`content-filter__button${selectedType ? "" : " is-active"}`}
              href="/projects#selected-operations"
              aria-current={selectedType ? undefined : "page"}
            >
              All
            </Link>
            {filterTypes.map((type) => (
              <Link
                className={`content-filter__button${selectedType === type ? " is-active" : ""}`}
                href={`/projects?type=${type}#selected-operations`}
                aria-current={selectedType === type ? "page" : undefined}
                key={type}
              >
                {contentTypeLabels[type]}
              </Link>
            ))}
          </nav>
          {posts.length ? (
            <div className="project-grid reveal">
              {posts.map((post) => <ContentCard key={post.id} post={post} />)}
            </div>
          ) : <p className="content-filter__empty">No published content is available for this type yet.</p>}
        </div>
      </section>

      <section className="section project-ledger">
        <div className="site-shell">
          <SectionHeading eyebrow="Operation details" title="What the profile documents" light />
          <div className="ledger-grid reveal">
            {posts.map((post) => (
              <article key={post.id}>
                <p className="eyebrow">{post.category}</p>
                <h3>{post.title}</h3>
                <dl>
                  {post.cargo ? <><dt>Cargo</dt><dd>{post.cargo}</dd></> : null}
                  {post.type === "product" && post.route ? <><dt>Route</dt><dd>{post.route}</dd></> : null}
                  {post.client ? <><dt>Client</dt><dd>{post.client}</dd></> : null}
                  {post.specification ? <><dt>Specification</dt><dd>{post.specification}</dd></> : null}
                  {post.scope ? <><dt>Scope</dt><dd>{post.scope}</dd></> : null}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="site-shell">
          <SectionHeading eyebrow="Locations in profile" title="Port and terminal references" />
          <div className="port-grid port-grid--light reveal">
            {ports.map((port) => (
              <figure key={port.name}>
                <img src={port.image} alt={`${port.name} aerial view`} loading="lazy" />
                <figcaption>{port.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

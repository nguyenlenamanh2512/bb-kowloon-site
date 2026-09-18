import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { ports } from "@/data/company";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Cargo & Projects",
  description: "Selected cargo operations documented in the BB Kowloon company profile.",
};

export default function ProjectsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Cargo & projects"
        title="Operational experience across cargo types"
        intro="Selected movements documented in the company profile, presented without unsupported project statistics."
        image="/images/profile/steel-cargo.webp"
        imageAlt="Steel cargo being lifted beside a vessel"
      />

      <section className="section section--paper">
        <div className="site-shell">
          <SectionHeading
            eyebrow="Selected operations"
            title="Cargo moved by barge and breakbulk vessel"
            intro="Routes, cargo details, clients and dimensions are shown only where they are stated in the source profile."
          />
          <div className="project-grid reveal">
            {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </div>
      </section>

      <section className="section project-ledger">
        <div className="site-shell">
          <SectionHeading eyebrow="Operation details" title="What the profile documents" light />
          <div className="ledger-grid reveal">
            {projects.map((project) => (
              <article key={project.slug}>
                <p className="eyebrow">{project.category}</p>
                <h3>{project.title}</h3>
                <dl>
                  {project.cargo ? <><dt>Cargo</dt><dd>{project.cargo}</dd></> : null}
                  {project.route ? <><dt>Route</dt><dd>{project.route}</dd></> : null}
                  {project.client ? <><dt>Client</dt><dd>{project.client}</dd></> : null}
                  {project.specification ? <><dt>Specification</dt><dd>{project.specification}</dd></> : null}
                  {project.scope ? <><dt>Scope</dt><dd>{project.scope}</dd></> : null}
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

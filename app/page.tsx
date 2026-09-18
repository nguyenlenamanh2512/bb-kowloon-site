import { Anchor, ArrowRight, Boxes, Route, Ship } from "lucide-react";
import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company, operatingPrinciples, ports } from "@/data/company";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <SiteHeader overlay />
        <div className="home-hero__copy site-shell">
          <p className="eyebrow">Vietnam · Mekong River · Cambodia</p>
          <h1>Barge &amp; breakbulk logistics</h1>
          <p>
            Reliable cross-border transport for bulk, oversized, project and agricultural cargo along the Mekong River.
          </p>
          <div className="hero-actions">
            <Link href="/services" className="button-primary">
              Explore our services <ArrowRight size={18} />
            </Link>
            <Link href="/projects" className="button-ghost">View cargo experience</Link>
          </div>
        </div>
        <div className="home-hero__visual">
          <img src="/images/profile/hero-barge.webp" alt="BB Kowloon barge alongside a bulk vessel" />
        </div>
        <div className="home-hero__route" aria-hidden="true" />
      </section>

      <section className="cargo-strip" aria-label="Cargo types handled">
        <div className="site-shell cargo-strip__grid">
          {company.cargoTypes.map((type, index) => (
            <div key={type}>
              <span>0{index + 1}</span>
              <strong>{type}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--paper">
        <div className="site-shell split-intro reveal">
          <div>
            <SectionHeading
              eyebrow="About BB Kowloon"
              title="Built around the Mekong corridor"
              intro="A focused logistics operator connecting Vietnam and Cambodia through inland waterways and coordinated cargo handling."
            />
            <p>{company.overview}</p>
            <Link href="/about" className="text-link">Discover our company <ArrowRight size={17} /></Link>
          </div>
          <figure className="image-frame image-frame--cut">
            <img src="/images/profile/about-port-cranes.webp" alt="Port cranes and a vessel at a river terminal" loading="lazy" />
            <figcaption>Port and terminal operations</figcaption>
          </figure>
        </div>
      </section>

      <section className="section services-preview">
        <div className="site-shell">
          <div className="section-heading-row">
            <SectionHeading eyebrow="What we do" title="One route. Six connected services." light />
            <Link href="/services" className="text-link text-link--light">All services <ArrowRight size={17} /></Link>
          </div>
          <div className="service-grid reveal">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.number} className="service-card">
                  <span className="service-card__number">{service.number}</span>
                  <Icon aria-hidden="true" size={27} />
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section corridor-section">
        <div className="site-shell corridor-grid reveal">
          <div>
            <p className="eyebrow">Core operating corridor</p>
            <h2>Vietnam to Cambodia,<br />connected by water.</h2>
            <p>{company.approach}</p>
          </div>
          <div className="corridor-map" aria-label="Vietnam to Cambodia logistics route through the Mekong River">
            {company.corridor.map((place, index) => (
              <div key={place} className="corridor-stop">
                <span>{index === 1 ? <Route size={22} /> : index === 0 ? <Ship size={22} /> : <Anchor size={22} />}</span>
                <strong>{place}</strong>
                {index < company.corridor.length - 1 ? <i aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="site-shell">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="Selected cargo experience"
              title="Proof of work, across cargo types"
              intro="Operations documented in the company profile, from agricultural products to industrial and oversized cargo."
            />
            <Link href="/projects" className="text-link">View all work <ArrowRight size={17} /></Link>
          </div>
          <div className="featured-projects reveal">
            {projects.slice(0, 4).map((project, index) => (
              <ProjectCard key={project.slug} project={project} featured={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="section principle-section">
        <div className="site-shell">
          <SectionHeading eyebrow="How we operate" title="Fast. Safe. Efficient." />
          <div className="principle-grid reveal">
            {operatingPrinciples.map((principle, index) => (
              <article key={principle.title}>
                <span>0{index + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section port-section">
        <div className="site-shell">
          <SectionHeading
            eyebrow="Port network in profile"
            title="Operational touchpoints"
            intro="Port imagery and locations presented in the BB Kowloon company profile."
            light
          />
          <div className="port-grid reveal">
            {ports.map((port) => (
              <figure key={port.name}>
                <img src={port.image} alt={`${port.name} aerial view`} loading="lazy" />
                <figcaption>{port.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="site-shell cta-band__inner">
          <Boxes aria-hidden="true" size={46} />
          <div>
            <p className="eyebrow">Plan your next movement</p>
            <h2>Building long-term value together.</h2>
          </div>
          <Link href="/contact" className="button-primary">Start a conversation <ArrowRight size={18} /></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

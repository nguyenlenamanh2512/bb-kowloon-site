import { ArrowRight, Boxes } from "lucide-react";

import { ProjectCard } from "@/components/project-card";
import { PortPlanner } from "@/components/port-planner";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company, operatingPrinciples, ports, riverTerminals } from "@/data/company";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <SiteHeader overlay />
        <div className="home-hero__copy site-shell">
          <p className="eyebrow">Ship agency · Cambodia</p>
          <h1>One local agent. Every port call in focus.</h1>
          <p>
            Plan your Cambodia port call with local agency support. Select a port to connect with the right representative and prepare a port disbursement estimate request.
          </p>
          <div className="hero-actions">
            <a href="#find-your-port" className="button-primary">
              Find your port <ArrowRight size={18} />
            </a>
            <a href="/contact#pda-form" className="button-ghost">Request a PDA <ArrowRight size={18} /></a>
          </div>
        </div>
        <div className="home-hero__visual">
          <img src="/images/ports/ship-agency-hero.webp" alt="Container terminal on the Mekong River in Cambodia" />
        </div>
        <div className="home-hero__route" aria-hidden="true" />
      </section>

      <section id="find-your-port" className="section port-finder-section">
        <div className="site-shell">
          <SectionHeading
            eyebrow="Port disbursement estimate"
            title="Get a PDA for your port call"
            intro="Choose the port, then connect with the local representative responsible for your request. Share vessel particulars, cargo operation and ETA so our team can prepare a quotation."
          />
          <PortPlanner />
        </div>
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
              title="Your Trusted Local Partner in Cambodia"
              intro="Local ship agency support backed by practical logistics capability across seaports and river terminals."
            />
            <p>{company.overview}</p>
            <a href="/about" className="text-link">Discover our company <ArrowRight size={17} /></a>
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
            <SectionHeading eyebrow="What we do" title="Ship agency first. Logistics connected." light />
            <a href="/services" className="text-link text-link--light">All services <ArrowRight size={17} /></a>
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
        <div className="site-shell river-network-layout reveal">
          <div>
            <p className="eyebrow">Cambodia river network</p>
            <h2>Port coverage along the Mekong.</h2>
            <p>Selected Phnom Penh Autonomous Port terminals from the 2026 PPAP marketing presentation. Timings and distances are indicative planning references.</p>
          </div>
          <figure className="river-network-map">
            <img src="/images/ports/ppap-waterway-network.webp" alt="Waterway map connecting PPAP river terminals with ports in Cambodia and Vietnam" loading="lazy" />
          </figure>
          <div className="river-terminal-grid">
            {riverTerminals.map((terminal) => (
              <article key={terminal.code}>
                <span>{terminal.code}</span>
                <h3>{terminal.name}</h3>
                <dl>
                  <div><dt>Berths</dt><dd>{terminal.berths}</dd></div>
                  <div><dt>River draft</dt><dd>{terminal.draft}</dd></div>
                  <div><dt>Capacity</dt><dd>{terminal.capacity}</dd></div>
                  <div><dt>Land</dt><dd>{terminal.land}</dd></div>
                  <div><dt>Navigation</dt><dd>{terminal.navigation}</dd></div>
                  <div><dt>Distance</dt><dd>{terminal.distance}</dd></div>
                </dl>
              </article>
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
            <a href="/projects" className="text-link">View all work <ArrowRight size={17} /></a>
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
          <a href="/contact" className="button-primary">Start a conversation <ArrowRight size={18} /></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

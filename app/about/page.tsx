import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { company, operatingPrinciples } from "@/data/company";

export const metadata: Metadata = {
  title: "About",
  description: "About BB Kowloon and its Mekong River logistics operations between Vietnam and Cambodia.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About BB Kowloon"
        title="A logistics operator shaped by the river"
        intro="Focused on safe, timely and cost-efficient cargo movement between Vietnam and Cambodia."
        image="/images/profile/about-port-cranes.webp"
        imageAlt="Port cranes handling cargo beside a vessel"
      />

      <section className="section section--paper">
        <div className="site-shell about-story reveal">
          <SectionHeading eyebrow="Company overview" title="Cross-border experience, end to end" />
          <div className="about-story__body">
            <p>{company.overview}</p>
            <p>{company.approach}</p>
          </div>
        </div>
      </section>

      <section className="section about-capability">
        <div className="site-shell capability-layout reveal">
          <figure className="image-frame image-frame--tall">
            <img src="/images/profile/barge-river.webp" alt="Covered barge navigating a river" loading="lazy" />
          </figure>
          <div>
            <SectionHeading
              eyebrow="Cargo capability"
              title="Configured for varied cargo needs"
              intro="The company profile identifies four principal cargo groups handled through its logistics network."
              light
            />
            <div className="check-list">
              {company.cargoTypes.map((type) => (
                <div key={type}><CheckCircle2 size={20} />{type}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="site-shell">
          <SectionHeading
            eyebrow="Operating commitment"
            title="Reliable movement across the region"
            intro={company.commitment}
          />
          <div className="principle-grid principle-grid--light reveal">
            {operatingPrinciples.map((principle, index) => (
              <article key={principle.title}>
                <span>0{index + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
          <a href="/services" className="text-link mt-10">Explore our services <ArrowRight size={17} /></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

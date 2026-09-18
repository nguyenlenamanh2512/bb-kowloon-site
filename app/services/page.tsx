import type { Metadata } from "next";
import { ArrowRight, PackageCheck, Warehouse } from "lucide-react";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Barge transportation, port operations and cross-border logistics services from BB Kowloon.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Connected logistics across water, port and road"
        intro="Six service areas support cargo movement along BB Kowloon’s Vietnam–Cambodia corridor."
        image="/images/profile/hero-barge.webp"
        imageAlt="BB Kowloon barge at a cargo vessel"
      />

      <section className="section section--paper">
        <div className="site-shell">
          <SectionHeading
            eyebrow="What we do"
            title="A practical service network"
            intro="Each service below is identified in the BB Kowloon company profile."
          />
          <div className="service-detail-grid reveal">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.number}>
                  <div className="service-detail__top">
                    <span>{service.number}</span>
                    <Icon aria-hidden="true" size={28} />
                  </div>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section logistics-chain">
        <div className="site-shell chain-layout reveal">
          <div>
            <SectionHeading
              eyebrow="End-to-end coordination"
              title="From loading point to destination"
              intro="The company profile describes coordinated transport, port, warehousing and forwarding activities."
              light
            />
            <a href="/projects" className="text-link text-link--light">See cargo experience <ArrowRight size={17} /></a>
          </div>
          <ol className="chain-steps">
            <li><span><PackageCheck size={22} /></span><div><strong>Cargo handling</strong><p>Secure loading for bulk, bagged, industrial and project cargo.</p></div></li>
            <li><span><Warehouse size={22} /></span><div><strong>Port &amp; warehousing</strong><p>Coordinated cargo movement through operational logistics points.</p></div></li>
            <li><span>03</span><div><strong>Cross-border delivery</strong><p>River, vessel and road services connected across the route.</p></div></li>
          </ol>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

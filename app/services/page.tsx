import type { Metadata } from "next";
import { ArrowRight, PackageCheck, Warehouse } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { coreService, services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Local ship agency and supporting logistics services from BB Kowloon in Cambodia.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Ship agency, first"
        intro="BB Kowloon is first and foremost a local Cambodia ship agency. Our logistics capabilities support the same port call, cargo movement or customer requirement."
        image="/images/ports/ship-agency-hero.webp"
        imageAlt="Container terminal on the Mekong River in Cambodia"
      />

      <section className="section section--paper">
        <div className="site-shell">
          <SectionHeading eyebrow="Our core service" title="Local support for every call" />
          <article className="core-service-card reveal">
            <div>
              <p className="eyebrow">Core service</p>
              <h2>{coreService.title}</h2>
            </div>
            <p>{coreService.description}</p>
            <a href="/contact#pda-form" className="button-primary">Request a PDA <ArrowRight size={17} /></a>
          </article>

          <div className="supporting-services-heading">
            <SectionHeading
              eyebrow="Supporting logistics services"
              title="One local team around the port call"
              intro="Available as complementary support to an agency appointment — these are not our primary standalone offering."
            />
          </div>
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
            <Link href="/projects" className="text-link text-link--light">See cargo experience <ArrowRight size={17} /></Link>
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

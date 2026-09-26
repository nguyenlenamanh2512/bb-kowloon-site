import type { Metadata } from "next";
import { Globe2, Mail, MapPin, Phone, Ship } from "lucide-react";
import { Suspense } from "react";

import { PageHero } from "@/components/page-hero";
import { PdaInquiryForm } from "@/components/pda-inquiry-form";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { company, portRepresentatives } from "@/data/company";

export const metadata: Metadata = {
  title: "Port PDA & Contact",
  description: "Request a port disbursement estimate or contact BB Kowloon's local representatives in Cambodia.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="PDA inquiry"
        title="Tell us about your port call"
        intro="A PDA depends on the vessel, port, cargo operation and timing. Send these details for an itemized estimate."
        image="/images/ports/ship-agency-hero.webp"
        imageAlt="Container terminal on the Mekong River in Cambodia"
      />

      <section className="section pda-section">
        <div className="site-shell pda-layout reveal">
          <div className="pda-intro">
            <p className="eyebrow">Prepare your request</p>
            <h2>Port details first. Local support next.</h2>
            <p>Please include the vessel&apos;s GT, LOA and draft where available. This form prepares an email inquiry; it does not send your information automatically.</p>
            <div className="pda-intro__note"><Ship size={22} /><span>Selecting a port from the home page will prefill it here.</span></div>
          </div>
          <Suspense fallback={<div className="pda-form" aria-hidden="true" />}>
            <PdaInquiryForm />
          </Suspense>
        </div>
      </section>

      <section className="section section--paper">
        <div className="site-shell">
          <SectionHeading
            eyebrow="International customer support"
            title="Speak with the right representative"
            intro="Chinese, English, Khmer and Vietnamese-speaking support for Cambodia port calls and cargo operations."
          />
          <div className="representative-grid reveal">
            {portRepresentatives.map((person) => (
              <article key={person.id}>
                <p className="eyebrow">{person.languages}</p>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
                <div>
                  {person.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone.replaceAll(" ", "")}`}><Phone size={17} />{phone}</a>
                  ))}
                  <a href={`mailto:${person.email}`}><Mail size={17} />{person.email}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section head-office-section">
        <div className="site-shell contact-layout reveal">
          <div>
            <p className="eyebrow">Head office</p>
            <h2>Phnom Penh, Cambodia</h2>
          </div>
          <div className="contact-list contact-list--panel">
            <p><MapPin size={21} />{company.address}</p>
            <a href={`tel:${company.phone.replaceAll(" ", "")}`}><Phone size={21} />{company.phone}</a>
            <a href={`mailto:${company.email}`}><Mail size={21} />{company.email}</a>
            <a href={`mailto:${company.operationsEmail}`}><Mail size={21} />{company.operationsEmail}</a>
            <a href={`https://${company.website}`} target="_blank" rel="noreferrer"><Globe2 size={21} />{company.website}</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

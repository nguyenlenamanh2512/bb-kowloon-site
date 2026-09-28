import type { Metadata } from "next";
import { ArrowDownToLine, Globe2, Mail, MapPin, Phone, Ship } from "lucide-react";
import { Suspense } from "react";

import { PageHero } from "@/components/page-hero";
import { PdaInquiryForm } from "@/components/pda-inquiry-form";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { company, portRepresentatives } from "@/data/company";
import { ppapPresentation } from "@/data/ppap";

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
              <article key={person.id} className="representative-card">
                <p className="eyebrow">{person.languages}</p>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
                <div className="representative-card__links">
                  {person.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone.replaceAll(" ", "")}`}><Phone size={17} />{phone}</a>
                  ))}
                  <a href={`mailto:${person.email}`}><Mail size={17} />{person.email}</a>
                </div>
                <a
                  className="representative-card__qr"
                  href={person.contactCard}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open the full digital business card for ${person.name}`}
                >
                  <span>Scan to connect</span>
                  <img src={person.qrImage} alt={person.qrAlt} loading="lazy" />
                  <small>Open full digital business card</small>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper" id="ppap-download">
        <div className="site-shell ppap-download">
          <div>
            <p className="eyebrow">Port reference · PDF</p>
            <h2>Take the PPAP terminal guide with you.</h2>
            <p>Download Phnom Penh Autonomous Port&apos;s 2026 presentation for the complete seven-terminal profiles, cargo statistics, activities, connections and development plans. The 48-page PDF is provided by PPAP&apos;s Marketing Team.</p>
            <a className="button-primary" href={ppapPresentation} download="PPAP-2026-presentation.pdf">
              Download PDF (13 MB) <ArrowDownToLine size={18} />
            </a>
          </div>
          <a className="ppap-download__qr" href={ppapPresentation} download="PPAP-2026-presentation.pdf" aria-label="Download the PPAP 2026 presentation using the QR code">
            <img src="/documents/ppap-2026-download-qr.svg" alt="QR code linking to the PPAP 2026 PDF on BBkowloon.com" width="200" height="200" loading="lazy" />
            <span>Scan to download the presentation</span>
          </a>
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

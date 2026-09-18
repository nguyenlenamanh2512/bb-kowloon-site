import type { Metadata } from "next";
import { Globe2, Mail, MapPin, Phone } from "lucide-react";

import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact BB Kowloon Company Limited in Phnom Penh, Cambodia.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Let’s plan the route together"
        intro="Speak with BB Kowloon about barge, breakbulk and cross-border cargo requirements."
        image="/images/profile/kampot-port.webp"
        imageAlt="Aerial view of Kampot Port"
      />

      <section className="section section--paper">
        <div className="site-shell contact-layout reveal">
          <div>
            <p className="eyebrow">Head office</p>
            <h2>Phnom Penh, Cambodia</h2>
            <div className="contact-list">
              <p><MapPin size={21} />{company.address}</p>
              <a href={`tel:${company.phone.replaceAll(" ", "")}`}><Phone size={21} />{company.phone}</a>
              <a href={`mailto:${company.email}`}><Mail size={21} />{company.email}</a>
              <a href={`https://${company.website}`} target="_blank" rel="noreferrer"><Globe2 size={21} />{company.website}</a>
            </div>
          </div>

          <form className="contact-form" action={`mailto:${company.email}`} method="post" encType="text/plain">
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" name="Name" type="text" autoComplete="name" required />
            </div>
            <div>
              <label htmlFor="company">Company</label>
              <input id="company" name="Company" type="text" autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="Email" type="email" autoComplete="email" required />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="Phone" type="tel" autoComplete="tel" />
            </div>
            <div className="contact-form__wide">
              <label htmlFor="message">Cargo or service requirement</label>
              <textarea id="message" name="Message" rows={6} required />
            </div>
            <div className="contact-form__wide form-submit">
              <button type="submit" className="button-primary">Prepare email</button>
              <p>Your email application will open so you can review and send the inquiry.</p>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

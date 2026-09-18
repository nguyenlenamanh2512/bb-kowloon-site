import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { company } from "@/data/company";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div>
          <div className="footer-brand">
            <span className="brand-mark">
              <img src="/images/profile/bb-kowloon-logo.png" alt="" />
            </span>
            <div>
              <strong>{company.shortName}</strong>
              <span>{company.descriptor}</span>
            </div>
          </div>
          <p className="mt-7 max-w-md text-white/65">
            Cross-border cargo transport between Vietnam and Cambodia via the Mekong River.
          </p>
        </div>
        <div>
          <p className="footer-label">Navigate</p>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/services">Services</a>
            <a href="/projects">Cargo &amp; Projects</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
        <div>
          <p className="footer-label">Contact</p>
          <div className="footer-contact">
            <a href={`tel:${company.phone.replaceAll(" ", "")}`}><Phone size={17} />{company.phone}</a>
            <a href={`mailto:${company.email}`}><Mail size={17} />{company.email}</a>
            <p><MapPin size={17} />{company.address}</p>
          </div>
        </div>
      </div>
      <div className="site-shell footer-bottom">
        <span>© BB Kowloon Company Limited</span>
        <a href={`https://${company.website}`} target="_blank" rel="noreferrer">
          {company.website} <ArrowUpRight size={15} />
        </a>
      </div>
    </footer>
  );
}

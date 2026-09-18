import { Menu } from "lucide-react";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Cargo & Projects" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={`site-header ${overlay ? "site-header--overlay" : ""}`}>
      <div className="site-shell flex h-24 items-center justify-between gap-8">
        <a href="/" aria-label="BB Kowloon home" className="brand-lockup">
          <span className="brand-mark">
            <img src="/images/profile/bb-kowloon-logo.png" alt="" />
          </span>
          <span>BB Kowloon Co., Ltd</span>
        </a>

        <nav aria-label="Primary navigation" className="desktop-nav">
          {navigation.slice(0, 3).map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/contact" className="nav-cta">
            Contact
          </a>
        </nav>

        <details className="mobile-nav">
          <summary aria-label="Open navigation menu">
            <Menu aria-hidden="true" size={24} />
          </summary>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

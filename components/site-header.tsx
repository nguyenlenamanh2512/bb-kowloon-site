import { LayoutDashboard, LogIn, Menu } from "lucide-react";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Cargo & Projects" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const user = await getCurrentUser();
  return (
    <header className={`site-header ${overlay ? "site-header--overlay" : ""}`}>
      <div className="site-shell flex h-24 items-center justify-between gap-8">
        <Link href="/" aria-label="BB Kowloon home" className="brand-lockup">
          <span className="brand-mark">
            <img src="/images/profile/bb-kowloon-logo.png" alt="" />
          </span>
          <span>BB Kowloon Co., Ltd</span>
        </Link>

        <nav aria-label="Primary navigation" className="desktop-nav">
          {navigation.slice(0, 3).map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/contact" className="nav-cta">
            Contact
          </a>
          <a href={user ? "/admin" : "/login"} className="nav-account">
            {user ? <LayoutDashboard size={17} /> : <LogIn size={17} />}
            {user ? "CMS" : "Login"}
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
            <a href={user ? "/admin" : "/login"}>{user ? "Open CMS" : "Login"}</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

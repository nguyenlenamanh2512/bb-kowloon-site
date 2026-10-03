import { LogOut } from "lucide-react";
import Link from "next/link";

import { logoutAction } from "@/app/login/actions";
import { requireUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="admin-app">
      <header className="admin-header">
        <Link href="/admin" className="admin-brand"><img src="/images/profile/bb-kowloon-logo.png" alt="" /><span>BB Kowloon CMS</span></Link>
        <nav aria-label="Administration navigation">
          <Link href="/admin">Content</Link>
          {user.group === "Admin" ? <Link href="/admin/users">Accounts</Link> : null}
          <Link href="/projects" target="_blank">View website</Link>
        </nav>
        <div className="admin-user">
          <span><strong>{user.displayName}</strong><small>{user.group}</small></span>
          <form action={logoutAction}><button type="submit" aria-label="Sign out"><LogOut /></button></form>
        </div>
      </header>
      {user.group === "User" ? <div className="readonly-banner">Read-only mode: the User group can view content but cannot create, edit or delete it.</div> : null}
      {children}
    </div>
  );
}

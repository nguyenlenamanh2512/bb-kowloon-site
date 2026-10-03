import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { loginAction } from "@/app/login/actions";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Account login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; returnTo?: string }>;
}) {
  if (await getCurrentUser()) redirect("/admin");
  const query = await searchParams;

  return (
    <main className="login-page">
      <section className="login-panel">
        <Link href="/" className="login-brand">
          <img src="/images/profile/bb-kowloon-logo.png" alt="" />
          <span>BB Kowloon Co., Ltd</span>
        </Link>
        <div>
          <p className="admin-kicker">Content management</p>
          <h1>Welcome back</h1>
          <p>Sign in to manage Cargo &amp; Projects content or review it with read-only access.</p>
        </div>
        {query.error === "invalid" ? <p className="admin-alert admin-alert--error">Incorrect username or password.</p> : null}
        {query.message === "signed-out" ? <p className="admin-alert admin-alert--success">You have been signed out.</p> : null}
        <form action={loginAction} className="login-form">
          <input type="hidden" name="returnTo" value={query.returnTo || "/admin"} />
          <label>Username<input name="username" autoComplete="username" required autoFocus /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="admin-button admin-button--primary" type="submit">Sign in</button>
        </form>
        <Link href="/" className="admin-text-link">← Return to website</Link>
      </section>
      <aside className="login-visual" aria-hidden="true"><span>Secure content operations</span></aside>
    </main>
  );
}

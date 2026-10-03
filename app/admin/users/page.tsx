import { KeyRound, UserPlus } from "lucide-react";

import { createUserAction, deleteUserAction, updateUserPasswordAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/delete-button";
import { requireAdmin } from "@/lib/auth";
import { listUsers } from "@/lib/cms-store";

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ message?: string; error?: string }> }) {
  const [currentUser, users, query] = await Promise.all([requireAdmin(), listUsers(), searchParams]);
  return (
    <main className="admin-main">
      <div className="admin-page-title"><div><p className="admin-kicker">Access control</p><h1>Accounts &amp; groups</h1><p>Admin can manage content and accounts. User has view-only access.</p></div></div>
      {query.message === "created" ? <p className="admin-alert admin-alert--success">Account was created successfully.</p> : null}
      {query.message === "deleted" ? <p className="admin-alert admin-alert--success">Account was deleted successfully.</p> : null}
      {query.message === "password-updated" ? <p className="admin-alert admin-alert--success">Password was changed successfully.</p> : null}
      {query.error ? <p className="admin-alert admin-alert--error">{query.error}</p> : null}
      <div className="user-management">
        <div className="user-management__forms">
          <section className="admin-card">
            <h2><UserPlus /> Create account</h2>
            <form action={createUserAction} className="admin-form">
              <label>Username<input name="username" required /></label>
              <label>Display name<input name="displayName" required /></label>
              <label>Initial password<input name="password" type="password" minLength={3} autoComplete="new-password" required /></label>
              <label>Group<select name="group" defaultValue="User"><option value="User">User — view only</option><option value="Admin">Admin — full access</option></select></label>
              <button type="submit" className="admin-button admin-button--primary">Create account</button>
            </form>
          </section>
          <section className="admin-card">
            <h2><KeyRound /> Change password</h2>
            <form action={updateUserPasswordAction} className="admin-form">
              <label>
                Account
                <select name="userId" defaultValue={currentUser.id} required>
                  {users.map((user) => <option value={user.id} key={user.id}>{user.displayName} (@{user.username})</option>)}
                </select>
              </label>
              <label>New password<input name="password" type="password" minLength={3} autoComplete="new-password" required /></label>
              <label>Confirm new password<input name="passwordConfirmation" type="password" minLength={3} autoComplete="new-password" required /></label>
              <button type="submit" className="admin-button admin-button--primary">Change password</button>
            </form>
          </section>
        </div>
        <section className="admin-card">
          <h2>Existing accounts</h2>
          <div className="user-list">
            {users.map((user) => <article key={user.id}><span className="user-avatar">{user.displayName.slice(0, 1).toUpperCase()}</span><div><strong>{user.displayName}</strong><small>@{user.username}</small></div><span className={`group-pill group-pill--${user.group.toLowerCase()}`}>{user.group}</span>{user.id !== currentUser.id && user.username.toLowerCase() !== "namanh" ? <form action={deleteUserAction}><input type="hidden" name="id" value={user.id} /><DeleteButton label="Delete" /></form> : null}</article>)}
          </div>
        </section>
      </div>
    </main>
  );
}

import { ExternalLink, FilePlus2, Pencil } from "lucide-react";
import Link from "next/link";

import { deletePostAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/delete-button";
import { requireUser } from "@/lib/auth";
import { listPosts } from "@/lib/cms-store";
import { contentTypeLabels } from "@/lib/cms-types";

const notices: Record<string, string> = {
  created: "Content was created successfully.",
  updated: "Changes were saved successfully.",
  deleted: "Content was deleted successfully.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const [user, posts, query] = await Promise.all([requireUser(), listPosts(), searchParams]);
  const isAdmin = user.group === "Admin";

  return (
    <main className="admin-main">
      <div className="admin-page-title">
        <div><p className="admin-kicker">Cargo &amp; Projects</p><h1>Content library</h1><p>{posts.length} items across news, products, activities and events.</p></div>
        {isAdmin ? <Link href="/admin/posts/new" className="admin-button admin-button--primary"><FilePlus2 /> Create content</Link> : null}
      </div>
      {query.message && notices[query.message] ? <p className="admin-alert admin-alert--success">{notices[query.message]}</p> : null}
      {query.error ? <p className="admin-alert admin-alert--error">{query.error === "read-only" ? "Your User account has read-only access." : query.error}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Content</th><th>Type</th><th>Status</th><th>Published</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td><div className="admin-content-cell">{post.featuredImage ? <img src={post.featuredImage} alt="" /> : <span className="admin-content-cell__placeholder">No image</span>}<span><strong>{post.title}</strong><small>{post.category}</small></span></div></td>
                <td><span className={`content-type content-type--${post.type}`}>{contentTypeLabels[post.type]}</span></td>
                <td><span className={`status-pill status-pill--${post.status}`}>{post.status}</span></td>
                <td>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(post.publishedAt || post.createdAt || post.updatedAt))}</td>
                <td><div className="admin-row-actions"><Link href={`/projects/${post.slug}`} target="_blank" aria-label={`View ${post.title}`}><ExternalLink /></Link>{isAdmin ? <><Link href={`/admin/posts/${post.id}/edit`} aria-label={`Edit ${post.title}`}><Pencil /></Link><form action={deletePostAction}><input type="hidden" name="id" value={post.id} /><DeleteButton label="Delete" /></form></> : null}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

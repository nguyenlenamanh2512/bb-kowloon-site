import { notFound } from "next/navigation";

import { PostEditor } from "@/components/post-editor";
import { requireAdmin } from "@/lib/auth";
import { getPostById } from "@/lib/cms-store";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const post = await getPostById(id);
  if (!post) notFound();
  return <main className="admin-main admin-main--editor"><PostEditor post={post} error={query.error} /></main>;
}

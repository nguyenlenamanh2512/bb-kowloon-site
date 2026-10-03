import { PostEditor } from "@/components/post-editor";
import { requireAdmin } from "@/lib/auth";

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const query = await searchParams;
  return <main className="admin-main admin-main--editor"><PostEditor error={query.error} /></main>;
}

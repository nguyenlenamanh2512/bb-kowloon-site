"use server";

import { redirect } from "next/navigation";

import { createSession, destroySession, safeReturnTo } from "@/lib/auth";
import { authenticateUser } from "@/lib/cms-store";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const returnTo = safeReturnTo(formData.get("returnTo"));
  const user = await authenticateUser(username, password);

  if (!user) {
    redirect(`/login?error=invalid&returnTo=${encodeURIComponent(returnTo)}`);
  }

  await createSession(user);
  redirect(returnTo);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login?message=signed-out");
}

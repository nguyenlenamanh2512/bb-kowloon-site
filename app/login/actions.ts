"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createSession, destroySession, safeReturnTo } from "@/lib/auth";
import { authenticateUser } from "@/lib/cms-store";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const returnTo = safeReturnTo(formData.get("returnTo"));
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const ipAddress = forwardedFor?.at(-1)
    || requestHeaders.get("x-real-ip")
    || requestHeaders.get("cf-connecting-ip")
    || "unknown";
  const authentication = await authenticateUser(username, password, {
    ipAddress,
    userAgent: requestHeaders.get("user-agent") || "unknown",
  });

  if (authentication.status === "locked") {
    redirect(`/login?error=locked&returnTo=${encodeURIComponent(returnTo)}`);
  }
  if (authentication.status === "invalid") {
    redirect(`/login?error=invalid&returnTo=${encodeURIComponent(returnTo)}`);
  }

  await createSession(authentication.user);
  redirect(returnTo);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login?message=signed-out");
}

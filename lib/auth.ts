import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUserById } from "@/lib/cms-store";
import type { PublicUser } from "@/lib/cms-types";

const SESSION_COOKIE = "bbk_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const localDevelopmentSecret = "bb-kowloon-local-development-session-secret";

type SessionPayload = {
  sub: string;
  exp: number;
};

function sessionSecret() {
  return process.env.AUTH_SECRET || localDevelopmentSecret;
}

function signature(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function parseSession(value: string | undefined): SessionPayload | null {
  if (!value) return null;
  const [payload, suppliedSignature] = value.split(".");
  if (!payload || !suppliedSignature) return null;
  const expected = Buffer.from(signature(payload));
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (!session.sub || session.exp <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function createSession(user: PublicUser) {
  const payload = Buffer.from(
    JSON.stringify({ sub: user.id, exp: Date.now() + SESSION_DURATION_SECONDS * 1000 }),
  ).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${payload}.${signature(payload)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return getUserById(session.sub);
}

export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/admin");
  return user;
}

export async function requireAdmin(): Promise<PublicUser> {
  const user = await requireUser();
  if (user.group !== "Admin") redirect("/admin?error=read-only");
  return user;
}

export function safeReturnTo(value: FormDataEntryValue | null) {
  const returnTo = typeof value === "string" ? value : "/admin";
  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) return "/admin";
  return returnTo.startsWith("/login") ? "/admin" : returnTo;
}

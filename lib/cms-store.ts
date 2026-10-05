import "server-only";

import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { projects } from "@/data/projects";
import type {
  CmsDatabase,
  CmsPost,
  CmsUser,
  ContentBlock,
  LoginAttemptState,
  PublicUser,
  UserGroup,
} from "@/lib/cms-types";

const dataDirectory =
  process.env.DATA_DIR || path.join(process.cwd(), "storage");
const databasePath = path.join(dataDirectory, "cms-data.json");
const authAuditPath = path.join(dataDirectory, "auth-audit.log");
let writeQueue: Promise<unknown> = Promise.resolve();

export const MIN_PASSWORD_LENGTH = 12;
const MAX_LOGIN_FAILURES = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPT_RETENTION_MS = 24 * 60 * 60 * 1000;
const MAX_LOGIN_ATTEMPT_BUCKETS = 5_000;
const DUMMY_PASSWORD_SALT = "4f82b37c2195a71b8c53599f6f10df68";

export type AuthenticationContext = {
  ipAddress: string;
  userAgent: string;
};

export type AuthenticationResult =
  | { status: "success"; user: PublicUser }
  | { status: "invalid" }
  | { status: "locked"; retryAfterSeconds: number };

function validatePassword(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function createPassword(password: string) {
  validatePassword(password);
  const passwordSalt = randomBytes(16).toString("hex");
  return {
    passwordSalt,
    passwordHash: hashPassword(password, passwordSalt),
  };
}

function bootstrapAdmin(createdAt: string): CmsUser | null {
  const username = process.env.CMS_BOOTSTRAP_USERNAME?.trim() || "";
  const displayName = process.env.CMS_BOOTSTRAP_DISPLAY_NAME?.trim() || "";
  const password = process.env.CMS_BOOTSTRAP_PASSWORD || "";
  const suppliedValues = [username, displayName, password].filter(Boolean).length;

  if (suppliedValues === 0) return null;
  if (suppliedValues !== 3) {
    throw new Error(
      "CMS_BOOTSTRAP_USERNAME, CMS_BOOTSTRAP_DISPLAY_NAME and CMS_BOOTSTRAP_PASSWORD must all be set.",
    );
  }
  if (username.length > 80 || displayName.length > 120) {
    throw new Error("The bootstrap administrator name is too long.");
  }

  return {
    id: randomUUID(),
    username,
    displayName,
    group: "Admin",
    ...createPassword(password),
    createdAt,
  };
}

function safeUser(user: CmsUser): PublicUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    group: user.group,
    createdAt: user.createdAt,
  };
}

function textBlock(text: string): ContentBlock {
  return { id: randomUUID(), type: "paragraph", text };
}

function initialDatabase(): CmsDatabase {
  const createdAt = new Date().toISOString();
  const administrator = bootstrapAdmin(createdAt);
  const authorId = administrator?.id || "system";

  const seededPosts: CmsPost[] = projects.map((project, index) => ({
    id: randomUUID(),
    slug: project.slug,
    title: project.title,
    type: index % 3 === 0 ? "activity" : "product",
    category: project.category,
    summary: project.summary,
    featuredImage: project.image,
    featuredImageAlt: `${project.title} cargo operation`,
    status: "published",
    cargo: project.cargo,
    route: project.route,
    client: project.client,
    specification: project.specification,
    scope: project.scope,
    blocks: [
      {
        id: randomUUID(),
        type: "heading",
        level: 2,
        text: "Operation overview",
      },
      textBlock(project.summary),
      {
        id: randomUUID(),
        type: "quote",
        text: "Safe coordination, clear communication and careful cargo handling guide every operation.",
        citation: "BB Kowloon operations team",
      },
    ],
    publishedAt: createdAt,
    createdAt,
    updatedAt: createdAt,
    authorId,
  }));

  seededPosts.unshift({
    id: randomUUID(),
    slug: "mekong-project-cargo-showcase",
    title: "Mekong Project Cargo Showcase",
    type: "event",
    category: "Demo event",
    summary:
      "A complete demo article showing rich content blocks, an embedded YouTube clip and an image slideshow.",
    featuredImage: "/images/profile/hero-barge.webp",
    featuredImageAlt: "Barge carrying project cargo on the Mekong River",
    status: "published",
    route: "Vietnam → Cambodia via the Mekong River",
    cargo: "Project and oversized cargo",
    scope: "Planning, loading supervision, barging and delivery coordination",
    blocks: [
      {
        id: randomUUID(),
        type: "heading",
        level: 2,
        text: "One article, every content feature",
      },
      textBlock(
        "This demo entry is ready for review. Administrators can edit, reorder or remove each block independently in the CMS.",
      ),
      {
        id: randomUUID(),
        type: "list",
        items: [
          "Reusable text, headings, quotes and lists",
          "YouTube embeds with a privacy-enhanced player",
          "Responsive image slideshow with keyboard-friendly controls",
        ],
      },
      {
        id: randomUUID(),
        type: "youtube",
        url: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
        caption: "YouTube embed demonstration — replace this URL with your own operation video.",
      },
      {
        id: randomUUID(),
        type: "slideshow",
        images: [
          {
            src: "/images/profile/barge-river.webp",
            alt: "Cargo barge navigating the river",
            caption: "River transport along the Mekong corridor",
          },
          {
            src: "/images/profile/steel-cargo.webp",
            alt: "Steel cargo lifted beside a vessel",
            caption: "Coordinated breakbulk cargo handling",
          },
          {
            src: "/images/profile/oversized-pipes.webp",
            alt: "Oversized pipes loaded on a barge",
            caption: "Oversized project cargo preparation",
          },
        ],
      },
    ],
    publishedAt: createdAt,
    createdAt,
    updatedAt: createdAt,
    authorId,
  });

  return {
    version: 1,
    users: administrator ? [administrator] : [],
    posts: seededPosts,
  };
}

function addBootstrapAdminIfNeeded(database: CmsDatabase) {
  if (database.users.length > 0) return false;
  const administrator = bootstrapAdmin(new Date().toISOString());
  if (!administrator) return false;
  database.users.push(administrator);
  for (const post of database.posts) {
    if (!post.authorId || post.authorId === "system") post.authorId = administrator.id;
  }
  return true;
}

async function persist(database: CmsDatabase) {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = `${databasePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(database, null, 2), "utf8");
  try {
    await rename(temporaryPath, databasePath);
  } catch {
    await writeFile(databasePath, JSON.stringify(database, null, 2), "utf8");
  }
}

async function readDatabase(): Promise<CmsDatabase> {
  try {
    const raw = await readFile(databasePath, "utf8");
    const database = JSON.parse(raw) as CmsDatabase;
    if (addBootstrapAdminIfNeeded(database)) await persist(database);
    return database;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code && nodeError.code !== "ENOENT") throw error;
    const database = initialDatabase();
    await persist(database);
    return database;
  }
}

async function mutate<T>(operation: (database: CmsDatabase) => T | Promise<T>) {
  const next = writeQueue.then(async () => {
    const database = await readDatabase();
    const result = await operation(database);
    await persist(database);
    return result;
  });
  writeQueue = next.catch(() => undefined);
  return next;
}

function loginBucketKey(scope: "account" | "ip", value: string) {
  return `${scope}:${createHash("sha256").update(value).digest("hex")}`;
}

function activeLockMilliseconds(state: LoginAttemptState | undefined, now: number) {
  if (!state?.lockedUntil) return 0;
  return Math.max(0, Date.parse(state.lockedUntil) - now);
}

function registerLoginFailure(state: LoginAttemptState | undefined, now: number): LoginAttemptState {
  const nowIso = new Date(now).toISOString();
  const windowExpired = !state || now - Date.parse(state.windowStartedAt) >= LOGIN_WINDOW_MS;
  const failures = windowExpired ? 1 : state.failures + 1;
  return {
    failures,
    windowStartedAt: windowExpired ? nowIso : state.windowStartedAt,
    lastFailedAt: nowIso,
    updatedAt: nowIso,
    lockedUntil: failures >= MAX_LOGIN_FAILURES
      ? new Date(now + LOGIN_LOCK_MS).toISOString()
      : undefined,
  };
}

function cleanupLoginAttempts(attempts: Record<string, LoginAttemptState>, now: number) {
  for (const [key, state] of Object.entries(attempts)) {
    const updatedAt = Date.parse(state.updatedAt);
    if (!Number.isFinite(updatedAt) || now - updatedAt > LOGIN_ATTEMPT_RETENTION_MS) delete attempts[key];
  }

  const entries = Object.entries(attempts);
  if (entries.length <= MAX_LOGIN_ATTEMPT_BUCKETS) return;
  entries
    .sort(([, left], [, right]) => Date.parse(left.updatedAt) - Date.parse(right.updatedAt))
    .slice(0, entries.length - MAX_LOGIN_ATTEMPT_BUCKETS)
    .forEach(([key]) => delete attempts[key]);
}

type AuthAuditEvent = {
  timestamp: string;
  outcome: "success" | "invalid" | "locked";
  username: string;
  ipAddress: string;
  userAgent: string;
};

async function writeAuthAudit(event: AuthAuditEvent) {
  try {
    await mkdir(dataDirectory, { recursive: true });
    await appendFile(authAuditPath, `${JSON.stringify(event)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
  } catch {
    console.error("Authentication audit logging failed.");
  }
}

export async function authenticateUser(
  username: string,
  password: string,
  context: AuthenticationContext,
): Promise<AuthenticationResult> {
  const normalizedUsername = username.trim().toLowerCase().slice(0, 80);
  const ipAddress = context.ipAddress.trim().slice(0, 100) || "unknown";
  const userAgent = context.userAgent.trim().slice(0, 300) || "unknown";

  const authentication = await mutate((database) => {
    const now = Date.now();
    database.loginSecurity ||= { attempts: {} };
    const attempts = database.loginSecurity.attempts;
    cleanupLoginAttempts(attempts, now);

    const accountKey = loginBucketKey("account", normalizedUsername || "empty");
    const ipKey = loginBucketKey("ip", ipAddress);
    const lockMilliseconds = Math.max(
      activeLockMilliseconds(attempts[accountKey], now),
      activeLockMilliseconds(attempts[ipKey], now),
    );

    if (lockMilliseconds > 0) {
      return {
        result: {
          status: "locked",
          retryAfterSeconds: Math.max(1, Math.ceil(lockMilliseconds / 1000)),
        } satisfies AuthenticationResult,
        outcome: "locked" as const,
      };
    }

    const user = database.users.find(
      (candidate) => candidate.username.toLowerCase() === normalizedUsername,
    );
    const supplied = Buffer.from(
      hashPassword(password, user?.passwordSalt || DUMMY_PASSWORD_SALT),
      "hex",
    );
    const actual = user ? Buffer.from(user.passwordHash, "hex") : Buffer.alloc(supplied.length);
    const passwordMatches = actual.length === supplied.length && timingSafeEqual(actual, supplied);

    if (!user || !passwordMatches) {
      attempts[accountKey] = registerLoginFailure(attempts[accountKey], now);
      attempts[ipKey] = registerLoginFailure(attempts[ipKey], now);
      const newLockMilliseconds = Math.max(
        activeLockMilliseconds(attempts[accountKey], now),
        activeLockMilliseconds(attempts[ipKey], now),
      );
      return {
        result: newLockMilliseconds > 0
          ? {
              status: "locked",
              retryAfterSeconds: Math.ceil(newLockMilliseconds / 1000),
            } satisfies AuthenticationResult
          : { status: "invalid" } satisfies AuthenticationResult,
        outcome: newLockMilliseconds > 0 ? "locked" as const : "invalid" as const,
      };
    }

    delete attempts[accountKey];
    delete attempts[ipKey];
    return {
      result: { status: "success", user: safeUser(user) } satisfies AuthenticationResult,
      outcome: "success" as const,
    };
  });

  await writeAuthAudit({
    timestamp: new Date().toISOString(),
    outcome: authentication.outcome,
    username: normalizedUsername || "empty",
    ipAddress,
    userAgent,
  });
  return authentication.result;
}

export async function getUserById(id: string) {
  const database = await readDatabase();
  const user = database.users.find((candidate) => candidate.id === id);
  return user ? safeUser(user) : null;
}

export async function listUsers() {
  const database = await readDatabase();
  return database.users.map(safeUser).sort((a, b) => a.username.localeCompare(b.username));
}

export async function createUser(input: {
  username: string;
  displayName: string;
  password: string;
  group: UserGroup;
}) {
  return mutate((database) => {
    if (
      database.users.some(
        (user) => user.username.toLowerCase() === input.username.trim().toLowerCase(),
      )
    ) {
      throw new Error("Username already exists.");
    }
    const user: CmsUser = {
      id: randomUUID(),
      username: input.username.trim(),
      displayName: input.displayName.trim(),
      group: input.group,
      ...createPassword(input.password),
      createdAt: new Date().toISOString(),
    };
    database.users.push(user);
    return safeUser(user);
  });
}

export async function deleteUser(id: string, currentUserId: string) {
  return mutate((database) => {
    if (id === currentUserId) throw new Error("You cannot delete your own account.");
    const user = database.users.find((candidate) => candidate.id === id);
    if (!user) throw new Error("Account not found.");
    if (user.group === "Admin" && database.users.filter((candidate) => candidate.group === "Admin").length === 1) {
      throw new Error("The final administrator account cannot be deleted.");
    }
    database.users = database.users.filter((candidate) => candidate.id !== id);
  });
}

export async function updateUserPassword(id: string, password: string) {
  return mutate((database) => {
    const user = database.users.find((candidate) => candidate.id === id);
    if (!user) throw new Error("Account not found.");
    Object.assign(user, createPassword(password));
    return safeUser(user);
  });
}

export async function listPosts(options?: { publishedOnly?: boolean }) {
  const database = await readDatabase();
  return database.posts
    .filter((post) => !options?.publishedOnly || post.status === "published")
    .sort((a, b) => {
      const aDate = a.publishedAt || a.createdAt || a.updatedAt;
      const bDate = b.publishedAt || b.createdAt || b.updatedAt;
      return bDate.localeCompare(aDate);
    });
}

export async function getPostBySlug(slug: string) {
  const database = await readDatabase();
  return database.posts.find((post) => post.slug === slug) ?? null;
}

export async function getPostById(id: string) {
  const database = await readDatabase();
  return database.posts.find((post) => post.id === id) ?? null;
}

function normalizedSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `post-${Date.now()}`;
}

export async function savePost(
  input: Omit<CmsPost, "id" | "createdAt" | "updatedAt" | "authorId"> & {
    id?: string;
  },
  authorId: string,
) {
  return mutate((database) => {
    const now = new Date().toISOString();
    const baseSlug = normalizedSlug(input.slug || input.title);
    let slug = baseSlug;
    let suffix = 2;
    while (database.posts.some((post) => post.slug === slug && post.id !== input.id)) {
      slug = `${baseSlug}-${suffix++}`;
    }

    if (input.id) {
      const index = database.posts.findIndex((post) => post.id === input.id);
      if (index < 0) throw new Error("Content item not found.");
      const existing = database.posts[index];
      const updated: CmsPost = {
        ...existing,
        ...input,
        id: existing.id,
        slug,
        updatedAt: now,
        authorId,
      };
      database.posts[index] = updated;
      return updated;
    }

    const post: CmsPost = {
      ...input,
      id: randomUUID(),
      slug,
      createdAt: now,
      updatedAt: now,
      authorId,
    };
    database.posts.unshift(post);
    return post;
  });
}

export async function deletePost(id: string) {
  return mutate((database) => {
    const originalLength = database.posts.length;
    database.posts = database.posts.filter((post) => post.id !== id);
    if (database.posts.length === originalLength) throw new Error("Content item not found.");
  });
}

export function stableContentDigest(post: CmsPost) {
  return createHash("sha256").update(JSON.stringify(post)).digest("hex").slice(0, 12);
}

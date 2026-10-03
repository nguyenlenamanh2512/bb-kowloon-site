export type UserGroup = "Admin" | "User";

export type CmsUser = {
  id: string;
  username: string;
  displayName: string;
  group: UserGroup;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Omit<CmsUser, "passwordSalt" | "passwordHash">;

export type ContentType = "news" | "product" | "activity" | "event";

export type CmsImage = { src: string; alt: string; caption?: string };

export type ContentBlock =
  | { id: string; type: "heading"; level: 2 | 3; text: string }
  | { id: string; type: "paragraph"; text: string; html?: string }
  | { id: string; type: "quote"; text: string; citation?: string }
  | { id: string; type: "list"; items: string[] }
  | { id: string; type: "image"; src: string; alt: string; caption?: string }
  | { id: string; type: "youtube"; url: string; caption?: string }
  | {
      id: string;
      type: "slideshow";
      images: CmsImage[];
    };

export type CmsPost = {
  id: string;
  slug: string;
  title: string;
  type: ContentType;
  category: string;
  summary: string;
  featuredImage: string;
  featuredImageAlt: string;
  status: "draft" | "published";
  cargo?: string;
  route?: string;
  client?: string;
  specification?: string;
  scope?: string;
  blocks: ContentBlock[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
};

export type CmsDatabase = {
  version: 1;
  users: CmsUser[];
  posts: CmsPost[];
};

export const contentTypeLabels: Record<ContentType, string> = {
  news: "News",
  product: "Product",
  activity: "Activity",
  event: "Event",
};

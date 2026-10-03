declare namespace Cloudflare {
  interface Env {
    CMS_KV?: KVNamespace;
    DB?: D1Database;
    BUCKET?: R2Bucket;
    AUTH_SECRET?: string;
    CMS_BOOTSTRAP_USERNAME?: string;
    CMS_BOOTSTRAP_DISPLAY_NAME?: string;
    CMS_BOOTSTRAP_PASSWORD?: string;
  }
}

/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in production so metadata,
 * Open Graph tags and the sitemap point at the deployed domain.
 */
const fallback = "http://localhost:3000";

export const SITE_URL: string = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallback;
  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
})();

/** Path of the optional resume PDF. Served from /public when the file exists. */
export const RESUME_PATH = "/resume.pdf";

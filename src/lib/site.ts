/** Origem canônica de produção — OG, canonical e links de anúncio. */
export const SITE_ORIGIN = "https://jogadorprosystem.com";

export const OG_IMAGE = `${SITE_ORIGIN}/og-cover.jpg`;

export function siteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${p}`;
}

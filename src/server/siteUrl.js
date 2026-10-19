// The site's public origin, for canonical links, the logo in the business
// structured data, robots.txt and sitemap.xml. NEXT_PUBLIC_SITE_URL overrides
// it; on Vercel its production hostname is used. Otherwise production builds
// (Hostinger) use the live domain -- a localhost fallback there made every
// canonical link and the logo URL point at localhost, so Google could not use
// them.
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return process.env.NODE_ENV === 'production' ? 'https://www.kailvarn.com' : 'http://localhost:3000';
}

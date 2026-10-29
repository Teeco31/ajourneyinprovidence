/** Public settings, read at build time. Safe for client components. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ajourneyinprovidence.com").replace(/\/$/, "");

export const env = {
  rsvpEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_RSVP ?? "",
  contactEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_CONTACT ?? "",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
};

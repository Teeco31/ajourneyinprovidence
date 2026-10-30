/** Public settings, read at build time. Safe for client components. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ajourneyinprovidence.com").replace(/\/$/, "");

const contactEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT || "https://formspree.io/f/mnppzeal";

export const env = {
  contactEndpoint,
  // RSVPs can go to their own Formspree form. If none is set they share the contact form; each submission
  // carries a `form` field ("rsvp" or "contact") and a subject, so they are easy to tell apart in the inbox.
  rsvpEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_RSVP || contactEndpoint,
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
};

/** Shown in form error messages only when Contentful has no publisher email yet. Set the real one in Contentful. */
export const fallbackContactEmail = "dabsoyibo@gmail.com";

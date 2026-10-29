import { loadContent } from "./contentful";
import type { EventItem } from "./types";

/**
 * All site content, fetched once per build from Contentful. Server components only:
 * client components must take what they need as props and import from ./types or ./env.
 */
export const content = await loadContent();

/** The event the hero countdown and structured data point at: the next one that has not ended, else the latest. */
export function primaryEvent(): EventItem | undefined {
  const now = Date.now();
  return content.events.find((e) => new Date(e.end).getTime() >= now) ?? content.events[content.events.length - 1];
}

export { siteUrl, env } from "./env";
export { storeHref, eventStatus } from "./types";
export type * from "./types";

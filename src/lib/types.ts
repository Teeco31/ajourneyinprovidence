/** Shapes the site renders. Contentful entries are mapped into these in contentful.ts. Safe to import from client components. */

export type Highlight = { period: string; title: string; body: string };

export type SiteContent = {
  book: {
    title: string;
    subtitle: string;
    blurb: string;
    synopsis: string[];
    closing: string;
    themes: string[];
    publisher: string;
    pages: string;
    samplePdf: string;
  };
  author: { name: string; shortName: string; bio: string[]; highlights: Highlight[] };
  contact: { email: string; phone: string; bulkOrderNote: string };
  social: { instagram: string; x: string; linkedin: string; facebook: string };
  pressKit: { label: string; href: string }[];
};

export type EventItem = {
  id: string;
  title: string;
  kind: string;
  countdownLabel: string;
  start: string;
  end: string;
  launchConfirmed: boolean;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  address: string;
  mapQuery: string;
  details: string;
  dressCode: string;
  livestreamUrl: string;
  infoUrl: string;
  statusOverride: string;
  rsvp: boolean;
  /** Link to this event's photos, set automatically when photos are attached to the event. */
  gallery: string;
};

/** A picture with its real size, so the page can reserve space and size the 3D spine correctly. */
export type Picture = { src: string; width: number; height: number };

/** Hardback or paperback. Each has its own ISBN and its own pictures. */
export type Edition = {
  id: string;
  name: string;
  isbn: string;
  note: string;
  cover: Picture | null;
  spine: Picture | null;
  fullJacket: Picture | null;
};
export type Store = { id: string; name: string; note: string; url: string; format: string; priceNgn: string; priceUsd: string };
export type Endorsement = { quote: string; name: string; title: string };
export type PressItem = { outlet: string; headline: string; url: string; date: string };
export type Photo = { id: string; src: string; alt: string; caption: string; eventId: string; eventTitle: string; takenOn: string; featured: boolean };
export type Trailer = { title: string; youtubeId: string; src: string; poster: string; caption: string };

export type EventStatus = "Upcoming" | "Live" | "Past";

export function eventStatus(e: Pick<EventItem, "start" | "end" | "statusOverride">, now: number): EventStatus {
  if (e.statusOverride === "Live" || e.statusOverride === "Upcoming" || e.statusOverride === "Past") {
    return e.statusOverride;
  }
  if (now > new Date(e.end).getTime()) return "Past";
  if (now >= new Date(e.start).getTime()) return "Live";
  return "Upcoming";
}

/** Adds UTM tags so store sales can be traced in analytics. */
export function storeHref(url: string, storeId: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "ajourneyinprovidence");
    u.searchParams.set("utm_medium", "website");
    u.searchParams.set("utm_campaign", "book_launch");
    u.searchParams.set("utm_content", storeId);
    return u.toString();
  } catch {
    return url;
  }
}

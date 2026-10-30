import fs from "node:fs";
import path from "node:path";
import { createClient } from "contentful";
import type { EventItem, Edition, Endorsement, PressItem, Photo, Picture, SiteContent, Store, Trailer } from "./types";

export type Content = {
  site: SiteContent;
  events: EventItem[];
  editions: Edition[];
  stores: Store[];
  endorsements: Endorsement[];
  press: PressItem[];
  photos: Photo[];
  trailers: Trailer[];
};

type Fields = Record<string, unknown>;
type Linked = { fields?: Fields } | undefined;

const str = (f: Fields, k: string): string => (typeof f[k] === "string" ? (f[k] as string).trim() : "");
const bool = (f: Fields, k: string, fallback = false): boolean => (typeof f[k] === "boolean" ? (f[k] as boolean) : fallback);
const list = (f: Fields, k: string): string[] => (Array.isArray(f[k]) ? (f[k] as unknown[]).filter((v): v is string => typeof v === "string") : []);
const paragraphs = (text: string): string[] => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** Contentful gives protocol-less URLs ("//images.ctfassets.net/..."). */
function assetUrl(asset: unknown): string {
  const file = (asset as Linked)?.fields?.file as { url?: string } | undefined;
  if (!file?.url) return "";
  return file.url.startsWith("//") ? `https:${file.url}` : file.url;
}

/** A Contentful image asset with its real pixel size, or null when the field is empty. */
function assetPicture(asset: unknown): Picture | null {
  const file = (asset as Linked)?.fields?.file as { url?: string; details?: { image?: { width?: number; height?: number } } } | undefined;
  const src = assetUrl(asset);
  const size = file?.details?.image;
  return src && size?.width && size?.height ? { src, width: size.width, height: size.height } : null;
}

const shortDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" }) : "";

async function fromContentful(): Promise<Content> {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
    environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
    // Optional: "cdn.eu.contentful.com" for EU-hosted spaces.
    ...(process.env.CONTENTFUL_HOST ? { host: process.env.CONTENTFUL_HOST, insecure: process.env.CONTENTFUL_HOST.startsWith("localhost") } : {}),
  });

  const get = async (type: string, order?: string[]) => {
    const res = await client.getEntries({ content_type: type, include: 2, limit: 1000, ...(order ? { order } : {}) } as never);
    return (res.items as unknown as { sys: { id: string }; fields: Fields }[]);
  };

  const [settings, highlights, events, editions, stores, endorsements, press, photos, videos, kit] = await Promise.all([
    get("siteSettings"),
    get("authorHighlight", ["fields.order"]),
    get("event", ["fields.start"]),
    get("edition", ["fields.order"]),
    get("store", ["fields.order"]),
    get("endorsement", ["fields.order"]),
    get("pressItem", ["-fields.publishedOn"]),
    get("galleryPhoto", ["-fields.takenOn", "-sys.createdAt"]),
    get("video", ["fields.order"]),
    get("pressKitFile", ["fields.order"]),
  ]);

  const s = settings[0]?.fields;
  if (!s) throw new Error('Contentful has no "Site settings" entry. Run `npm run cms:seed` or create one in Contentful.');

  const photoList: Photo[] = photos
    .map(({ sys, fields: f }) => {
      const ev = (f.event as Linked)?.fields;
      return {
        id: sys.id,
        src: assetUrl(f.photo),
        alt: str(f, "alt"),
        caption: str(f, "caption"),
        eventId: ev ? str(ev, "slug") : "",
        eventTitle: ev ? str(ev, "title") : "",
        takenOn: str(f, "takenOn"),
        featured: bool(f, "featured"),
      };
    })
    .filter((p) => p.src);

  const withPhotos = new Set(photoList.map((p) => p.eventId).filter(Boolean));

  return {
    site: {
      book: {
        title: str(s, "bookTitle"),
        subtitle: str(s, "bookSubtitle"),
        blurb: str(s, "blurb"),
        synopsis: paragraphs(str(s, "story")),
        closing: str(s, "closing"),
        themes: list(s, "themes"),
        publisher: str(s, "publisher"),
        pages: str(s, "pages"),
        samplePdf: assetUrl(s.samplePdf),
      },
      author: {
        name: str(s, "authorName"),
        shortName: str(s, "authorShortName"),
        bio: paragraphs(str(s, "bio")),
        highlights: highlights.map(({ fields: f }) => ({ period: str(f, "period"), title: str(f, "title"), body: str(f, "body") })),
      },
      contact: { email: str(s, "contactEmail"), phone: str(s, "contactPhone"), bulkOrderNote: str(s, "bulkOrderNote") },
      social: { instagram: str(s, "instagram"), x: str(s, "x"), linkedin: str(s, "linkedin"), facebook: str(s, "facebook") },
      pressKit: kit.map(({ fields: f }) => ({ label: str(f, "label"), href: assetUrl(f.file) })).filter((k) => k.href),
    },
    events: events.map(({ fields: f }) => {
      const id = str(f, "slug");
      return {
        id,
        title: str(f, "title"),
        kind: str(f, "kind"),
        countdownLabel: str(f, "countdownLabel") || `${str(f, "title")} starts in`,
        start: str(f, "start"),
        end: str(f, "end"),
        launchConfirmed: bool(f, "launchConfirmed"),
        dateLabel: str(f, "dateLabel"),
        timeLabel: str(f, "timeLabel"),
        venue: str(f, "venue"),
        address: str(f, "address"),
        mapQuery: str(f, "mapQuery") || `${str(f, "venue")}, ${str(f, "address")}`,
        details: str(f, "details"),
        dressCode: str(f, "dressCode"),
        livestreamUrl: str(f, "livestreamUrl"),
        infoUrl: str(f, "infoUrl"),
        statusOverride: str(f, "statusOverride"),
        rsvp: bool(f, "rsvp", true),
        gallery: withPhotos.has(id) ? `/gallery/#event-${id}` : "",
      };
    }),
    editions: editions
      .map(({ sys, fields: f }) => ({
        id: sys.id,
        name: str(f, "name"),
        isbn: str(f, "isbn"),
        note: str(f, "note"),
        cover: assetPicture(f.cover),
        spine: assetPicture(f.spine),
        fullJacket: assetPicture(f.fullJacket),
      }))
      .filter((e) => e.name),
    stores: stores.map(({ sys, fields: f }) => ({
      id: sys.id,
      name: str(f, "name"),
      note: str(f, "note"),
      url: str(f, "url"),
      format: str(f, "format"),
      priceNgn: str(f, "priceNgn"),
      priceUsd: str(f, "priceUsd"),
    })),
    endorsements: endorsements.map(({ fields: f }) => ({ quote: str(f, "quote"), name: str(f, "name"), title: str(f, "role") })),
    press: press.map(({ fields: f }) => ({ outlet: str(f, "outlet"), headline: str(f, "headline"), url: str(f, "url"), date: shortDate(str(f, "publishedOn")) })),
    photos: photoList,
    trailers: videos.map(({ fields: f }) => ({
      title: str(f, "title"),
      caption: str(f, "caption"),
      youtubeId: str(f, "youtubeId"),
      src: assetUrl(f.file),
      poster: assetUrl(f.poster),
    })),
  };
}

/** Local development without Contentful keys: use the seed files. The seed script uploads the same files to Contentful. */
function fromSeed(): Content {
  const read = <T>(name: string): T => JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/seed", name), "utf8")) as T;
  const site = read<SiteContent>("site.json");
  return {
    site: { ...site, pressKit: [] },
    events: read<EventItem[]>("events.json").map((e) => ({ ...e, gallery: "" })),
    editions: read<Edition[]>("editions.json"),
    stores: [],
    endorsements: [],
    press: [],
    photos: [],
    trailers: [],
  };
}

// A build starts several workers and each one loads the content. They share one fetch through a short-lived file,
// and a failed fetch is retried, so a flaky connection does not fail the whole build.
const CACHE_FILE = path.join(
  process.cwd(),
  `node_modules/.cache/ajip-content-${process.env.CONTENTFUL_SPACE_ID}-${process.env.CONTENTFUL_ENVIRONMENT || "master"}.json`,
);
const CACHE_SECONDS = 30;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(): Promise<Content> {
  try {
    if (Date.now() - fs.statSync(CACHE_FILE).mtimeMs < CACHE_SECONDS * 1000) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as Content;
    }
  } catch {
    // No usable cache. Fetch.
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const data = await fromContentful();
      fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
      const temp = `${CACHE_FILE}.${process.pid}.tmp`;
      fs.writeFileSync(temp, JSON.stringify(data));
      fs.renameSync(temp, CACHE_FILE);
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < 4) await sleep(2000 * attempt);
    }
  }
  throw lastError;
}

export async function loadContent(): Promise<Content> {
  const configured = Boolean(process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_DELIVERY_TOKEN);
  if (configured) return fetchWithRetry();
  if (process.env.CI) {
    throw new Error("CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_TOKEN must be set for a production build.");
  }
  console.warn("[content] Contentful keys not set. Using content/seed for local development.");
  return fromSeed();
}

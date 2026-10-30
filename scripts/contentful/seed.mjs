// Loads the known content (book, author, NAPE event, trailers) into Contentful. Run after the model: npm run cms:seed
// Safe to run again: it only creates what is missing and never overwrites an entry that already exists,
// so nothing the client has edited in Contentful is lost.
// Not seeded on purpose: stores, endorsements, press, gallery photos and media kit. Those come from the client.
import fs from "node:fs";
import path from "node:path";
import * as cm from "contentful-management";

const createClient = cm.createClient ?? cm.default.createClient;

const { CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN, CONTENTFUL_ENVIRONMENT } = process.env;
if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error("Set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in .env.local first. See README.");
  process.exit(1);
}

const client = createClient({ accessToken: CONTENTFUL_MANAGEMENT_TOKEN });
const space = await client.getSpace(CONTENTFUL_SPACE_ID);
const env = await space.getEnvironment(CONTENTFUL_ENVIRONMENT || "master");
const locale = (await env.getLocales()).items.find((l) => l.default).code;

const readJson = (name) => JSON.parse(fs.readFileSync(path.resolve("content/seed", name), "utf8"));
const isNotFound = (e) => e?.name === "NotFound" || /NotFound/.test(String(e?.message));

/** Wraps plain values as localized fields and drops blanks so optional fields stay empty. */
const wrap = (fields) =>
  Object.fromEntries(
    Object.entries(fields)
      .filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
      .map(([k, v]) => [k, { [locale]: v }]),
  );

/**
 * Creates the entry if it is missing. If it exists it is left alone, unless `fillMissing` is set:
 * then only fields that are still empty are filled in, and anything already there is never overwritten.
 */
async function upsert(type, id, fields, { fillMissing = false } = {}) {
  let entry = null;
  try {
    entry = await env.getEntry(id);
  } catch (e) {
    if (!isNotFound(e)) throw e;
  }

  if (!entry) {
    entry = await env.createEntryWithId(type, id, { fields: wrap(fields) });
    await entry.publish();
    console.log(`created ${type} ${id}`);
    return entry;
  }

  const missing = fillMissing ? Object.entries(wrap(fields)).filter(([key]) => entry.fields[key] === undefined) : [];
  if (missing.length === 0) {
    console.log(`kept existing ${type} ${id}`);
    return entry;
  }
  for (const [key, value] of missing) entry.fields[key] = value;
  entry = await entry.update();
  await entry.publish();
  console.log(`filled ${missing.map(([key]) => key).join(", ")} on ${type} ${id}`);
  return entry;
}

async function uploadAsset(title, filePath, contentType) {
  const found = await env.getAssets({ "fields.title": title, limit: 1 });
  let asset = found.items[0];
  if (!asset) {
    asset = await env.createAssetFromFiles({
      fields: {
        title: { [locale]: title },
        description: { [locale]: title },
        file: { [locale]: { contentType, fileName: path.basename(filePath), file: fs.readFileSync(filePath) } },
      },
    });
    asset = await asset.processForAllLocales();
    console.log(`uploaded asset ${title}`);
  } else {
    console.log(`asset exists ${title}`);
  }
  if (!asset.isPublished()) asset = await asset.publish();
  return { sys: { type: "Link", linkType: "Asset", id: asset.sys.id } };
}

// ---- Site settings and author highlights
const site = readJson("site.json");
await upsert("siteSettings", "site-settings", {
  bookTitle: site.book.title,
  bookSubtitle: site.book.subtitle,
  blurb: site.book.blurb,
  story: site.book.synopsis.join("\n\n"),
  closing: site.book.closing,
  themes: site.book.themes,
  publisher: site.book.publisher,
  pages: site.book.pages,
  authorName: site.author.name,
  authorShortName: site.author.shortName,
  bio: site.author.bio.join("\n\n"),
  contactEmail: site.contact.email,
  contactPhone: site.contact.phone,
  bulkOrderNote: site.contact.bulkOrderNote,
  ...site.social,
});

for (const [i, h] of site.author.highlights.entries()) {
  await upsert("authorHighlight", `highlight-${i + 1}`, { title: h.title, period: h.period, body: h.body, order: i + 1 });
}

// ---- Editions (hardback and paperback), each with its own ISBN and pictures.
// Pictures are cut by `npm run images` into assets-source/editions/. Existing editions only get empty fields filled.
const editionFiles = {
  hardback: {
    cover: ["Hardback front cover", "hardback-cover.jpg", "image/jpeg"],
    spine: ["Hardback spine", "hardback-spine.webp", "image/webp"],
    fullJacket: ["Hardback full jacket", "hardback-jacket.webp", "image/webp"],
  },
  paperback: {
    cover: ["Paperback front cover", "paperback-cover.jpg", "image/jpeg"],
    spine: ["Paperback spine", "paperback-spine.webp", "image/webp"],
    fullJacket: ["Paperback full jacket", "paperback-jacket.jpg", "image/jpeg"],
  },
};
for (const [i, ed] of readJson("editions.json").entries()) {
  const images = {};
  for (const [field, [title, file, contentType]] of Object.entries(editionFiles[ed.id] ?? {})) {
    const filePath = path.resolve("assets-source/editions", file);
    if (fs.existsSync(filePath)) images[field] = await uploadAsset(title, filePath, contentType);
    else console.warn(`skipped ${title}: ${filePath} not found. Run npm run images first.`);
  }
  await upsert("edition", `edition-${ed.id}`, { name: ed.name, isbn: ed.isbn, note: ed.note, order: i + 1, ...images }, { fillMissing: true });
}

// ---- Events
for (const e of readJson("events.json")) {
  await upsert("event", `event-${e.id}`, {
    slug: e.id,
    title: e.title,
    kind: e.kind,
    countdownLabel: e.countdownLabel,
    start: e.start,
    end: e.end,
    launchConfirmed: e.launchConfirmed,
    dateLabel: e.dateLabel,
    timeLabel: e.timeLabel,
    venue: e.venue,
    address: e.address,
    mapQuery: e.mapQuery,
    details: e.details,
    dressCode: e.dressCode,
    livestreamUrl: e.livestreamUrl,
    infoUrl: e.infoUrl,
    statusOverride: e.statusOverride,
    rsvp: e.rsvp,
  });
}

// ---- Trailers (compressed copies in assets-source/videos, each under 20 MB)
const trailers = [
  { id: "trailer-1", title: "Book trailer", caption: "1 min 32 s", video: "assets-source/videos/trailer-1.mp4", poster: "assets-source/posters/trailer-1-poster.jpg" },
  { id: "trailer-2", title: "Book trailer, extended", caption: "2 min 53 s", video: "assets-source/videos/trailer-2.mp4", poster: "assets-source/posters/trailer-2-poster.jpg" },
];
for (const [i, t] of trailers.entries()) {
  if (!fs.existsSync(t.video)) {
    console.warn(`skipped ${t.id}: ${t.video} not found`);
    continue;
  }
  const file = await uploadAsset(`${t.title} (video)`, path.resolve(t.video), "video/mp4");
  const poster = await uploadAsset(`${t.title} (cover picture)`, path.resolve(t.poster), "image/jpeg");
  await upsert("video", t.id, { title: t.title, caption: t.caption, file, poster, order: i + 1 });
}

console.log("Seed complete. Now create a Delivery API key in Contentful and put it in .env.local. See README.");

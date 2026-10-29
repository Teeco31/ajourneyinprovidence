/**
 * Contentful content model for the A Journey in Providence site.
 * Run once on an empty space with: npm run cms:model
 * Later changes go in a new migration file, so existing entries are never touched by a re-run.
 *
 * Field help text below is what the client sees in the Contentful editor, so it is written for a non-technical editor.
 */

const URL_RULE = [{ regexp: { pattern: "^https?://", flags: null }, message: "Start the link with https://" }];

const DEFAULT_CONTROL = {
  Symbol: "singleLine",
  Text: "multipleLine",
  Boolean: "boolean",
  Date: "datePicker",
  Integer: "numberEditor",
};

function control(f) {
  if (f.control) return f.control;
  if (f.type === "Link") return f.linkType === "Asset" ? "assetLinkEditor" : "entryLinkEditor";
  if (f.type === "Array") return "tagEditor";
  return DEFAULT_CONTROL[f.type];
}

function define(migration, id, name, displayField, description, fields) {
  const ct = migration.createContentType(id, { name, displayField, description });
  for (const f of fields) {
    const field = ct.createField(f.id).name(f.name).type(f.type).required(Boolean(f.required));
    if (f.linkType) field.linkType(f.linkType);
    if (f.items) field.items(f.items);
    if (f.validations) field.validations(f.validations);
  }
  for (const f of fields) {
    ct.changeFieldControl(f.id, "builtin", control(f), f.help ? { helpText: f.help } : {});
  }
}

const order = { id: "order", name: "Order", type: "Integer", help: "Lowest number shows first. Leave blank to put it last." };
const text = (id, name, help, extra = {}) => ({ id, name, type: "Symbol", help, ...extra });
const para = (id, name, help, extra = {}) => ({ id, name, type: "Text", help, ...extra });
const link = (id, name, help) => ({ id, name, type: "Symbol", help, validations: URL_RULE });

module.exports = function (migration) {
  define(migration, "siteSettings", "Site settings", "bookTitle", "One entry only. The book, the author and the publisher's contact details.", [
    text("bookTitle", "Book title", "As printed on the cover.", { required: true }),
    text("bookSubtitle", "Book subtitle", "As printed on the cover."),
    para("blurb", "Back-cover question", "The opening line from the back cover. Shown large on the home page."),
    para("story", "The story", "The back-cover text. Leave a blank line between paragraphs."),
    para("closing", "Closing paragraph", "The last paragraph of the back cover, shown in bold."),
    { id: "themes", name: "Themes", type: "Array", items: { type: "Symbol" }, help: "Type a theme and press Enter. For example: Faith, Perseverance." },
    text("publisher", "Publisher", "For example: SW Advantage Resources."),
    text("isbn", "ISBN", "For example: 978-978-63469-1-5."),
    text("formats", "Formats", "For example: Hardback, Ebook. Leave blank until confirmed and it will not show."),
    text("pages", "Number of pages", "Leave blank until confirmed and it will not show."),
    { id: "samplePdf", name: "Sample chapter (PDF)", type: "Link", linkType: "Asset", help: "Optional. A Download button appears when this is filled.", validations: [{ linkMimetypeGroup: ["pdfdocument"] }] },
    text("authorName", "Author full name", "Spell it Chamberlain. For example: Chief Chamberlain Oruwari Oyibo.", { required: true }),
    text("authorShortName", "Author short name", "As on the cover. For example: Chamberlain Oyibo."),
    para("bio", "Author biography", "Leave a blank line between paragraphs. Get the client to approve the wording."),
    text("contactEmail", "Publisher email", "Where the Contact form and bulk-order button send people. Forms are delivered by Formspree.", {
      validations: [{ regexp: { pattern: "^\\S+@\\S+\\.\\S+$", flags: null }, message: "Enter a full email address" }],
    }),
    text("contactPhone", "Publisher phone", "Include the country code. For example: +234 800 000 0000."),
    para("bulkOrderNote", "Bulk orders message", "Shown above the bulk and corporate orders button."),
    link("instagram", "Instagram link", "Full link, starting with https://. Blank hides it."),
    link("x", "X link", "Full link, starting with https://. Blank hides it."),
    link("linkedin", "LinkedIn link", "Full link, starting with https://. Blank hides it."),
    link("facebook", "Facebook link", "Full link, starting with https://. Blank hides it."),
  ]);

  define(migration, "authorHighlight", "Author role or honour", "title", "One line in the author's list of roles and honours.", [
    text("title", "Role or honour", "For example: 7th Group Managing Director, NNPC.", { required: true }),
    text("period", "Years", "Optional. For example: 1993 to 1995."),
    text("body", "One-line description", "One short sentence."),
    order,
  ]);

  define(migration, "event", "Event", "title", "A launch, reading or talk. Past events move to the archive on their own.", [
    text("slug", "Web name", "Lowercase letters, numbers and dashes only. For example: nape-2026. Never change it after the event is live.", {
      required: true,
      validations: [{ unique: true }, { regexp: { pattern: "^[a-z0-9-]+$", flags: null }, message: "Use lowercase letters, numbers and dashes only" }],
    }),
    text("title", "Event name", "For example: Official book launch at the 44th Annual NAPE Conference.", { required: true }),
    text("kind", "Type", "For example: Official launch, Reading, University talk."),
    text("countdownLabel", "Countdown label", "Words above the home page countdown. For example: 44th NAPE Conference opens in. Only the first upcoming event shows a countdown."),
    { id: "start", name: "Starts", type: "Date", required: true, help: "Pick the date and time. Choose the Lagos time zone (WAT, UTC+1)." },
    { id: "end", name: "Ends", type: "Date", required: true, help: "Pick the date and time. The event moves to Past after this." },
    { id: "launchConfirmed", name: "Launch day and time confirmed", type: "Boolean", help: "Tick when the exact day and time are final." },
    text("dateLabel", "Date as shown", "For example: 8 to 12 November 2026."),
    text("timeLabel", "Time as shown (WAT)", "For example: 4:00 PM prompt. Or: Launch day and time to be confirmed."),
    text("venue", "Venue", "For example: Eko Hotel & Suites."),
    text("address", "Address", "For example: Victoria Island, Lagos, Nigeria."),
    text("mapQuery", "Words to search on Google Maps", "Used for the map. Leave blank to use the venue and address."),
    para("details", "About this event", "A short description. Also used in calendar files."),
    text("dressCode", "Dress code", "Optional."),
    { ...link("livestreamUrl", "Livestream link", "Optional. Add it on the day. A Watch button appears when this is filled.") },
    link("infoUrl", "More information link", "For example: https://nape.org.ng/conferences."),
    { id: "statusOverride", name: "Force status", type: "Symbol", help: "Leave blank normally. Choose Live while the event is on, then clear it.", validations: [{ in: ["Upcoming", "Live", "Past"] }], control: "dropdown" },
    { id: "rsvp", name: "Show the RSVP form", type: "Boolean", help: "Untick for events that need no RSVP." },
  ]);

  define(migration, "store", "Where to buy", "name", "One bookshop or online store. A store with no link is not shown.", [
    text("name", "Store name", "For example: Roving Heights.", { required: true }),
    text("note", "Short note", "For example: Nigeria. Or: Worldwide, Kindle."),
    { ...link("url", "Link to the book", "Paste the full link to the book on this store, starting with https://."), required: true },
    text("format", "Format", "For example: Hardback, Paperback, Ebook."),
    text("priceNgn", "Price in naira", "For example: ₦12,000."),
    text("priceUsd", "Price in dollars", "Optional. For example: $25."),
    order,
  ]);

  define(migration, "endorsement", "Endorsement", "name", "A quote from a reader or industry leader.", [
    para("quote", "Quote", "Exactly as approved by the person.", { required: true }),
    text("name", "Name", "For example: Dr. Jane Doe.", { required: true }),
    text("role", "Title or organisation", "For example: Former Chairman, Example Energy Ltd."),
    order,
  ]);

  define(migration, "pressItem", "Press coverage", "headline", "A news story or interview about the book.", [
    text("headline", "Headline", "As published.", { required: true }),
    text("outlet", "Newspaper or website", "For example: BusinessDay."),
    { id: "publishedOn", name: "Published on", type: "Date", help: "The day it was published." },
    { ...link("url", "Link to the article", "Full link, starting with https://."), required: true },
  ]);

  define(migration, "galleryPhoto", "Gallery photo", "title", "A photo for the Gallery page. Attach it to an event to group it with that event.", [
    text("title", "Photo name", "For your own reference. For example: Author signing copies.", { required: true }),
    { id: "photo", name: "Photo", type: "Link", linkType: "Asset", required: true, help: "Upload a JPG or PNG. The site resizes it for phones automatically.", validations: [{ linkMimetypeGroup: ["image"] }] },
    text("alt", "Describe the photo", "One sentence for blind visitors. For example: Chief Oyibo signing a copy of his book.", { required: true }),
    text("caption", "Caption", "Optional. Shown under the photo."),
    { id: "event", name: "Event", type: "Link", linkType: "Entry", help: "Optional. Pick the event this photo belongs to.", validations: [{ linkContentType: ["event"] }] },
    { id: "takenOn", name: "Date taken", type: "Date", help: "Optional. Newest photos show first." },
  ]);

  define(migration, "video", "Video", "title", "A trailer or interview. Give a YouTube code or upload a file.", [
    text("title", "Video title", "Shown under the video.", { required: true }),
    text("caption", "Caption", "Optional. For example: 1 min 32 s."),
    text("youtubeId", "YouTube code", "The part after v= in the YouTube link. For example, dQw4w9WgXcQ. Best for long or high-quality videos."),
    { id: "file", name: "Video file", type: "Link", linkType: "Asset", help: "Or upload an MP4 here instead. Keep it under 50 MB.", validations: [{ linkMimetypeGroup: ["video"] }] },
    { id: "poster", name: "Cover picture", type: "Link", linkType: "Asset", help: "Optional. The picture shown before the video plays.", validations: [{ linkMimetypeGroup: ["image"] }] },
    order,
  ]);

  define(migration, "pressKitFile", "Media kit file", "label", "A file journalists can download: press release, hi-res photos, cover.", [
    text("label", "Button text", "For example: Download the press release.", { required: true }),
    { id: "file", name: "File", type: "Link", linkType: "Asset", required: true, help: "PDF, ZIP or image." },
    order,
  ]);
};

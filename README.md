# A Journey in Providence: book launch site

Static site built with Next.js (static export), Tailwind CSS 4 and TypeScript. Content lives in **Contentful**. The site reads it
once at build time, so visitors get plain fast HTML and there is no server to run.

```
Client edits in Contentful  ->  presses Publish  ->  webhook  ->  host rebuilds  ->  live in about a minute
```

## 1. Set up Contentful (one time, about 15 minutes)

1. Sign up at https://app.contentful.com and create a **space** (the Free plan is enough). Name it "A Journey in Providence".
2. Copy the **Space ID**: Settings > General settings.
3. Create the **Management token** (for the setup scripts only): avatar menu > Organization settings > Personal access tokens > Generate.
4. Copy `.env.example` to `.env.local` and fill in `CONTENTFUL_SPACE_ID` and `CONTENTFUL_MANAGEMENT_TOKEN`.
5. Create the content model and load the known content:
   ```bash
   npm install
   npm run images         # cuts the cover, spine and jacket pictures for both editions
   npm run cms:setup      # = cms:model, then cms:update, then cms:seed
   ```
   - `cms:model` creates the first 9 content types (Site settings, Author role or honour, Event, Where to buy, Endorsement, Press coverage,
     Gallery photo, Video, Media kit file). Run it **once** on an empty space.
   - `cms:update` adds the Edition type (hardback and paperback) with its cover, spine and full-jacket pictures, the format dropdown on
     stores, and removes the old single ISBN and Formats fields. `cms:setup` runs model, update and seed in order.
   - `cms:seed` loads the book and author details, the two editions with their ISBNs and pictures (from `assets-source/editions/`), the
     NAPE event and the two trailers (it uploads the videos and their cover pictures). It only creates what is missing, and for the
     editions it fills in empty fields only. It never overwrites anything already there, so client edits are safe.
6. Create the **Delivery key** the website uses: Settings > API keys > Add API key. Copy the "Content Delivery API access token"
   into `CONTENTFUL_DELIVERY_TOKEN` in `.env.local`.
7. Check it: `npm run dev`, open http://localhost:3000. The console no longer prints "Contentful keys not set".

If the space is in the EU data region, also set `CONTENTFUL_HOST=cdn.eu.contentful.com`.

## 2. Deploy and auto-rebuild

1. Push the project to GitHub. Connect it to Cloudflare Pages or Netlify. Build command `npm run build`, output folder `out`.
2. In the host's settings add these variables: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN`, `NEXT_PUBLIC_SITE_URL`,
   `NEXT_PUBLIC_FORMSPREE_RSVP`, `NEXT_PUBLIC_FORMSPREE_CONTACT`, optionally `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
   **Do not add the management token to the host.**
3. Create a **build hook** in the host (Cloudflare: Settings > Builds > Deploy hooks. Netlify: Build hooks).
4. In Contentful: Settings > Webhooks > Add webhook. URL = the build hook, method POST, trigger on **Publish and Unpublish** for
   Entries and Assets. Now every Publish rebuilds the site.

A production build on a host (where `CI` is set) fails on purpose if the Contentful keys are missing, so a site with no content can never go live.
Locally, with no keys, the site falls back to `content/seed/` so you can still work.

## 3. What the client edits

Everything below is edited in Contentful, then **Publish**. Anything left empty simply does not show.

| Contentful type | Where it appears | Notes |
| --- | --- | --- |
| Site settings (one entry) | Book section, author bio, contact, footer, share text | Story and bio: leave a blank line between paragraphs. Email and phone show in the Contact section and footer when filled, with a WhatsApp button if the phone starts with + |
| Edition | Hero book and switcher, Buy cards, About jackets, footer | One entry each for Hardback and Paperback. Each has its own ISBN (kept for search engines, not shown on the page), front cover, spine and full jacket. Visitors are told they can choose either, or both. Replace a picture here and the site updates on the next rebuild |
| Author role or honour | Author section list | Use the Order number to sort |
| Event | Launch events, hero countdown, calendar files, RSVP | Past events move to the archive by themselves. During NAPE set Force status to Live and add the livestream link |
| Where to buy | Buy section | Needs a link. Pick the format (Hardback, Paperback, Hardback and paperback). If a store sells both, add one entry per edition. A store with no link is not shown |
| Endorsement | Endorsements and press | The section appears with the first entry |
| Press coverage | Endorsements and press | Same |
| Gallery photo | Home page teaser (at most 3) and the **/gallery/** page | Tick **Show on the home page** on up to 3 photos. If none are ticked, the 3 newest show. Every photo is always on /gallery/. Attach a photo to an Event to group it into that event's album; the event card then shows "See photos from this event" |
| Video | Watch band | A YouTube code, or an uploaded MP4 under 50 MB, plus an optional cover picture |
| Media kit file | Contact section downloads | Press release, hi-res photos, cover |

Photos: upload the original. The site asks Contentful for a phone-sized WebP automatically, so there is no need to resize.

## 4. Fixed in code (the developer changes these)

- Form endpoints, site URL and analytics: environment variables. Forms use Formspree, analytics is Plausible and is off when blank.
- Forms. RSVP sends: form, subject, event, event_id, event_date, name, email, phone (optional), organisation (optional), guests (1 to 10), and attendance (in person or online) when the event has a livestream. Contact sends: form, subject (shows the topic), name, email, phone (optional), organisation (optional), topic, message, and for bulk orders also copies and edition. Every submission has a `form` field (`rsvp` or `contact`) so they are easy to sort. With no separate RSVP form set, RSVPs use the contact form.
- The cover, spine, back cover, portrait, logo and social card: `npm run images` builds them from `assets-source/` (never deployed).
- The privacy notice text: `src/app/privacy/page.tsx`. It is a draft for the publisher's legal review.
- The content model: `scripts/contentful/model.cjs`. To add a field later, write a new migration file. Do not re-run the first one.

## Run it

```bash
npm run dev      # http://localhost:3000
npm run build    # static site is written to out/
npm run typecheck && npm run lint
```

## Folder notes

- `content/seed/` holds the starting content. It feeds `cms:seed`, and is the local fallback.
- `assets-source/` holds the cover original, the rendered full wrap, and the compressed trailers that `cms:seed` uploads. It is git-ignored and never deployed.

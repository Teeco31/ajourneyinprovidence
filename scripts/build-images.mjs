// Builds web-sized images from the originals in assets-source/. Run with: npm run images
//
// Inputs (kept out of the deployed site):
//   assets-source/AJIP front cover (blue).jpg   hardback front cover
//   assets-source/wrap-hi.png                    hardback full jacket, rendered from the PDF (about 3190 x 2250)
//   assets-source/AJIP FULL PAPERCOVER 2.jpg     paperback full jacket, back + spine + front (3959 x 2775)
//
// Outputs:
//   public/images/        web versions. Used as the fallback when Contentful has no image for an edition.
//   assets-source/editions/   high-resolution cuts for each edition. `npm run cms:seed` uploads these to Contentful.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const src = path.resolve("assets-source/AJIP front cover (blue).jpg");
const wrap = path.resolve("assets-source/wrap-hi.png");
const paperWrap = path.resolve("assets-source/AJIP FULL PAPERCOVER 2.jpg");
const out = path.resolve("public/images");
const hi = path.resolve("assets-source/editions");
fs.mkdirSync(hi, { recursive: true });

const meta = await sharp(src).metadata();
const w = meta.width;
const h = meta.height;
console.log(`hardback cover ${w}x${h}`);

await sharp(src).resize({ width: 800 }).webp({ quality: 80 }).toFile(`${out}/cover-800.webp`);
fs.copyFileSync(src, `${hi}/hardback-cover.jpg`);

// Tall portrait crop of the cover (head and shoulders), interim until official portraits arrive.
const tallW = Math.round(w * 0.76);
await sharp(src)
  .extract({ left: Math.round(w * 0.12), top: Math.round(h * 0.08), width: tallW, height: Math.round((tallW * 4) / 3) })
  .resize({ width: 900, height: 1200 })
  .webp({ quality: 80 })
  .toFile(`${out}/portrait-tall-900.webp`);

// Open Graph / X card, 1200x630: hardback cover on a flat sky-blue field.
const cover = await sharp(src).resize({ height: 570 }).jpeg({ quality: 85 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#d9edf9" } })
  .composite([{ input: cover, left: 420, top: 30 }])
  .jpeg({ quality: 82 })
  .toFile(`${out}/og.jpg`);

/** Crop helper for a wrap laid out in a reference grid (refW x refH), scaled to the real file. */
function cropper(realW, realH, refW, refH) {
  const kx = realW / refW;
  const ky = realH / refH;
  return (x0, y0, x1, y1) => ({
    left: Math.round(x0 * kx),
    top: Math.round(y0 * ky),
    width: Math.round((x1 - x0) * kx),
    height: Math.round((y1 - y0) * ky),
  });
}

// ---- Hardback jacket. Reference grid 1276 x 900: back 68..600, spine 600..676, front 676..1208.
if (fs.existsSync(wrap)) {
  const m = await sharp(wrap).metadata();
  const crop = cropper(m.width, m.height, 1276, 900);
  await sharp(wrap).extract(crop(68, 78, 600, 822)).resize({ width: 900 }).webp({ quality: 82 }).toFile(`${out}/back-900.webp`);
  await sharp(wrap).extract(crop(600, 78, 676, 822)).resize({ height: 1400 }).webp({ quality: 82 }).toFile(`${out}/spine.webp`);
  await sharp(wrap).extract(crop(68, 78, 1208, 822)).resize({ width: 1800 }).webp({ quality: 80 }).toFile(`${out}/wrap-1800.webp`);
  await sharp(wrap).extract(crop(160, 684, 268, 758)).resize({ width: 360 }).webp({ quality: 90 }).toFile(`${out}/publisher-logo.webp`);
  await sharp(wrap).extract(crop(600, 78, 676, 822)).webp({ quality: 92 }).toFile(`${hi}/hardback-spine.webp`);
  await sharp(wrap).extract(crop(68, 78, 1208, 822)).resize({ width: 2400 }).webp({ quality: 82 }).toFile(`${hi}/hardback-jacket.webp`);
}

// ---- Paperback jacket. Reference grid 3959 x 2775: back 0..1862, spine 1862..2097, front 2097..3959.
if (fs.existsSync(paperWrap)) {
  const m = await sharp(paperWrap).metadata();
  const crop = cropper(m.width, m.height, 3959, 2775);
  const front = crop(2097, 0, 3959, 2775);
  const spine = crop(1862, 0, 2097, 2775);
  console.log(`paperback jacket ${m.width}x${m.height}`);
  await sharp(paperWrap).extract(front).resize({ width: 800 }).webp({ quality: 82 }).toFile(`${out}/cover-paperback-800.webp`);
  await sharp(paperWrap).extract(spine).resize({ height: 1400 }).webp({ quality: 82 }).toFile(`${out}/spine-paperback.webp`);
  await sharp(paperWrap).resize({ width: 1800 }).webp({ quality: 80 }).toFile(`${out}/wrap-paperback-1800.webp`);
  await sharp(paperWrap).extract(front).jpeg({ quality: 90 }).toFile(`${hi}/paperback-cover.jpg`);
  await sharp(paperWrap).extract(spine).webp({ quality: 92 }).toFile(`${hi}/paperback-spine.webp`);
  fs.copyFileSync(paperWrap, `${hi}/paperback-jacket.jpg`);
}

console.log("done");

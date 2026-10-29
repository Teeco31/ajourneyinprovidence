// Builds web-sized images from the originals in assets-source/.
// Run with: npm run images
//
// Inputs (kept out of the deployed site):
//   assets-source/AJIP front cover (blue).jpg   front cover
//   assets-source/wrap-hi.png                    full-wrap PDF rendered to PNG (about 3190 x 2250), optional
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const src = path.resolve("assets-source/AJIP front cover (blue).jpg");
const wrap = path.resolve("assets-source/wrap-hi.png");
const out = path.resolve("public/images");

const meta = await sharp(src).metadata();
const w = meta.width;
const h = meta.height;
console.log(`cover ${w}x${h}`);

for (const width of [480, 800]) {
  await sharp(src).resize({ width }).webp({ quality: 80 }).toFile(`${out}/cover-${width}.webp`);
}

// Portrait crops of the cover (head and shoulders), interim until official portraits arrive.
await sharp(src)
  .extract({ left: Math.round(w * 0.22), top: Math.round(h * 0.12), width: Math.round(w * 0.56), height: Math.round(w * 0.56) })
  .resize({ width: 640, height: 640 })
  .webp({ quality: 80 })
  .toFile(`${out}/portrait-640.webp`);

const tallW = Math.round(w * 0.76);
await sharp(src)
  .extract({ left: Math.round(w * 0.12), top: Math.round(h * 0.08), width: tallW, height: Math.round((tallW * 4) / 3) })
  .resize({ width: 900, height: 1200 })
  .webp({ quality: 80 })
  .toFile(`${out}/portrait-tall-900.webp`);

// Open Graph / X card, 1200x630: cover on a flat sky-blue field.
const cover = await sharp(src).resize({ height: 570 }).jpeg({ quality: 85 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#d9edf9" } })
  .composite([{ input: cover, left: 420, top: 30 }])
  .jpeg({ quality: 82 })
  .toFile(`${out}/og.jpg`);

// Pieces of the full wrap. Coordinates are in a 1276 x 900 layout, scaled to the PNG.
if (fs.existsSync(wrap)) {
  const k = (await sharp(wrap).metadata()).width / 1276;
  const crop = (x0, y0, x1, y1) => ({
    left: Math.round(x0 * k),
    top: Math.round(y0 * k),
    width: Math.round((x1 - x0) * k),
    height: Math.round((y1 - y0) * k),
  });
  await sharp(wrap).extract(crop(68, 78, 600, 822)).resize({ width: 900 }).webp({ quality: 82 }).toFile(`${out}/back-900.webp`);
  await sharp(wrap).extract(crop(600, 78, 676, 822)).resize({ height: 1400 }).webp({ quality: 82 }).toFile(`${out}/spine.webp`);
  await sharp(wrap).extract(crop(68, 78, 1208, 822)).resize({ width: 1800 }).webp({ quality: 80 }).toFile(`${out}/wrap-1800.webp`);
  await sharp(wrap).extract(crop(160, 684, 268, 758)).resize({ width: 360 }).webp({ quality: 90 }).toFile(`${out}/publisher-logo.webp`);
}

console.log("done");

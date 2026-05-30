// Generates thumbnails for all images in src/images/ (excluding _thumbs/).
// Output mirrors the folder structure under src/images/_thumbs/.
// Run once: node scripts/generate-thumbs.js

import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { join, relative, dirname, extname } from "path";
import { fileURLToPath } from "url";

const ROOT     = join(fileURLToPath(import.meta.url), "../../src/images");
const THUMB_DIR = join(ROOT, "_thumbs");
const MAX_SIZE  = 300;
const EXTS      = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG", ".gif"]);

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files   = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_thumbs") continue;
      files.push(...await findImages(full));
    } else if (EXTS.has(extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const images = await findImages(ROOT);
console.log(`Found ${images.length} images — generating thumbnails...\n`);

let done = 0, skipped = 0, failed = 0;

for (const imgPath of images) {
  const rel       = relative(ROOT, imgPath);
  const thumbPath = join(THUMB_DIR, rel).replace(/\.[^.]+$/, ".jpg");

  try {
    await mkdir(dirname(thumbPath), { recursive: true });
    await sharp(imgPath)
      .resize(MAX_SIZE, MAX_SIZE, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toFile(thumbPath);
    console.log(`  ✓ ${rel}`);
    done++;
  } catch (err) {
    console.error(`  ✗ ${rel}: ${err.message}`);
    failed++;
  }
}

console.log(`\nDone: ${done} created, ${skipped} skipped, ${failed} failed.`);
console.log(`Thumbnails saved to src/images/_thumbs/`);

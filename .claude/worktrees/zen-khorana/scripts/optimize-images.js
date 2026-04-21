const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '..', 'public', 'images');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'optimized');

// Target width for 2x retina at the largest display size.
// Detail hero: 560px CSS → 1120px @2x. Card: 410px CSS → 820px @2x.
// We target 1920px to cover both comfortably without bloat.
const MAX_WIDTH = 1920;

// Quality tuned for portfolio — higher than defaults, still reasonable file size.
const WEBP_QUALITY = 90;
const AVIF_QUALITY = 80;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(imageDir, { recursive: true });
  let optimized = 0;
  let skipped = 0;

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
    // Skip files already inside the optimized directory
    if (file.includes('optimized')) continue;

    const inputPath = path.join(imageDir, file);
    const relativePath = path.relative(imageDir, inputPath);
    const outputPath = path.join(outputDir, relativePath);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      const metadata = await sharp(inputPath).metadata();
      const needsResize = metadata.width && metadata.width > MAX_WIDTH;

      const pipeline = sharp(inputPath);
      if (needsResize) {
        pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
      }

      const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const avifPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.avif');

      // Clone pipeline for each format
      await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath);
      await pipeline.clone().avif({ quality: AVIF_QUALITY }).toFile(avifPath);

      const webpSize = fs.statSync(webpPath).size;
      const label = needsResize
        ? `${metadata.width}→${MAX_WIDTH}w`
        : `${metadata.width}w (kept)`;
      console.log(`  ${file}  ${label}  ${(webpSize / 1024).toFixed(0)}KB webp`);
      optimized++;
    } catch (error) {
      console.error(`  ERROR ${file}:`, error.message);
      skipped++;
    }
  }

  console.log(`\nDone: ${optimized} optimized, ${skipped} skipped`);
}

optimizeImages();

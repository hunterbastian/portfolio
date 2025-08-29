const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '..', 'public', 'images');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(imageDir, { recursive: true });
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const inputPath = path.join(imageDir, file);
      const relativePath = path.relative(imageDir, inputPath);
      const outputPath = path.join(outputDir, relativePath);
      
      // Create directory structure
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      try {
        // Generate WebP
        await sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
          
        // Generate AVIF
        await sharp(inputPath)
          .avif({ quality: 75 })
          .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.avif'));
          
        console.log(`Optimized: ${file}`);
      } catch (error) {
        console.error(`Error optimizing ${file}:`, error);
      }
    }
  }
}

optimizeImages().then(() => {
  console.log('Image optimization complete!');
});

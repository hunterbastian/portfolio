const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImagesDirectory = path.join(__dirname, '..', 'public', 'images');
const optimizedOutputDirectory = path.join(__dirname, '..', 'public', 'images', 'optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(optimizedOutputDirectory)) {
  fs.mkdirSync(optimizedOutputDirectory, { recursive: true });
}

async function optimizeImages() {
  const imageFileNames = fs.readdirSync(sourceImagesDirectory, { recursive: true });
  
  for (const imageFileName of imageFileNames) {
    if (imageFileName.match(/\.(jpg|jpeg|png)$/i)) {
      const sourceImagePath = path.join(sourceImagesDirectory, imageFileName);
      const relativeImagePath = path.relative(sourceImagesDirectory, sourceImagePath);
      const destinationImagePath = path.join(optimizedOutputDirectory, relativeImagePath);
      
      // Create directory structure
      const outputDirectory = path.dirname(destinationImagePath);
      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }
      
      try {
        // Generate WebP
        await sharp(sourceImagePath)
          .webp({ quality: 85 })
          .toFile(destinationImagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
          
        // Generate AVIF
        await sharp(sourceImagePath)
          .avif({ quality: 75 })
          .toFile(destinationImagePath.replace(/\.(jpg|jpeg|png)$/i, '.avif'));
          
        console.log(`Optimized: ${imageFileName}`);
      } catch (error) {
        console.error(`Error optimizing ${imageFileName}:`, error);
      }
    }
  }
}

optimizeImages().then(() => {
  console.log('Image optimization complete!');
});

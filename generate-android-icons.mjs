import sharp from 'sharp';
import { readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Android icon sizes for different densities
const iconSizes = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const svgPath = join(__dirname, 'src/admin/assets/logoWithoutText.svg');
const baseOutputPath = join(__dirname, '../app/src/main/res');

async function generateIcons() {
  console.log('📱 Generating Android app icons...\n');

  const svgBuffer = readFileSync(svgPath);

  for (const [density, size] of Object.entries(iconSizes)) {
    const outputDir = join(baseOutputPath, `mipmap-${density}`);
    const outputPath = join(outputDir, 'ic_launcher.png');

    try {
      // Create directory if it doesn't exist
      await mkdir(outputDir, { recursive: true });

      // Convert SVG to PNG at specified size
      await sharp(svgBuffer).resize(size, size).png().toFile(outputPath);

      console.log(`✅ Generated ${density} (${size}x${size}px): ${outputPath}`);
    } catch (error) {
      console.error(`❌ Error generating ${density}:`, error.message);
    }
  }

  console.log('\n✨ Icon generation complete!');
}

generateIcons().catch(console.error);

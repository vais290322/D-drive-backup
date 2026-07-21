import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  // console.log('Creating assets directory...');
  fs.mkdirSync(assetsDir, { recursive: true });
}

// List of required assets
const requiredAssets = [
  'vais-logo.png',
  'facebook.PNG',
  'insta.PNG',
  'youtube.PNG',
  'website.jpeg'
];

// Check each required asset
requiredAssets.forEach(asset => {
  const assetPath = path.join(assetsDir, asset);
  if (fs.existsSync(assetPath)) {
    // console.log(`✅ ${asset} exists`);
  } else {
    // console.log(`❌ ${asset} is missing`);
  }
});

// console.log('\nAssets directory:', assetsDir);
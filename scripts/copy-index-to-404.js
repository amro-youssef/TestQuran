const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexFile = path.join(distDir, 'index.html');
const destFile = path.join(distDir, '404.html');

try {
  if (!fs.existsSync(indexFile)) {
    console.error('build output not found:', indexFile);
    process.exit(1);
  }
  fs.copyFileSync(indexFile, destFile);
  console.log('Copied index.html to 404.html');
} catch (err) {
  console.error('Failed to copy index.html to 404.html', err);
  process.exit(1);
}

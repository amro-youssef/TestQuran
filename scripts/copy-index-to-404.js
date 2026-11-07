const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexFile = path.join(distDir, 'index.html');
const destFile = path.join(distDir, '404.html');

// Pages that get their own copy of index.html, so GitHub Pages serves them with a 200
// instead of through 404.html (which link previews and some browsers treat as an error)
const routes = ['icm2025'];

try {
  if (!fs.existsSync(indexFile)) {
    console.error('build output not found:', indexFile);
    process.exit(1);
  }
  fs.copyFileSync(indexFile, destFile);
  console.log('Copied index.html to 404.html');

  for (const route of routes) {
    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.copyFileSync(indexFile, path.join(routeDir, 'index.html'));
    console.log(`Copied index.html to ${route}/index.html`);
  }
} catch (err) {
  console.error('Failed to copy index.html', err);
  process.exit(1);
}

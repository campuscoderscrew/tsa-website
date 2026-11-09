import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distPath, 'index.html');

// Hardcoded live origin and base path (matches vite.config.ts base)
const ORIGIN = 'https://campuscoderscrew.github.io';
const BASE_PATH = '/tsa-website/';

// Keep this list in sync with createBrowserRouter / <Routes> in your router file!
const routes = [
  '',
  'about',
  'events',
  'gallery',
  'board',
  'contact'
];

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const originalHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Ensure canonical and og:url tags exist so we can rewrite them. Fail loudly if missing.
if (!originalHtml.includes('rel="canonical"')) {
  console.error('Error: No <link rel="canonical"> found in dist/index.html to rewrite.');
  process.exit(1);
}
if (!originalHtml.includes('property="og:url"')) {
  console.error('Error: No <meta property="og:url"> content found in dist/index.html to rewrite.');
  process.exit(1);
}

const urlsForSitemap = [];

for (const route of routes) {
  // We use the trailing-slash form (e.g., /gallery/) because that's what GitHub Pages
  // serves with a 200 OK. Navigating to /gallery causes a 301 redirect to /gallery/.
  const routePath = route ? `${route}/` : '';
  const absoluteUrl = `${ORIGIN}${BASE_PATH}${routePath}`;
  urlsForSitemap.push(absoluteUrl);

  // Replace canonical and og:url using regex anchored on their attributes
  let routeHtml = originalHtml.replace(
    /<link[^>]*rel="canonical"[^>]*href="[^"]*"[^>]*>/i,
    `<link rel="canonical" href="${absoluteUrl}">`
  );
  
  routeHtml = routeHtml.replace(
    /<meta[^>]*property="og:url"[^>]*content="[^"]*"[^>]*>/i,
    `<meta property="og:url" content="${absoluteUrl}">`
  );

  if (route === '') {
    // Overwrite the root index.html to have its strict trailing-slash canonical
    fs.writeFileSync(indexHtmlPath, routeHtml);
  } else {
    // Create dist/<route>/index.html
    const routeDir = path.join(distPath, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml);
  }
}

// Generate sitemap.xml (Google ignores priority/changefreq, only loc is needed)
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsForSitemap.map(url => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapContent);

console.log(`✓ route-pages.mjs: Generated ${routes.length} crawlable routes and sitemap.xml.`);

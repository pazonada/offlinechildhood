/**
 * Moves cache-control routes ahead of the filesystem handler in the Vercel
 * build output.
 *
 * @astrojs/vercel emits the correct immutable header for hashed /_astro/
 * assets, but places that route *after* {"handle":"filesystem"}. Static files
 * are served by the filesystem handler, so routing never reaches the header
 * rule and every asset ends up with max-age=0, must-revalidate. Putting a
 * `continue: true` header route before the handler is the documented pattern.
 *
 * Idempotent, and a no-op if the adapter ever fixes the ordering upstream.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const CONFIG = '.vercel/output/config.json';

if (!existsSync(CONFIG)) {
  console.log('fix-cache-headers: no Vercel output, skipping');
  process.exit(0);
}

const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const routes = config.routes ?? [];

const fsIndex = routes.findIndex((r) => r.handle === 'filesystem');
if (fsIndex === -1) {
  console.log('fix-cache-headers: no filesystem handler, nothing to reorder');
  process.exit(0);
}

const isCacheHeader = (r) =>
  r.continue === true &&
  r.headers &&
  Object.keys(r.headers).some((k) => k.toLowerCase() === 'cache-control');

const misplaced = routes.filter((r, i) => i > fsIndex && isCacheHeader(r));

if (misplaced.length === 0) {
  console.log('fix-cache-headers: cache headers already ordered correctly');
  process.exit(0);
}

const remaining = routes.filter((r) => !misplaced.includes(r));
const newFsIndex = remaining.findIndex((r) => r.handle === 'filesystem');
remaining.splice(newFsIndex, 0, ...misplaced);

config.routes = remaining;
writeFileSync(CONFIG, JSON.stringify(config));

for (const r of misplaced) {
  console.log(`fix-cache-headers: moved ${r.src} ahead of the filesystem handler`);
}

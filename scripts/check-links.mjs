/**
 * Weekly link QA for the live site. Crawls the sitemap, tests every link on
 * every page, and title-checks the curated device guides, because a link can
 * 200 its way to the wrong page (the Roku article id was recycled into a
 * subscriptions page the day the settings page shipped).
 *
 * Verdicts:
 *   FAIL  broken for everyone: 404/410, 5xx, dead domain, or a curated link
 *         whose fetched title no longer matches its purpose
 *   WARN  unknowable from a robot: 401/403/429/999 bot walls, or a curated
 *         page whose title cannot be fetched without a browser
 *
 * Exit code 1 only on FAIL. Output is a markdown report on stdout.
 * Run: node scripts/check-links.mjs [base-url]
 */

const BASE = process.argv[2] ?? 'https://offlinechildhood.com';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 OfflineChildhoodLinkCheck/1.0';

/** Curated links whose DESTINATION must still be about what we say it is.
 *  Keep in sync with src/lib/devices.ts. Pattern matches the page <title>. */
const TITLE_CHECKS = [
  { url: 'https://support.apple.com/en-us/105121', pattern: /parental controls/i },
  { url: 'https://families.google/familylink/', pattern: /family link/i },
  { url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=G93XLZGRK98PQ9M4', pattern: /parental controls|amazon kids/i },
  { url: 'https://support.roku.com/article/set-parental-controls', pattern: /parental/i },
  { url: 'https://support.apple.com/guide/tv/set-up-parental-controls-atvbbaf126df/tvos', pattern: /parental controls/i },
  { url: 'https://www.nintendo.com/us/switch/parental-controls/', pattern: /parental controls/i },
  { url: 'https://www.playstation.com/en-us/family/', pattern: /parental controls|family/i },
  { url: 'https://support.microsoft.com/en-us/family-safety', pattern: /family safety/i },
];

const fetchOpts = (accept) => ({
  redirect: 'follow',
  headers: { 'User-Agent': UA, Accept: accept ?? '*/*', 'Accept-Language': 'en-US,en;q=0.9' },
  signal: AbortSignal.timeout(25000),
});

async function getPages() {
  const idx = await (await fetch(`${BASE}/sitemap-index.xml`, fetchOpts())).text();
  const maps = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const pages = new Set();
  for (const m of maps) {
    const xml = await (await fetch(m, fetchOpts())).text();
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) pages.add(loc);
  }
  return [...pages];
}

function extractLinks(html) {
  return [...html.matchAll(/<a\s[^>]*?href="([^"#]+)"/g)]
    .map((m) => m[1])
    .filter((h) => !h.startsWith('mailto:') && !h.startsWith('tel:') && !h.startsWith('data:'));
}

async function probe(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, fetchOpts('text/html'));
      let title = '';
      const type = res.headers.get('content-type') ?? '';
      if (type.includes('html')) {
        const text = await res.text();
        title = (text.match(/<title[^>]*>([^<]*)/i)?.[1] ?? '').trim();
      }
      return { status: res.status, finalUrl: res.url, title };
    } catch (err) {
      if (attempt === 1) return { status: 0, finalUrl: url, title: '', error: String(err?.cause?.code ?? err?.name ?? err) };
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

const BOT_WALL = new Set([401, 403, 405, 429, 999]);

async function main() {
  const pages = await getPages();
  const found = new Map(); // url -> Set(pages that reference it)

  for (const page of pages) {
    const res = await fetch(page, fetchOpts('text/html'));
    if (res.status !== 200) {
      found.set(page, new Set(['(sitemap)']));
      continue;
    }
    const html = await res.text();
    for (const href of extractLinks(html)) {
      const abs = href.startsWith('http') ? href : new URL(href, page).toString();
      if (abs.startsWith(BASE) && (abs.includes('/_astro/') || abs.includes('/pagefind/'))) continue;
      if (!found.has(abs)) found.set(abs, new Set());
      found.get(abs).add(page);
    }
  }

  const fails = [];
  const warns = [];
  let checked = 0;

  for (const [url, refs] of found) {
    const r = await probe(url);
    checked++;
    const where = [...refs].slice(0, 3).map((p) => p.replace(BASE, '') || '/').join(', ');
    if (r.status === 0) fails.push(`- **dead** ${url} (${r.error}) — on ${where}`);
    else if (r.status >= 400 && !BOT_WALL.has(r.status)) fails.push(`- **${r.status}** ${url} — on ${where}`);
    else if (BOT_WALL.has(r.status)) warns.push(`- ${r.status} (bot wall?) ${url} — on ${where}`);
  }

  for (const { url, pattern } of TITLE_CHECKS) {
    const r = await probe(url);
    if (r.status >= 200 && r.status < 400 && r.title) {
      if (!pattern.test(r.title)) {
        fails.push(`- **wrong page** ${url} now titled "${r.title}" (wanted ${pattern}) — device settings guide`);
      }
    } else if (BOT_WALL.has(r.status) || !r.title) {
      warns.push(`- title unverifiable (${r.status}) ${url} — check in a browser occasionally`);
    }
  }

  console.log(`# Link check: ${BASE}`);
  console.log(`\nChecked ${checked} unique links across ${pages.length} pages.\n`);
  if (fails.length) console.log(`## Broken (fix these)\n\n${fails.join('\n')}\n`);
  if (warns.length) console.log(`## Unverifiable by robot (usually fine)\n\n${warns.join('\n')}\n`);
  if (!fails.length) console.log('No broken links.');
  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => {
  console.error('Checker crashed:', e);
  process.exit(1);
});

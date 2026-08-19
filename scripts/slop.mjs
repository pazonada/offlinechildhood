// Audits user-facing copy for AI tells. Run: node scripts/slop.mjs
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(astro|mdx|md|ts|tsx|yaml)$/.test(p)) files.push(p);
  }
})('src');

const RULES = [
  { id: 'em-dash', re: /—/g, note: 'em-dash (banned outright)' },
  { id: 'en-dash-as-pause', re: /\s–\s/g, note: 'en-dash used as a sentence pause (ranges only)' },
  { id: 'not-just', re: /not just [^.,;]{2,40}(,| but)/gi, note: '"not just X, but Y"' },
  // Only the parallel comma antithesis ("rungs, not flavours") is a tell.
  // Ordinary negation ("does not need") is just English, so it is not matched.
  { id: 'x-not-y', re: /\b\w+s, not \w+s\b/g, note: '"X, not Y" comma antithesis' },
  { id: 'in-a-world', re: /in a world where/gi, note: '"in a world where"' },
  { id: 'dive-in', re: /\b(let'?s )?(dive|delve) (in|into)\b/gi, note: '"dive/delve into"' },
  { id: 'navigate', re: /navigat\w+ the (landscape|complexit)/gi, note: '"navigate the landscape"' },
  { id: 'filler-verbs', re: /\b(unlock\w*|unleash\w*|leverag\w+|empower\w*|supercharg\w+|delve\w*)\b/gi, note: 'filler verb' },
  { id: 'jargon', re: /\b(moat|beachhead|north star|synergy|table stakes|game.chang\w+|10x|double.click)\b/gi, note: 'banned jargon' },
  { id: 'ai-adjectives', re: /\b(tapestry|testament to|ever.evolving|seamless\w*|robust|vibrant|crucial|pivotal)\b/gi, note: 'AI-flavoured adjective' },
  { id: 'throat-clearing', re: /\b(it'?s worth noting|it should be noted|needless to say)\b/gi, note: 'throat-clearing' },
  { id: 'hedge', re: /\b(arguably|perhaps it|it could be said)\b/gi, note: 'weak hedge' },
  // Stray characters from generation. Allows ordinary typography and accented
  // Latin, flags anything beyond it (CJK, symbols, emoji) so it cannot ship.
  {
    id: 'stray-char',
    re: /[^\u0000-\u024F\u2010-\u201F\u2026\u20AC]/g,
    note: 'unexpected character',
  },
];

let total = 0;
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const hits = [];
  for (const r of RULES) {
    for (const m of text.matchAll(r.re)) {
      const line = text.slice(0, m.index).split('\n').length;
      hits.push(`  line ${line}  [${r.id}] ${r.note}: "${m[0].trim().slice(0, 60)}"`);
    }
  }
  if (hits.length) {
    total += hits.length;
    console.log(f);
    console.log(hits.join('\n'));
  }
}
console.log(total ? `\n${total} finding(s)` : '\nClean: no AI tells found');
process.exit(total ? 1 : 0);

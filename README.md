# Offline Childhood

The site at [offlinechildhood.com](https://offlinechildhood.com). Static, fast, and editable either
in a browser or as plain text files.

## What the site argues

Two things at once, and they are not in tension:

1. **Decisions.** A more analog childhood, argued through the handful of device calls every family
   actually faces. Each decision offers three rungs (`start`, `further`, `allin`) that point the same
   direction, so a family gets met where it is without being told every option is equivalent.
2. **Conversations.** Critical media literacy, structured as a concept by age matrix. Every idea is
   written for ages 4 to 6, 7 to 9, 10 to 12, and 13 and up.

Product recommendations sit at the leaf of a decision, never at the centre. The previous version of
this site was organised around products, which is why it went stale: products change and decisions
do not.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
```

## Editing content

Two equivalent paths, both operating on the same files:

- **Browser.** Go to `/keystatic`. Everything is a form field.
- **Files.** Markdown and YAML under `src/content/`. Schemas live in `src/content.config.ts`.

| Collection | Path | What it is |
| --- | --- | --- |
| `decisions` | `src/content/decisions/*.mdx` | The device decisions |
| `concepts` | `src/content/concepts/*.mdx` | Media literacy, by age band |
| `picks` | `src/content/picks/*.yaml` | Products, referenced by decisions |
| `experts` | `src/content/experts/experts.yaml` | People worth reading |

## Checks worth running before publishing

```bash
node scripts/contrast.mjs
```

Verifies every colour pairing the UI uses against WCAG AA in both light and dark. Exits non-zero on
failure, so a palette change cannot quietly break contrast.

```bash
node scripts/slop.mjs
```

Audits copy for AI tells: em-dashes, `X, not Y` antithesis, filler verbs, banned jargon. Exits
non-zero on any finding.

## Evidence

Citations live in `src/lib/sources.ts`, one per claim, with a plain-language note on what each source
does and does not establish. Metadata was verified against Crossref rather than recalled. Where the
research is genuinely disputed (the smartphones and teen mental health question in particular), the
`contested` flag is set and the pages say so.

## Hosting

Vercel, built from this repo. Redirects from the old Squarespace URLs live in `astro.config.mjs`
rather than a host config file, so they survive a change of host.

The domain is registered at Gandi, which also runs the mail for `hello@offlinechildhood.com`. Mail is
unaffected by any deploy. Cutting over means changing the four apex A records and the `www` CNAME
that currently point at Squarespace.

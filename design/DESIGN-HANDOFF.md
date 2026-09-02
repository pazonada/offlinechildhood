# Offline Childhood — visual redesign handoff

For Claude Code. Everything below was designed against the real content and
components in this repo, so the changes are mostly token edits plus per-page
section markup. Copy was never rewritten except where noted in "Copy changes".

The mockups live in this project as `.dc.html` files. They are visual reference,
not code to copy — the class names and structure below are what to implement in
Astro + Tailwind.

---

## 1. Palette

The redesign moves the site from a cool grey/white surface set to warm cream with
a navy display colour. Because `global.css` centralises colour, most of this is a
one-file edit, exactly as the comment at the top of that file promises.

### Retune these existing tokens

| Token | Current | New | Used for |
| --- | --- | --- | --- |
| `--surface` | `#ffffff` | `#ffffff` (unchanged) | cards |
| `--surface-2` | `#eef2f7` | `#f6eedd` | hero bands, card hover tint |
| `--surface-3` | `#e2e9f3` | `#f2e4c6` | active nav pill, numeral discs, age pills |
| `--line` | `#d7dfe9` | `#e9e1ce` | hairlines, card borders |
| `--ink` | `#101828` | `#24263a` | body text |
| `--ink-soft` | `#525f70` | `#525f70` (unchanged) | secondary text |
| `--primary` | `#2451d6` | `#2451d6` (unchanged) | links, buttons |
| `--primary-strong` | `#1d42b0` | `#1b3fae` | button hover |
| `--accent` | `#f7b928` | `#efaf29` | scribbles, rules, the sun mark |
| `--coral` | `#c9412d` | `#c0562e` | ✕ markers |

### Add these tokens

| Token | Value | Used for |
| --- | --- | --- |
| `--page` | `#fdf9f0` | the page background (warmer and lighter than `--surface-2`) |
| `--navy` | `#1b2a5e` | all display headings, the footer, the conversation-detail hero |
| `--panel-blue` | `#eef3fc` | "Try this" blocks, Downsides boxes, the What-to-buy band |
| `--panel-blue-line` | `#c9d8f3` | borders on those panels |
| `--panel-blue-line-strong` | `#a8bef0` | outlined age cards on For teachers |
| `--panel-accent` | `#faf1dc` | the marigold panel on About |
| `--accent-text` | `#8a6410` | the one text-safe gold — "Listen for" labels only |
| `--accent-light` | `#ffd166` | marigold labels **on blue**; passes AA at 4.6:1 |
| `--card-line-cool` | `#e3e8f2` | borders on white cards that sit on blue |
| `--green-deep` | `#2e6b3e` | success/confirmation text |

### Contrast notes for `scripts/contrast.mjs`

Two pairings your script will care about:

- `--accent` on `--navy` is **3.36:1** and fails. Every marigold label sitting on
  blue or navy uses `--accent-light` instead. Do not swap it back.
- `#6e7086`, an earlier mid-grey, measured 4.43:1 on cream and was replaced
  everywhere by `--ink-soft`. Keep small text on `--ink-soft` or darker.

The `--cat-*` category hues are unchanged and still verified.

---

## 2. Type

| Role | Family | Weight | Notes |
| --- | --- | --- | --- |
| Display | **Outfit** | 800 | `letter-spacing: -0.025em`, `text-wrap: balance` |
| Body | **Hanken Grotesk** | 400/600 | replaces the current body face |
| Labels | **Bricolage Grotesque** | 600/700 | uppercase, `letter-spacing: 0.16em–0.22em`, 11–13px |

Outfit is already the display face on the live site, so that part stays. Load
Hanken Grotesk and Bricolage Grotesque alongside it.

`text-wrap: balance` goes on **every** heading. It stops single-word orphans,
which was a specific complaint — do not solve that with manual `<br>`.

### The rule that keeps links readable

Outfit 800 in navy is **headings only**. A link is body-font semibold in
`--primary` with a 1.5px underline at `text-underline-offset: 4px`. Related-content
links were originally set in the heading style and read as competing subheads;
this separation is deliberate.

---

## 3. Recurring patterns

### Hero — index pages
Two columns on `--surface-2` with a bottom hairline: text left
(`minmax(0,1.15fr)`), photo right (`minmax(0,0.85fr)`). The photo sits in an arch:
`border-radius: 240px 240px 24px 24px; overflow: hidden`, image
`height: 400px; object-fit: cover`. Used on Decisions, Conversations, For teachers,
About, People we read, Your family plan.

### Hero — homepage
Full-bleed `--primary` band, no rounded corners, centred content: sun mark (168px),
eyebrow in `--accent-light`, headline on one line via
`clamp(26px, 3.5vw, 56px)` with `white-space: nowrap; width: max-content;
margin-inline: auto`, then copy, buttons, and the print line in `#d7e1fc`.
A 200px `--primary-strong` hill silhouette is anchored to the bottom.

Side padding is 140px so the no-wrap headline fits inside the content box —
that was the cause of a persistent off-centre bug. Do not reduce it without
re-checking the headline.

### Hero — detail pages
Full-bleed colour band, single centred column at `max-width: 922px`:
`--primary` for decisions, `--navy` for conversations. Back link, kicker in
`--accent-light`, title, then the short answer or the idea.

### Article column
`max-width: 922px; padding-left: 102px` — the left padding is a **reserved gutter**
for the section-heading suns. Without it they clip below ~1000px viewport width.

### Section-heading sun
A 26px inline SVG absolutely positioned at `left: -62px; top: 10px` on a
`position: relative` heading: marigold core (`r=4.6`), navy rays at
`stroke-width: 2`. It rotates 22° on hover with
`transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)`. On the 404 it is
128px and rotates 45°.

### Scribble underline
Use the existing `Scribble.astro` `underline` variant. Sits under one emphasised
word in a heading, at `bottom: -4px` to `-8px`, and under strand labels on
For teachers. Do not hand-draw a replacement curve.

### Three link treatments, kept visually distinct
1. **Navigation** — white card, 1.5px `--card-line-cool` border, 22px radius,
   border turns `--primary` on hover. Prev/next and 404 destinations.
2. **Outbound** — white card inside a `--panel-blue` band, with an `↗`. Product picks.
3. **Related reading** — no card. A 6px `--accent` spine, a small uppercase kind
   label, the title as an underlined body-font link, then the description.

### Aside treatments
- **"Try this"** — filled `--panel-blue` block, 18px radius.
- **"Listen for"** — no fill. A 4px `--accent` left rule with 22px indent.
  Needs 28px of space above it to separate from the block above.
- **Quotes** — same 4px marigold rule, text in Outfit 800 navy.

### Refusals and misconceptions
A ✕ in `--coral` at 20px in a `30px / 1fr` grid, hairline between rows. Used for
"What we will not do" (About) and "Misconceptions to address" (conversation detail).

### Footer
`--navy` background. Description block left; the two link columns grouped in a
single right-aligned flex container with a 72px gap between them, pinned to the
right edge with `justify-content: space-between` on the parent. Links are
right-aligned inside each column.

---

## 4. Per-page notes

### `index.astro` — homepage
- Full-bleed blue hero as described above. Photos: `vitaly-gariev` in the
  Conversations card, `jens-lelie` forest path in Decisions, `robot.jpg` in the
  closing panel.
- Decisions/Conversations cards: photo fills the arched corner
  (`210px 32px 32px 32px` and mirrored), 250px tall, no icons, no captions.
- All content grids use `minmax(0, …)` columns. Without it the image's intrinsic
  width forces its column to ~600px and crushes the text column.
- Closing panel: photo left in a `28px 28px 190px 28px` frame, text column right
  stacking headline → copy → button.

### `decisions/index.astro`
Numbered rows on hairlines, **not** a card grid. Marigold numerals at 40px
(decorative — the question carries the meaning), question in Outfit 800 navy,
description, then "Read the answer →". Row gets a `--surface-2` tint and a
26px right radius on hover.

### `decisions/[...slug].astro`
Order: hero → three-stance ladder → body sections → "Talk about it too" →
hairline → prev/next → "See all 11 decisions" (centred) → full-bleed
`--panel-blue` buy band → source footnotes.

- Stance ladder is three `150px / 1fr` labelled rows on hairlines, no cards, and
  **no rule above the first row**.
- Section headings get ~78px of space above them.
- The buy band is full-bleed so it reads as a commercial aside, separate from
  the answer.
- Sources are small grey numbered footnotes at the very bottom, not a titled
  section mid-page.
- The last-reviewed line and the plan button were removed from this template.

### `conversations/index.astro`
Cards grouped by strand, each with title, idea, and four age pills. Border turns
`--accent` on hover. No age filter — every concept carries all four bands, so a
filter would never remove a card.

### `conversations/[...slug].astro`
Navy hero, working age-band filter, then per-band cards. **Filter state must be
real markup, not interpolated styles** — the active/inactive treatments are two
literal branches chosen by a boolean. Interpolating a style string leaves the
highlight stuck on the first option.

### `plan.astro` + `PlanBuilder.tsx`
- The four question groups are **not** `<fieldset>`/`<legend>`. Browsers make a
  legend straddle the border; use plain headings inside the card.
- Inputs are `--panel-blue` with a `--panel-blue-line` border. A field matching
  the page background reads as a gap.
- The privacy note is a plain footnote under the description — 15.5px, muted,
  first sentence semibold in `--primary`. Not a card.
- Button always reads "Build my plan" / "Update my plan", never a child count.

### `teachers.astro`
- Band filter must populate **all four** bands per concept. Selecting a band that
  has no data empties the page, which contradicts the comment in this file.
- Guard `listenForClass` — it is optional in the schema.
- Age panels are white with a `--panel-blue-line-strong` outline, sitting inside
  the white activity card. Not filled.

### `picks.astro`
- Filter is a multi-select dropdown: checkboxes with counts, "Clear all", an
  "All / N selected" label, closing on outside click and Escape.
- An emptied group is **removed entirely**, heading and rule included. The
  `data-empty` "Nothing in this category." paragraph in the current file is dead
  markup — the script hides the whole section instead. Delete it.
- Cards: category icon tile in the category hue, the primary category once as a
  small coloured label under the name, pills only for genuine second categories.
  Outbound links are all `--primary`, not category-coloured. Downsides box is
  `--panel-blue`.

### `about.astro`
"What we will not do" becomes the ✕ list. Hero photo is `ball-pit.jpg`.

### `trusted.astro`
Three-column card grid, plus a 20th marigold card: "Suggest a thought leader"
with a single text field and a Submit button posting to `/api/suggest`.
See `handoff/api-suggest.ts` for the Resend route.

**Keep the `sr-only` accessible names** on every outbound link
("Read {name}", "Instagram for {name}"). Nineteen identical "Read" links are
unusable with a screen reader.

### `404.astro`
Three white destination cards keeping the per-link hover colours. Large sun
beside the heading, rotating 45° on hover.

---

## 5. Copy changes

Everything else is verbatim. These were changed on request:

- **What to buy**, hero description → "Explore products and services that help
  kids stay a little less digitally entrenched and enable parents to manage
  device use and find fun activities."
  *This drops the "every entry says what it is bad at… nothing here pays us"
  framing and the link into Decisions. The no-sponsorship claim now appears only
  in the footer.*
- **Conversations**, first hero paragraph → "Limits help, but kids need to
  understand what these systems are, how they work, who owns them, and what they
  do with their attention and their data. They will use this technology in their
  career, so it shouldn't be mystifying."
- **Conversations**, third hero paragraph → "Every idea below is written four
  times, for a range of ages. Start at any age; a four-year-old can understand
  that a person chose what she is watching."
- **404**, description → "Sorry, we weren't able to find the page you're looking
  for. Here's where you can go:"
  *The "What to buy" card on that page still reads "The old product directory
  lives here now", which referred to the rebuild the old copy explained. Worth
  rewording.*
- **Conversation detail**, the more-access line → "If the child already has more
  access than most:" (was gendered and ended in a full stop).

---

## 6. Photography

Copied into the mockups from `src/assets/photos` plus new uploads. Unused so far:
`stamping.jpg`, `climbing.jpg`, `lego-world.webp`, `blacklight.jpg`,
`painting.jpg` (freed when About moved to the ball pit).

Several new images are Unsplash — the forest path, speech bubble, cafe reader,
laptop pair. **Photographer credit is worth adding somewhere before this ships**,
since the footer makes a point about not being sponsored.

---

## 7. Suggested order

1. Tokens and fonts in `global.css`. Run `scripts/contrast.mjs`. Nothing else
   will look right until this lands.
2. `Base.astro` / footer, since every page inherits it.
3. Homepage.
4. The three index pages (Decisions, Conversations, People we read).
5. The two detail templates.
6. `plan.astro`, `teachers.astro`, `picks.astro` — these carry the interactive
   fixes, so budget the most time here.
7. About and 404.

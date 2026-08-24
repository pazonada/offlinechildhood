import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * Age bands for the Conversations curriculum. The same concept is explained at
 * every band, and scaling is driven by age first. Maturity and how much tech a
 * kid already has are handled as notes inside a band, deliberately not as a
 * second axis, which would double the matrix without adding much.
 */
export const AGE_BANDS = ['4-6', '7-9', '10-12', '13+'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

/**
 * A ladder, not a menu. The site has a point of view (more analog), so the three
 * rungs point in one direction rather than presenting neutral flavors. A family on
 * the first rung is met where it is. It is just not told that all rungs are equal.
 */
export const STANCES = ['start', 'further', 'allin'] as const;
export type StanceId = (typeof STANCES)[number];

export const STANCE_LABELS: Record<StanceId, string> = {
  start: 'Start here',
  further: 'Going further',
  allin: 'All the way',
};

const stance = z.object({
  id: z.enum(STANCES),
  label: z.string(),
  /** One or two sentences. Reused verbatim in the generated family plan. */
  summary: z.string(),
  /** "For families who...", so a reader can self-select without judgement. */
  forFamiliesWho: z.string(),
});

const decisions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/decisions' }),
  schema: () =>
    z.object({
      title: z.string(),
      /** The question as a parent would actually type it. Drives search and the plan builder. */
      question: z.string(),
      description: z.string(),
      order: z.number(),
      /** Which kids this decision tends to come up for. */
      appliesToBands: z.array(z.enum(AGE_BANDS)).nonempty(),
      /** The honest one-paragraph answer, before any product enters the picture. */
      shortAnswer: z.string(),
      stances: z.array(stance).length(3),
      picks: z.array(reference('picks')).default([]),
      relatedConcepts: z.array(reference('concepts')).default([]),
      updated: z.coerce.date(),
    }),
});

const bandExplainer = z.object({
  band: z.enum(AGE_BANDS),
  /** How to explain the concept at this age, in the parent's own voice. */
  explain: z.string(),
  /** Something concrete to do or show. This is the part that makes it stick. */
  tryThis: z.string(),
  /** What you're hoping to hear back, so a parent knows it landed. */
  listenFor: z.string(),
  /** Adjustment if this kid already has more access/experience than typical. */
  ifMoreExperienced: z.string().optional(),
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/concepts' }),
  schema: () =>
    z.object({
      title: z.string(),
      /** The whole idea in one sentence a ten-year-old could repeat. */
      idea: z.string(),
      description: z.string(),
      order: z.number(),
      strand: z.enum([
        'What it is',
        'How it works',
        'Who controls it',
        'How it was built',
        'Risks and guardrails',
      ]),
      bands: z.array(bandExplainer).nonempty(),
      /** Misconceptions worth heading off, including ones adults hold. */
      misconceptions: z.array(z.string()).default([]),
      /** How to run this with a class rather than one kid. */
      classroom: z.string().optional(),
      relatedDecisions: z.array(reference('decisions')).default([]),
      updated: z.coerce.date(),
    }),
});

/**
 * Products live in their own collection and are referenced by slug. Retiring one
 * is a single-file edit and never leaves a decision page half-broken, which is
 * exactly what went wrong with the old product-directory site.
 */
/**
 * Products and services. The top-level split is the one the old site used and
 * the one readers actually think in: is this a thing you buy once, or something
 * you subscribe to. Tags are the finer grain and drive the filter.
 */
export const PICK_TAGS = [
  'Phones and watches',
  'Audio and stories',
  'Computers and tablets',
  'Toys and play',
  'STEM and building',
  'Outdoor and clothing',
  'Cameras and making',
  'Classes and activities',
  'Parental controls',
] as const;

const picks = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/picks' }),
  schema: () =>
    z.object({
      name: z.string(),
      maker: z.string(),
      kind: z.enum(['Product', 'Service']),
      tags: z.array(z.enum(PICK_TAGS)).nonempty(),
      /** One honest sentence on who it's actually for. */
      summary: z.string(),
      /** The actual number where we know it. Vague pricing helps nobody. */
      price: z.string().optional(),
      url: z.string().url(),
      /** Stated plainly on the page. Credibility depends on naming the limits. */
      limitations: z.string().optional(),
      updated: z.coerce.date(),
    }),
});

/** People worth reading, not endorsements. */
const experts = defineCollection({
  loader: file('./src/content/experts/experts.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    focus: z.string(),
    /** Where they actually publish. A newsletter beats a personal site, which
     *  beats an employer's page, because only the last one breaks when they
     *  change jobs. */
    url: z.string().url(),
    /** Handle only, no @ and no URL. */
    instagram: z.string().optional(),
    /** The path segment after /in/. */
    linkedin: z.string().optional(),
    x: z.string().optional(),
  }),
});

export const collections = { decisions, concepts, picks, experts };

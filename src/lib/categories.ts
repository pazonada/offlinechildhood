import type { PICK_TAGS } from '../content.config';

export type PickTag = (typeof PICK_TAGS)[number];

/**
 * One distinct hue per category. Colour now lives only in the iconography, the
 * price dots and the outbound link; the downsides box is neutral on every card.
 *
 * Classes are written out in full because Tailwind scans source text and cannot
 * resolve a string assembled at runtime.
 */
export const TAG_STYLE: Record<PickTag, { text: string; tile: string; dot: string }> = {
  'Phones and watches': {
    text: 'text-cat-phones', tile: 'bg-cat-phones/10 text-cat-phones', dot: 'bg-cat-phones',
  },
  'Audio and stories': {
    text: 'text-cat-audio', tile: 'bg-cat-audio/10 text-cat-audio', dot: 'bg-cat-audio',
  },
  'Computers and tablets': {
    text: 'text-cat-computers', tile: 'bg-cat-computers/10 text-cat-computers', dot: 'bg-cat-computers',
  },
  'Toys and play': {
    text: 'text-cat-toys', tile: 'bg-cat-toys/10 text-cat-toys', dot: 'bg-cat-toys',
  },
  'STEM and building': {
    text: 'text-cat-stem', tile: 'bg-cat-stem/10 text-cat-stem', dot: 'bg-cat-stem',
  },
  'Outdoor and clothing': {
    text: 'text-cat-outdoor', tile: 'bg-cat-outdoor/10 text-cat-outdoor', dot: 'bg-cat-outdoor',
  },
  'Cameras and making': {
    text: 'text-cat-cameras', tile: 'bg-cat-cameras/10 text-cat-cameras', dot: 'bg-cat-cameras',
  },
  'Classes and activities': {
    text: 'text-cat-classes', tile: 'bg-cat-classes/10 text-cat-classes', dot: 'bg-cat-classes',
  },
  'Parental controls': {
    text: 'text-cat-controls', tile: 'bg-cat-controls/10 text-cat-controls', dot: 'bg-cat-controls',
  },
};

export const PRICE_LEVEL: Record<string, number> = { $: 1, $$: 2, $$$: 3 };

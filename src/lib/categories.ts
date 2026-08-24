import type { PICK_TAGS } from '../content.config';

export type PickTag = (typeof PICK_TAGS)[number];

/**
 * A colour per tag, so the page has rhythm as you scroll rather than being one
 * long run of identical cards. Classes are written out in full because Tailwind
 * scans source text and cannot resolve a string built at runtime.
 */
export const TAG_STYLE: Record<PickTag, { text: string; tile: string; dot: string; note: string }> = {
  'Phones and watches': {
    text: 'text-primary-text', tile: 'bg-primary/10 text-primary-text',
    dot: 'bg-primary', note: 'bg-primary text-white',
  },
  'Audio and stories': {
    text: 'text-secondary', tile: 'bg-secondary/10 text-secondary',
    dot: 'bg-secondary', note: 'bg-secondary text-white',
  },
  'Computers and tablets': {
    text: 'text-primary-text', tile: 'bg-primary/10 text-primary-text',
    dot: 'bg-primary', note: 'bg-primary text-white',
  },
  'Toys and play': {
    text: 'text-coral', tile: 'bg-coral/10 text-coral',
    dot: 'bg-coral', note: 'bg-coral text-white',
  },
  'STEM and building': {
    text: 'text-coral', tile: 'bg-coral/10 text-coral',
    dot: 'bg-coral', note: 'bg-coral text-white',
  },
  'Outdoor and clothing': {
    text: 'text-secondary', tile: 'bg-secondary/10 text-secondary',
    dot: 'bg-secondary', note: 'bg-secondary text-white',
  },
  'Cameras and making': {
    text: 'text-coral', tile: 'bg-coral/10 text-coral',
    dot: 'bg-coral', note: 'bg-coral text-white',
  },
  'Classes and activities': {
    text: 'text-primary-text', tile: 'bg-primary/10 text-primary-text',
    dot: 'bg-primary', note: 'bg-primary text-white',
  },
  'Parental controls': {
    text: 'text-ink-soft', tile: 'bg-surface-3 text-ink-soft',
    dot: 'bg-ink-soft', note: 'bg-ink-soft text-white',
  },
};

export const PRICE_LEVEL: Record<string, number> = { $: 1, $$: 2, $$$: 3 };

import type { Category } from '../components/CategoryIcon.astro';

/**
 * A colour per category, so the page has some rhythm as you scroll rather than
 * being one long run of identical grey cards. Classes are written out in full
 * because Tailwind scans source text and cannot resolve a constructed string.
 */
export const CATEGORY_STYLE: Record<
  Category,
  { text: string; tile: string; rule: string; dot: string }
> = {
  'Phones and watches': {
    text: 'text-primary-text',
    tile: 'bg-primary/10 text-primary-text',
    rule: 'bg-primary/30',
      dot: 'bg-primary',
  },
  'Audio and stories': {
    text: 'text-secondary',
    tile: 'bg-secondary/10 text-secondary',
    rule: 'bg-secondary/30',
      dot: 'bg-secondary',
  },
  'Cameras and making': {
    text: 'text-coral',
    tile: 'bg-coral/10 text-coral',
    rule: 'bg-coral/30',
      dot: 'bg-coral',
  },
  'Games and play': {
    text: 'text-primary-text',
    tile: 'bg-primary/10 text-primary-text',
    rule: 'bg-primary/30',
      dot: 'bg-primary',
  },
  'Books and paper': {
    text: 'text-coral',
    tile: 'bg-coral/10 text-coral',
    rule: 'bg-coral/30',
      dot: 'bg-coral',
  },
  Outdoor: {
    text: 'text-secondary',
    tile: 'bg-secondary/10 text-secondary',
    rule: 'bg-secondary/30',
      dot: 'bg-secondary',
  },
  'Software and settings': {
    text: 'text-ink-soft',
    tile: 'bg-surface-3 text-ink-soft',
    rule: 'bg-line',
      dot: 'bg-ink-soft',
  },
};

export const PRICE_LEVEL: Record<string, number> = { $: 1, $$: 2, $$$: 3 };

export interface NavItem {
  href: string;
  label: string;
  /** Shown in the mobile menu and footer to orient first-time visitors. */
  blurb?: string;
}

/** The two pillars come first: what to decide, and what to teach. */
export const primaryNav: NavItem[] = [
  { href: '/decisions', label: 'Decisions', blurb: 'The device calls every family has to make' },
  { href: '/conversations', label: 'Conversations', blurb: 'Teaching kids to read the media around them' },
  { href: '/plan', label: 'Your family plan', blurb: 'Answer a few questions, get a plan you can print' },
];

export const secondaryNav: NavItem[] = [
  { href: '/picks', label: 'What to buy' },
  { href: '/about', label: 'About' },
];

export const footerNav: NavItem[] = [
  ...primaryNav,
  ...secondaryNav,
  { href: '/trusted', label: 'People we read' },
];

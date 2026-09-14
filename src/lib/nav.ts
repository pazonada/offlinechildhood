export interface NavItem {
  href: string;
  label: string;
  /** Shown in the mobile menu to orient first-time visitors. */
  blurb?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * The header holds exactly two dropdown groups and the search icon; About
 * lives in the footer only. The owner chose this over a flat row after seven
 * items crowded the bar.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'For parents',
    items: [
      { href: '/decisions', label: 'Decisions', blurb: 'The device calls every family has to make' },
      { href: '/conversations', label: 'Conversations', blurb: 'Teaching kids to read the media around them' },
      { href: '/plan', label: 'Your family plan', blurb: 'Answer a few questions, get a plan you can print' },
      { href: '/settings', label: 'Device settings', blurb: 'The five levers, on every device you own' },
      { href: '/picks', label: 'What to buy', blurb: 'Products that help, and their honest downsides' },
    ],
  },
  {
    label: 'Teachers',
    items: [
      { href: '/teachers', label: 'Lesson plans', blurb: 'Thirteen classroom activities, one lesson each' },
      { href: '/conversations', label: 'Conversations', blurb: 'Every idea, written for four age bands' },
    ],
  },
];

export const footerNav: NavItem[] = [
  { href: '/decisions', label: 'Decisions' },
  { href: '/conversations', label: 'Conversations' },
  { href: '/plan', label: 'Your family plan' },
  { href: '/settings', label: 'Device settings' },
  { href: '/picks', label: 'What to buy' },
  { href: '/teachers', label: 'For teachers' },
  { href: '/about', label: 'About' },
  { href: '/trusted', label: 'People we read' },
  { href: '/suggest', label: 'Suggest a topic' },
  { href: 'https://www.reddit.com/r/OfflineChildhood/', label: 'Community' },
  { href: '/#updates', label: 'Email updates' },
];

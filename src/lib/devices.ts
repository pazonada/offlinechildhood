/**
 * The device-settings guide: five levers per device, in the owner's words,
 * with one link each to the maker's always-current documentation. Menus are
 * deliberately not mirrored here; the levers are the durable part.
 * Every URL below was verified live on 2026-09-14.
 */

export interface DeviceLever {
  lever: string;
  detail: string;
}

export interface Device {
  id: string;
  name: string;
  note: string;
  levers: DeviceLever[];
  linkLabel: string;
  url: string;
}

export const DEVICES: Device[] = [
  {
    id: 'iphone-ipad',
    name: 'iPhone and iPad (Apple Screen Time)',
    note: 'The most complete set of levers, if you do the account step first.',
    levers: [
      { lever: 'Account', detail: 'Create a child Apple Account in Family Sharing, so every setting below can be managed from your own phone.' },
      { lever: 'Time', detail: 'Downtime for the hours the device sleeps, App Limits for daily budgets.' },
      { lever: 'Content', detail: 'Age ratings per category, web filtering, and "Allowed Websites Only", which is the strict version.' },
      { lever: 'Apps and money', detail: 'Ask to Buy sends every download and purchase to your phone for approval.' },
      { lever: 'Other people', detail: 'Communication Limits controls who they can call and message, including during Downtime.' },
    ],
    linkLabel: "Apple's own setup guide (kept current by Apple)",
    url: 'https://support.apple.com/en-us/105121',
  },
  {
    id: 'android',
    name: 'Android phone or tablet (Google Family Link)',
    note: "Nearly as complete as Apple's, and managed from your phone.",
    levers: [
      { lever: 'Account', detail: 'A child Google Account supervised through the Family Link app.' },
      { lever: 'Time', detail: 'Daily limits, bedtime hours, and per-app limits.' },
      { lever: 'Content', detail: "Age ratings in the Play Store, SafeSearch, and Chrome's approve-only website mode." },
      { lever: 'Apps and money', detail: 'Every install and purchase can require your approval.' },
      { lever: 'Other people', detail: 'No single switch; contact controls live inside each app, so this lever is app-by-app work.' },
    ],
    linkLabel: "Google's own Family Link guide",
    url: 'https://support.google.com/familylink/',
  },
  {
    id: 'fire-tablet',
    name: 'Amazon Fire tablet (Amazon Kids)',
    note: 'The strongest built-in kid mode of any cheap tablet.',
    levers: [
      { lever: 'Account', detail: 'A child profile locks the whole tablet into Amazon Kids; leaving it requires your PIN.' },
      { lever: 'Time', detail: 'Daily limits, bedtime, and educational-goals-before-entertainment ordering.' },
      { lever: 'Content', detail: 'You curate the library; the kid browser only reaches approved sites.' },
      { lever: 'Apps and money', detail: 'Nothing installs and nothing sells inside a kid profile.' },
      { lever: 'Other people', detail: "Effectively off; there's no open communication in the kid profile." },
    ],
    linkLabel: "Amazon's own Kids settings guide",
    url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=G93XLZGRK98PQ9M4',
  },
  {
    id: 'roku',
    name: 'Roku',
    note: 'Honest summary: Roku barely has parental controls.',
    levers: [
      { lever: 'Account', detail: 'No child profiles. Everyone shares the same Roku.' },
      { lever: 'Time', detail: 'Does not exist. The real time lever is the TV, the outlet, or the household rule.' },
      { lever: 'Content', detail: 'A PIN can gate The Roku Channel by rating, but apps like YouTube or Netflix bring their own settings; you configure each app separately.' },
      { lever: 'Apps and money', detail: 'A PIN can require approval to add channels or purchase.' },
      { lever: 'Other people', detail: 'Not applicable.' },
    ],
    linkLabel: "Roku's own parental controls page",
    url: 'https://support.roku.com/article/208756478',
  },
  {
    id: 'apple-tv',
    name: 'Apple TV',
    note: 'Good content locks, weak time controls.',
    levers: [
      { lever: 'Account', detail: 'Shares your Family Sharing setup; restrictions are set on the device.' },
      { lever: 'Time', detail: 'Thin. You make your own rules, but make sure the TV is in a common room.' },
      { lever: 'Content', detail: 'Ratings restrictions per category behind a PIN.' },
      { lever: 'Apps and money', detail: 'Purchases and app installs can require the PIN.' },
      { lever: 'Other people', detail: 'Not applicable.' },
    ],
    linkLabel: "Apple's own Apple TV restrictions guide",
    url: 'https://support.apple.com/guide/tv/set-up-parental-controls-atvbbaf126df/tvos',
  },
  {
    id: 'switch',
    name: 'Nintendo Switch',
    note: "Nintendo's parental controls app is the best in the console business.",
    levers: [
      { lever: 'Account', detail: 'A child account linked to your family group, managed from the phone app.' },
      { lever: 'Time', detail: 'A daily limit and bedtime; the console shows the countdown and can suspend play.' },
      { lever: 'Content', detail: 'Age ratings restrict which games run.' },
      { lever: 'Apps and money', detail: 'eShop purchases can be restricted entirely.' },
      { lever: 'Other people', detail: 'Communication toggles, settable per game.' },
    ],
    linkLabel: "Nintendo's own parental controls guide",
    url: 'https://www.nintendo.com/us/switch/parental-controls/',
  },
  {
    id: 'playstation',
    name: 'PlayStation',
    note: 'Full-featured, once the family account exists.',
    levers: [
      { lever: 'Account', detail: 'A child account inside your PlayStation family group.' },
      { lever: 'Time', detail: 'Playtime schedules and daily limits, adjustable from your phone.' },
      { lever: 'Content', detail: 'Age ratings per child.' },
      { lever: 'Apps and money', detail: 'A monthly spending cap, which can be zero.' },
      { lever: 'Other people', detail: 'Communication and content-sharing toggles per child.' },
    ],
    linkLabel: "Sony's own family accounts guide",
    url: 'https://www.playstation.com/en-us/family/',
  },
  {
    id: 'xbox',
    name: 'Xbox',
    note: 'The same levers, plus they follow the kid to a Windows PC.',
    levers: [
      { lever: 'Account', detail: 'A child account in a Microsoft family group, managed from the Family Safety app.' },
      { lever: 'Time', detail: 'Screen-time schedules per device.' },
      { lever: 'Content', detail: 'Age ratings, and web filtering in Edge.' },
      { lever: 'Apps and money', detail: 'Ask-a-parent approval for installs and spending.' },
      { lever: 'Other people', detail: 'Communication settings per child.' },
    ],
    linkLabel: "Microsoft's own Family Safety guide",
    url: 'https://support.microsoft.com/en-us/family-safety',
  },
  {
    id: 'chromebook',
    name: 'Chromebook at home (Google Family Link)',
    note: 'The same Family Link levers as an Android phone, on a laptop.',
    levers: [
      { lever: 'Account', detail: "The kid signs in with their supervised Google Account. A school-issued Chromebook is different: the school's settings win, and we cover that on the school laptop page." },
      { lever: 'Time', detail: 'Daily limits and bedtime per school-night.' },
      { lever: 'Content', detail: 'Chrome can run approve-only; SafeSearch stays locked on.' },
      { lever: 'Apps and money', detail: 'Installs require approval.' },
      { lever: 'Other people', detail: 'App-by-app, same as Android.' },
    ],
    linkLabel: "Google's own Family Link guide",
    url: 'https://support.google.com/familylink/',
  },
];

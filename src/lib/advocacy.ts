import { SOURCES, type Source } from './sources';

export type PhoneChoice = 'fine' | 'class' | 'bell' | 'none';
export type DeviceChoice = 'fine' | 'guardrails' | 'reduce' | 'none';
export type AiChoice = 'fine' | 'optin' | 'off' | 'teach';
export type Audience = 'principal' | 'board' | 'parents';

export interface Selections {
  phones: PhoneChoice;
  devices: DeviceChoice;
  ai: AiChoice;
  audience: Audience;
  school: string;
}

export interface SheetEvidence {
  text: string;
  source: Source;
}

export interface Sheet {
  asks: string[];
  evidence: SheetEvidence[];
  scriptHeading: string;
  script: string;
}

const PHONE_ASKS: Record<Exclude<PhoneChoice, 'fine'>, string> = {
  class:
    'Phones away during instructional time, collected or pouched, with one policy for the whole school so no single teacher has to enforce it alone.',
  bell: 'Phones put away bell to bell, from first period to last, so the policy covers the hallways and the lunchroom where most of the pressure lives.',
  none: 'Personal phones left at home or checked in for the day, with a phone in the front office for anything urgent.',
};

const DEVICE_ASKS: Record<Exclude<DeviceChoice, 'fine'>, string[]> = {
  guardrails: [
    'Notifications switched off on school-issued devices, every app, news alerts included.',
    'The browser on school-issued devices limited to what schoolwork actually needs.',
    'Assigned reading available on paper for any family that asks for it.',
  ],
  reduce: [
    'School-issued devices that stay at school instead of traveling home.',
    'Homework that works without a screen as the default, with the device version as the exception.',
    'Reading assigned on paper first, with the screen copy as the backup.',
  ],
  none: [
    'A plan to wind down one-to-one devices, or a documented opt-out for families who want their child taught without one.',
    'Assigned reading available on paper for any family that asks for it.',
  ],
};

const AI_ASKS: Record<Exclude<AiChoice, 'fine'>, string> = {
  optin:
    'AI assistants off by default on student accounts, switched on class by class when a teacher chooses them for a reason they can name.',
  off: 'AI assistants disabled on student accounts, with a written policy for what would change that and how parents would hear about it first.',
  teach:
    'Where AI tools are on, lessons that teach how they actually work: where they get their material, when they are confidently wrong, and who pays for them.',
};

// "Delgado, P., Vargas, C., ..." reads as "Delgado et al." inline; the full
// citation still appears in the sources footer.
export function shortCite(authors: string): string {
  if (!authors.includes(',')) return authors;
  const surname = authors.split(',')[0].trim();
  return authors.includes('&') || authors.split(',').length > 2 ? `${surname} et al.` : surname;
}

export function buildSheet(sel: Selections): Sheet {
  const asks: string[] = [];
  if (sel.phones !== 'fine') asks.push(PHONE_ASKS[sel.phones]);
  if (sel.devices !== 'fine') asks.push(...DEVICE_ASKS[sel.devices]);
  if (sel.ai !== 'fine') asks.push(AI_ASKS[sel.ai]);

  // Evidence appears only for the asks actually made. A sheet that cites
  // studies for requests it is not making reads as a form letter.
  const evidence: SheetEvidence[] = [];
  if (sel.phones !== 'fine') {
    evidence.push({
      text: 'At least 39 states and the District of Columbia now require school districts to ban or restrict student phone use, and most of that legislation passed within the last two years.',
      source: SOURCES.edWeekPhones,
    });
  }
  if (sel.devices !== 'fine') {
    evidence.push({
      text: 'Across 54 studies and more than 170,000 readers, comprehension was reliably better on paper than on screens, and the advantage for paper has widened even as screens improved.',
      source: SOURCES.screenReading,
    });
  }
  if (sel.ai === 'optin' || sel.ai === 'off') {
    evidence.push({
      text: "When Google expanded its Gemini AI to school accounts for students of all ages, it arrived switched on by default, controlled only by the district's administrator, with no teacher-level switch and no parental notification.",
      source: SOURCES.geminiClassroom,
    });
  }
  if (sel.ai === 'teach') {
    evidence.push({
      text: 'In a survey of 1,204 children aged 9 to 17, most said their school had set rules for AI, while far fewer had been taught to use it safely, and more than four in ten said no adult had ever talked to them about it.',
      source: SOURCES.csAiCensus,
    });
  }

  const school = sel.school.trim() || 'our school';

  let scriptHeading = '';
  let script = '';
  if (sel.audience === 'principal') {
    scriptHeading = 'The email to send with this sheet';
    script = `We are writing about the technology our children use at ${school}. Before anything else, we have three questions: which AI tools and notifications are enabled on the devices our children use, who reviewed those defaults, and can families opt out? The requests on this page are the changes we are asking for, and each carries its reasons. We would rather work with the school on this than around it, and we are glad to talk with whoever makes these calls.`;
  } else if (sel.audience === 'board') {
    scriptHeading = 'The two minutes at the board meeting';
    script = `We are parents at ${school}.${
      sel.phones !== 'fine'
        ? ' Thirty-nine states now restrict phones in schools, so nothing on this page asks this district to lead the country.'
        : ''
    } We are asking the board to review what is switched on by default on the technology our children use, to tell parents the reasons, and to consider the requests on this page. Each one is a change the district can grant, and we are handing it over in writing so it can be read after tonight.`;
  } else {
    scriptHeading = 'The message to another parent';
    script = `Have you looked at what is switched on for the kids at ${school}? I am going to ask about it in writing, and this sheet is what I am sending. Want to sign it with me? One parent asking is feedback. A few families asking together is an agenda item.`;
  }

  return { asks, evidence, scriptHeading, script };
}

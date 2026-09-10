import { SOURCES, type Source } from './sources';

export type PhoneChoice = 'fine' | 'class' | 'bell' | 'none';
export type DeviceChoice = 'fine' | 'guardrails' | 'reduce' | 'none';
export type ClassDeviceChoice = 'fine' | 'guardrails' | 'reduce';
export type AiChoice = 'fine' | 'optin' | 'off' | 'teach';
export type Audience = 'principal' | 'board' | 'parents' | 'admin';

export interface Selections {
  phones: PhoneChoice;
  devices: DeviceChoice;
  classDevices: ClassDeviceChoice;
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
  howTo: string[];
  scriptHeading: string;
  script: string;
}

const PHONE_ASKS: Record<Exclude<PhoneChoice, 'fine'>, string> = {
  class:
    'Phones away during instructional time, collected, with one policy for the whole school so no single teacher has to enforce it alone.',
  bell: 'Phones put away bell to bell, from first period to last, so the policy covers the hallways and the lunchroom where most of the pressure lives.',
  none: 'Personal phones left at home or checked in for the day, with a phone in the front office for anything urgent.',
};

const DEVICE_ASKS: Record<Exclude<DeviceChoice, 'fine'>, string[]> = {
  guardrails: [
    'Notifications turned off on school-issued devices for every app – news alerts included.',
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

const CLASS_DEVICE_ASKS: Record<Exclude<ClassDeviceChoice, 'fine'>, string[]> = {
  guardrails: [
    'The browser on shared classroom devices limited to the sites the lesson needs, with the internet enabled by the teacher for a named purpose and turned off after.',
    'Only the apps the lesson calls for enabled, with webcams and microphones off unless the lesson is actually using them.',
    'Personal sign-ins blocked and browsing data cleared between students, so no password gets typed into a machine that remembers it and no cookie follows a kid to the next session.',
    'An adult who can see the screens whenever devices are out, independent work time included. This is a guardrail no filter replaces.',
  ],
  reduce: [
    'Shared classroom devices reserved for the work that actually needs them, with paper as the default for reading and writing.',
  ],
};

const AI_ASKS: Record<Exclude<AiChoice, 'fine'>, string> = {
  optin:
    "AI agents and assistants off by default on student accounts, and turned on per student only with that family's consent, so one kid's device can have it while another's does not.",
  off: 'AI agents disabled on student accounts, with a written policy for what would change that and how parents would hear about it first.',
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
  if (sel.classDevices !== 'fine') asks.push(...CLASS_DEVICE_ASKS[sel.classDevices]);
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
  if (sel.devices !== 'fine' || sel.classDevices !== 'fine') {
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

  // The switches, named specifically, because the person managing school
  // devices is often an office manager with no IT training, and a request
  // that arrives with its own instructions is far easier to grant.
  const howTo: string[] = [];
  const anyDeviceAsk = sel.devices !== 'fine' || sel.classDevices !== 'fine';
  if (sel.ai !== 'fine' && sel.ai !== 'teach') {
    howTo.push(
      'Built-in AI: in the Google Admin console (admin.google.com), the Generative AI settings control the Gemini app and Gemini in Classroom separately, each with its own off switch, applied per student organizational unit so access can differ by grade.',
    );
  }
  if (anyDeviceAsk) {
    howTo.push(
      'Browsing limits: managed Chromebooks take a URL blocklist (YouTube, social media, personal email) or the stricter allowlist-only mode, plus forced SafeSearch and YouTube Restricted Mode, all set per grade level under Chrome policies. These ride on the student profile, so they keep working on the home wifi.',
      'Data privacy on shared devices: forced ephemeral sessions wipe browsing data, cookies, and any typed passwords when a student signs out, and blocking guest mode means every session runs under a managed student profile that carries the limits with it.',
      'Apps and hardware: Chrome policies can block all extensions and apps except an approved list, and disable the camera and microphone by default. On iPads, the same lives in any device manager as an app allowlist, allowed-websites-only mode in Safari, and camera restrictions.',
      'The network layer: content filtering at the school router covers every device at once. US public schools taking E-Rate funding are already required by the Children\u2019s Internet Protection Act to filter, to monitor minors\u2019 online activity, and to adopt an internet safety policy at a publicly noticed meeting, which any parent can ask to read. A school with nobody in the IT chair can point its router at a free family-shield DNS service and block whole categories with one setting.',
      'Vendor data: districts in most states can use the Student Data Privacy Consortium\u2019s standard national agreement, which binds an app maker on how student data is collected, kept, and deleted. Asking whether each app on the device has a signed agreement takes one email.',
    );
  }
  const school = sel.school.trim() || 'our school';

  let scriptHeading = '';
  let script = '';
  if (sel.audience === 'principal') {
    scriptHeading = 'The email to send with this sheet';
    script = `We are writing about the technology our children use at ${school}. Before anything else, we have three questions: Which AI tools and notifications are enabled on the devices our children use? Who reviewed those default settings? Can families opt out? The requests on the attached sheet are the changes we are asking for, with justifications for each. We would rather work with the school on this than around it, and we are glad to talk with whomever makes these calls.`;
  } else if (sel.audience === 'board') {
    scriptHeading = 'The message to the board, spoken or sent';
    script = `We are parents at ${school}.${
      sel.phones !== 'fine'
        ? ' Thirty-nine states now restrict phones in schools, so nothing in our requests asks this district to lead the country.'
        : ''
    } We are asking the board to review what is turned on by default for the technology our children use, to tell parents the reasons, and to consider the requests on our sheet. Each one is a change the district can grant, and we have put it all in writing so it can circulate and be read on its own time.`;
  } else if (sel.audience === 'admin') {
    scriptHeading = 'The email to the administrator';
    script = `We are writing about the technology our children use at ${school}, and we are coming to you because you are closest to how the devices are actually set up. The requests on our sheet are specific settings${
      howTo.length > 0 ? ', and the page after it identifies where each one lives' : ''
    }. We would be glad to go through them together, and a written note on what is enabled today would give every parent involved the same facts to start from.`;
  } else {
    scriptHeading = 'The message to another parent';
    script = `Have you looked at what is turned on for the kids at ${school}? I am going to ask about it in writing, and this sheet is what I am sending. Want to sign it with me? One parent asking is feedback. A few families asking together is an agenda item.`;
  }

  return { asks, evidence, howTo, scriptHeading, script };
}

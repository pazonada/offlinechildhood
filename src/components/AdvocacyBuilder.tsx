import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildSheet,
  shortCite,
  type AiChoice,
  type ClassDeviceChoice,
  type Audience,
  type DeviceChoice,
  type PhoneChoice,
  type Selections,
} from '../lib/advocacy';

const PHONE_OPTIONS: { id: PhoneChoice; label: string; blurb: string }[] = [
  { id: 'fine', label: 'Fine as they are', blurb: 'Phones are not the fight you came for.' },
  { id: 'class', label: 'Away during class', blurb: 'Out of hands during instruction, back at breaks.' },
  { id: 'bell', label: 'Away bell to bell', blurb: 'Put away for the whole school day.' },
  { id: 'none', label: 'Not on campus', blurb: 'Left at home or checked in at the door.' },
];

const DEVICE_OPTIONS: { id: DeviceChoice; label: string; blurb: string }[] = [
  { id: 'fine', label: 'Fine as they are', blurb: 'The laptops and tablets are working out.' },
  { id: 'guardrails', label: 'Keep them, with guardrails', blurb: 'Notifications off, browser limited, paper on request.' },
  { id: 'reduce', label: 'Fewer of them', blurb: 'Devices stay at school, homework works on paper.' },
  { id: 'none', label: 'None at all', blurb: 'Wind them down, or an opt-out for your family.' },
];

const CLASS_DEVICE_OPTIONS: { id: ClassDeviceChoice; label: string; blurb: string }[] = [
  { id: 'fine', label: 'Fine as they are', blurb: 'The class sets and carts are not a worry.' },
  { id: 'guardrails', label: 'Locked to the lesson', blurb: 'Filtered browser, approved apps only, cameras off, screens watched.' },
  { id: 'reduce', label: 'Screens as the exception', blurb: 'Reserved for work that actually needs a device.' },
];

const AI_OPTIONS: { id: AiChoice; label: string; blurb: string }[] = [
  { id: 'fine', label: 'Fine as it is', blurb: 'AI on school accounts is not your concern.' },
  { id: 'optin', label: 'Off by default', blurb: 'Switched on per student, only with parent consent.' },
  { id: 'off', label: 'Off entirely', blurb: 'Disabled on student accounts, policy in writing.' },
  { id: 'teach', label: 'On, but taught', blurb: 'Keep the tools and teach how they actually work.' },
];

const AUDIENCE_OPTIONS: { id: Audience; label: string; blurb: string }[] = [
  { id: 'principal', label: 'The principal', blurb: 'An email with the sheet attached.' },
  { id: 'board', label: 'The school board', blurb: 'Works read aloud at the microphone or sent as an email.' },
  { id: 'parents', label: 'Other parents first', blurb: 'Recruit a signature or two before anyone official.' },
];

function OptionGrid<T extends string>({
  legend,
  hint,
  options,
  value,
  onChange,
}: {
  legend: string;
  hint: string;
  options: { id: T; label: string; blurb: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <section className="rounded-[26px] border-2 border-line bg-surface px-[30px] pb-[30px] pt-7">
      <h2 className="font-display text-[23px] font-extrabold text-navy">{legend}</h2>
      <p className="mt-1.5 text-[1.03rem] text-ink-soft">{hint}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.id)}
              className={`rounded-[20px] border-2 p-5 text-left transition ${
                on ? 'border-primary bg-panel-blue' : 'border-line hover:border-navy'
              }`}
            >
              <span className="block font-display text-[18px] font-extrabold text-navy">{o.label}</span>
              <span className="mt-1.5 block text-[0.95rem] text-ink-soft">{o.blurb}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function AdvocacyBuilder() {
  const [phones, setPhones] = useState<PhoneChoice>('fine');
  const [devices, setDevices] = useState<DeviceChoice>('fine');
  const [classDevices, setClassDevices] = useState<ClassDeviceChoice>('fine');
  const [ai, setAi] = useState<AiChoice>('fine');
  const [audience, setAudience] = useState<Audience>('principal');
  const [school, setSchool] = useState('');
  const [built, setBuilt] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // A link can carry a preset (?phones=bell&devices=guardrails&ai=optin&who=board),
  // so a configured sheet is shareable between parents.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const pick = <T extends string>(key: string, ids: readonly { id: T }[], set: (v: T) => void) => {
      const v = q.get(key);
      const hit = ids.find((o) => o.id === v);
      if (hit) set(hit.id);
      return Boolean(hit);
    };
    const any = [
      pick('phones', PHONE_OPTIONS, setPhones),
      pick('devices', DEVICE_OPTIONS, setDevices),
      pick('class', CLASS_DEVICE_OPTIONS, setClassDevices),
      pick('ai', AI_OPTIONS, setAi),
      pick('who', AUDIENCE_OPTIONS, setAudience),
    ].some(Boolean);
    const name = q.get('school');
    if (name) setSchool(name.slice(0, 80));
    if (any) setBuilt(true);
  }, []);

  const sel: Selections = { phones, devices, classDevices, ai, audience, school };
  const sheet = useMemo(() => buildSheet(sel), [phones, devices, classDevices, ai, audience, school]);
  const empty = sheet.asks.length === 0;

  const build = () => {
    setBuilt(true);
    requestAnimationFrame(() => {
      sheetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      sheetRef.current?.focus();
    });
  };

  return (
    <div>
      <div className="no-print grid gap-8">
        <OptionGrid
          legend="Phones at school"
          hint="Personal phones, the ones in pockets and backpacks."
          options={PHONE_OPTIONS}
          value={phones}
          onChange={setPhones}
        />
        <OptionGrid
          legend="School-issued devices"
          hint="The one-to-one laptops and tablets handed to each kid, the ones that travel home."
          options={DEVICE_OPTIONS}
          value={devices}
          onChange={setDevices}
        />
        <OptionGrid
          legend="Devices used in class"
          hint="The shared carts and class sets kids pick up for project work, even when nothing goes home."
          options={CLASS_DEVICE_OPTIONS}
          value={classDevices}
          onChange={setClassDevices}
        />
        <OptionGrid
          legend="AI on school accounts"
          hint="Assistants and chatbots switched on inside school tools."
          options={AI_OPTIONS}
          value={ai}
          onChange={setAi}
        />
        <OptionGrid
          legend="Who are you talking to first?"
          hint="This picks the script that prints with your sheet."
          options={AUDIENCE_OPTIONS}
          value={audience}
          onChange={setAudience}
        />

        <section className="rounded-[26px] border-2 border-line bg-surface px-[30px] pb-[30px] pt-7">
          <h2 className="font-display text-[23px] font-extrabold text-navy">Your school's name</h2>
          <p className="mt-1.5 text-[1.03rem] text-ink-soft">
            Optional. It goes on the sheet and nowhere else; nothing you type leaves your browser.
          </p>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Maple Elementary"
            className="mt-4 w-full max-w-[24rem] rounded-[14px] border-2 border-panel-blue-line bg-panel-blue px-3.5 py-[11px] text-ink"
          />
        </section>

        <div>
          <button
            type="button"
            onClick={build}
            disabled={empty}
            className="rounded-full bg-primary px-[34px] py-[17px] font-label text-lg font-bold text-on-navy-bright transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
          >
            {built ? 'Update my sheet' : 'Build my sheet'}
          </button>
          {empty && (
            <p className="mt-3 text-ink-soft">
              Everything is set to fine as it is, which leaves nothing to ask for. Change at least
              one answer to build a sheet.
            </p>
          )}
        </div>
      </div>

      {built && !empty && (
        <div ref={sheetRef} tabIndex={-1} className="advocacy-sheet-wrap mt-16 scroll-mt-24">
          <div className="no-print mb-[34px] flex flex-wrap items-center justify-between gap-4 rounded-[20px] border-2 border-accent bg-panel-accent px-6 py-5">
            <p className="font-display text-lg font-extrabold text-navy">
              Your sheet is ready. It prints as two pages: the first is for the school, the second is your script and stays with you.
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-navy px-[22px] py-3 font-label text-[15px] font-bold text-page"
            >
              Print this
            </button>
          </div>

          {/* The sheet itself: everything below prints, nothing above does. */}
          <div className="advocacy-sheet print-sheet rounded-[28px] border-2 border-line bg-surface px-10 pb-9 pt-8">
            <p className="font-label text-[11.5px] font-bold uppercase tracking-[0.2em] text-primary-text">
              From the parents · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="mt-2.5 font-display text-[30px] font-extrabold leading-[1.12] text-navy">
              What we are asking of {school.trim() || 'our school'}
            </h2>

            <h3 className="mt-7 font-label text-xs font-bold uppercase tracking-[0.18em] text-primary-text">
              The requests
            </h3>
            <ol className="mt-3">
              {sheet.asks.map((a, i) => (
                <li key={i} className="grid grid-cols-[30px_minmax(0,1fr)] gap-3 border-t border-line py-3">
                  <span
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-panel-accent font-label text-[13.5px] font-bold text-navy"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <p className="text-[1.02rem] leading-[1.55] text-ink">{a}</p>
                </li>
              ))}
            </ol>

            <h3 className="mt-6 font-label text-xs font-bold uppercase tracking-[0.18em] text-primary-text">
              Why we are asking
            </h3>
            <ul className="mt-3 grid gap-2.5">
              {sheet.evidence.map((e, i) => (
                <li key={i} className="border-l-4 border-accent pl-4 text-[0.98rem] leading-[1.55] text-ink">
                  {e.text}{' '}
                  <span className="text-ink-soft">
                    ({shortCite(e.source.authors)}, {e.source.year})
                  </span>
                </li>
              ))}
            </ul>

            <div className="sheet-sources mt-7 border-t border-line pt-4 text-[0.82rem] leading-[1.55] text-ink-soft">
              <p className="font-semibold text-ink">Sources</p>
              {sheet.evidence.map((e, i) => (
                <p key={i}>
                  {e.source.authors}, &ldquo;{e.source.title}&rdquo;, {e.source.venue}, {e.source.year}. {e.source.url}
                </p>
              ))}
              <p className="mt-2">
                Prepared with the advocacy builder at offlinechildhood.com/advocate. Nothing entered
                there is collected or sent anywhere.
              </p>
            </div>
          </div>

          {/* The coaching prints on its own page, so the sheet the school
              reads never carries the tip for writing it. */}
          <div className="script-page print-sheet mt-8 rounded-[28px] border-2 border-accent bg-panel-accent px-10 pb-8 pt-7">
            <p className="font-label text-[11.5px] font-bold uppercase tracking-[0.2em] text-accent-text">
              For you &middot; the school gets the first page only
            </p>
            <h3 className="mt-2.5 font-label text-xs font-bold uppercase tracking-[0.18em] text-primary-text">
              {sheet.scriptHeading}
            </h3>
            <p className="sheet-script mt-3 text-[0.98rem] leading-[1.6] text-ink">{sheet.script}</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useMemo, useRef, useState } from 'react';
import {
  bandForAge,
  conceptsForChild,
  decisionsForChild,
  householdRules,
  stanceFor,
  type Child,
  type PlanConcept,
  type PlanDecision,
  type StanceId,
} from '../lib/plan';

interface Props {
  decisions: PlanDecision[];
  concepts: PlanConcept[];
}

const DEVICE_OPTIONS = [
  { id: 'tablet', label: 'A tablet a child uses' },
  { id: 'phone', label: 'A phone a child owns' },
  { id: 'console', label: 'A games console' },
  { id: 'bedroom', label: 'A screen in a bedroom' },
  { id: 'tv', label: 'A TV in a shared room' },
  { id: 'none', label: 'None of these yet' },
];

const WORRY_OPTIONS = [
  { id: 'sleep', label: 'Sleep' },
  { id: 'attention', label: 'Attention and focus' },
  { id: 'social', label: 'Social pressure from other kids' },
  { id: 'content', label: 'What they might see' },
  { id: 'ai', label: 'AI and what is real' },
  { id: 'time', label: 'It is crowding out everything else' },
];

const STANCE_OPTIONS: { id: StanceId; label: string; blurb: string }[] = [
  { id: 'start', label: 'Start here', blurb: 'Something I can hold from this week, without a fight.' },
  { id: 'further', label: 'Going further', blurb: 'I have some room to organise and I want to change the norm.' },
  { id: 'allin', label: 'All the way', blurb: 'I am ready to be the unusual family and absorb the cost early.' },
];

let counter = 0;
const newChild = (): Child => ({ key: `c${++counter}`, name: '', age: null });

export default function PlanBuilder({ decisions, concepts }: Props) {
  const [children, setChildren] = useState<Child[]>([newChild()]);
  const [devices, setDevices] = useState<string[]>([]);
  const [worries, setWorries] = useState<string[]>([]);
  const [wanted, setWanted] = useState<StanceId>('start');
  const [built, setBuilt] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  const toggle = (list: string[], set: (v: string[]) => void, id: string) => {
    if (id === 'none') {
      set(list.includes('none') ? [] : ['none']);
      return;
    }
    const next = list.filter((x) => x !== 'none');
    set(next.includes(id) ? next.filter((x) => x !== id) : [...next, id]);
  };

  const validChildren = useMemo(
    () => children.filter((c) => c.age !== null && c.age >= 0 && c.age <= 18),
    [children],
  );

  const rules = useMemo(
    () =>
      householdRules({
        hasBedroomDevices: devices.includes('bedroom'),
        wanted,
        anyUnder13: validChildren.some((c) => (c.age ?? 0) < 13),
      }),
    [devices, wanted, validChildren],
  );

  const build = () => {
    setBuilt(true);
    requestAnimationFrame(() => {
      planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      planRef.current?.focus();
    });
  };

  const label = (c: Child, i: number) => c.name.trim() || `Child ${i + 1}`;

  return (
    <div>
      {/* ---------------- questions ---------------- */}
      <div className="no-print grid gap-8">
        <fieldset className="rounded-3xl border-2 border-line bg-surface-2 p-6 sm:p-7">
          <legend className="px-2 font-display text-lg font-extrabold">Who is this for?</legend>
          <p className="mt-1 text-ink-soft">
            Ages only. Names are optional and never leave your browser.
          </p>

          <div className="mt-5 grid gap-3">
            {children.map((c, i) => (
              <div key={c.key} className="flex flex-wrap items-end gap-3">
                <label className="flex-1 min-w-[10rem]">
                  <span className="block text-sm font-semibold">Name (optional)</span>
                  <input
                    type="text"
                    value={c.name}
                    placeholder={`Child ${i + 1}`}
                    onChange={(e) =>
                      setChildren((prev) =>
                        prev.map((x) => (x.key === c.key ? { ...x, name: e.target.value } : x)),
                      )
                    }
                    className="mt-1 w-full rounded-xl border-2 border-line bg-surface px-3.5 py-2.5"
                  />
                </label>
                <label className="w-28">
                  <span className="block text-sm font-semibold">Age</span>
                  <input
                    type="number"
                    min={0}
                    max={18}
                    value={c.age ?? ''}
                    onChange={(e) =>
                      setChildren((prev) =>
                        prev.map((x) =>
                          x.key === c.key
                            ? { ...x, age: e.target.value === '' ? null : Number(e.target.value) }
                            : x,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded-xl border-2 border-line bg-surface px-3.5 py-2.5"
                  />
                </label>
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setChildren((prev) => prev.filter((x) => x.key !== c.key))}
                    className="rounded-xl border-2 border-line px-3.5 py-2.5 font-semibold text-ink-soft hover:border-coral hover:text-coral"
                  >
                    Remove<span className="sr-only"> {label(c, i)}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setChildren((prev) => [...prev, newChild()])}
            className="mt-4 rounded-full border-2 border-line px-4 py-2 font-display font-bold hover:border-ink"
          >
            Add another child
          </button>
        </fieldset>

        <fieldset className="rounded-3xl border-2 border-line bg-surface-2 p-6 sm:p-7">
          <legend className="px-2 font-display text-lg font-extrabold">What is in the house now?</legend>
          <p className="mt-1 text-ink-soft">Be honest. The plan is more useful if it starts where you are.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {DEVICE_OPTIONS.map((o) => {
              const on = devices.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(devices, setDevices, o.id)}
                  className={`rounded-full border-2 px-4 py-2 font-semibold transition ${
                    on ? 'border-primary bg-primary text-on-primary' : 'border-line hover:border-ink'
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border-2 border-line bg-surface-2 p-6 sm:p-7">
          <legend className="px-2 font-display text-lg font-extrabold">What worries you most?</legend>
          <p className="mt-1 text-ink-soft">Pick as many as apply. This orders your plan.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {WORRY_OPTIONS.map((o) => {
              const on = worries.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(worries, setWorries, o.id)}
                  className={`rounded-full border-2 px-4 py-2 font-semibold transition ${
                    on ? 'border-secondary bg-secondary text-on-secondary' : 'border-line hover:border-ink'
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border-2 border-line bg-surface-2 p-6 sm:p-7">
          <legend className="px-2 font-display text-lg font-extrabold">How far do you want to go?</legend>
          <p className="mt-1 text-ink-soft">
            There is no wrong answer. A rule you keep beats a rule you announce.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {STANCE_OPTIONS.map((o) => {
              const on = wanted === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setWanted(o.id)}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    on ? 'border-primary bg-primary/10' : 'border-line hover:border-ink'
                  }`}
                >
                  <span className="block font-display text-lg font-extrabold">{o.label}</span>
                  <span className="mt-1.5 block text-[0.95rem] text-ink-soft">{o.blurb}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <button
            type="button"
            onClick={build}
            disabled={validChildren.length === 0}
            className="rounded-full bg-primary px-8 py-4 font-display text-lg font-bold text-on-primary transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
          >
            {built ? 'Update my plan' : 'Build my plan'}
          </button>
          {validChildren.length === 0 && (
            <p className="mt-3 text-ink-soft">Add at least one age to build a plan.</p>
          )}
        </div>
      </div>

      {/* ---------------- the plan ---------------- */}
      {built && validChildren.length > 0 && (
        <div ref={planRef} tabIndex={-1} className="mt-16 scroll-mt-24">
          <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-accent bg-accent/12 p-5">
            <p className="font-display font-extrabold">Your plan is ready. Print it and put it somewhere visible.</p>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-ink px-5 py-2.5 font-display font-bold text-surface"
            >
              Print this
            </button>
          </div>

          <h2 className="font-display text-3xl font-extrabold">Your family plan</h2>

          <section className="mt-10">
            <h3 className="font-display text-2xl font-extrabold">House rules</h3>
            <p className="mt-2 text-ink-soft">
              These apply to everybody and do more work than any single device decision.
            </p>
            <ol className="mt-5 grid gap-3">
              {rules.map((r, i) => (
                <li key={i} className="rounded-2xl border-2 border-line bg-surface-2 p-5">
                  <p className="font-display text-lg font-extrabold">{r.rule}</p>
                  <p className="mt-2 text-ink-soft">{r.why}</p>
                </li>
              ))}
            </ol>
          </section>

          {validChildren.map((c, i) => {
            const age = c.age as number;
            const band = bandForAge(age);
            const ds = decisionsForChild(age, decisions);
            const cs = conceptsForChild(age, concepts);
            return (
              <section key={c.key} className="mt-14 print-break">
                <h3 className="font-display text-2xl font-extrabold">
                  {label(c, i)}, age {age}
                </h3>
                <p className="mt-1 text-ink-soft">Explanations below are written for ages {band}.</p>

                {ds.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-primary-text">
                      Decisions that apply now
                    </h4>
                    <ul className="mt-3 grid gap-3">
                      {ds.map((d) => {
                        const s = stanceFor(d, wanted);
                        return (
                          <li key={d.id} className="rounded-2xl border-2 border-line bg-surface-2 p-5">
                            <p className="font-display text-lg font-extrabold">{d.question}</p>
                            <p className="mt-2">{d.shortAnswer}</p>
                            {s && (
                              <p className="mt-3 rounded-xl bg-surface p-4">
                                <span className="font-display font-extrabold">{s.label}. </span>
                                {s.summary}
                              </p>
                            )}
                            <a
                              href={`/decisions/${d.id}`}
                              className="mt-3 inline-block font-semibold text-primary-text underline underline-offset-4"
                            >
                              Read the full answer
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {cs.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-secondary-deep">
                      Conversations to have
                    </h4>
                    <ul className="mt-3 grid gap-3">
                      {cs.map(({ concept, band: b }) => (
                        <li key={concept.id} className="rounded-2xl border-2 border-line bg-surface-2 p-5">
                          <p className="font-display text-lg font-extrabold">{concept.title}</p>
                          <p className="mt-1 text-ink-soft">{concept.idea}</p>
                          <p className="mt-3 rounded-xl bg-surface p-4">{b.explain}</p>
                          <p className="mt-2 rounded-xl bg-surface p-4">
                            <span className="font-display font-extrabold">Try this. </span>
                            {b.tryThis}
                          </p>
                          <a
                            href={`/conversations/${concept.id}`}
                            className="mt-3 inline-block font-semibold text-primary-text underline underline-offset-4"
                          >
                            Read the whole thing
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {ds.length === 0 && cs.length === 0 && (
                  <p className="mt-4 rounded-2xl border-2 border-line bg-surface-2 p-5 text-ink-soft">
                    Nothing on the site is written for this age yet. The house rules above still apply.
                  </p>
                )}
              </section>
            );
          })}

          <p className="mt-14 border-t border-line pt-6 text-sm text-ink-soft">
            Built at offlinechildhood.com. Nothing you entered was sent anywhere.
          </p>
        </div>
      )}
    </div>
  );
}

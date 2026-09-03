import { useEffect, useMemo, useRef, useState } from 'react';
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
  { id: 'school-laptop', label: 'A laptop or tablet from school' },
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
  { id: 'further', label: 'Going further', blurb: 'I have some room to organize and I want to change the norm.' },
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
        hasSchoolDevice: devices.includes('school-laptop'),
        wanted,
        anyUnder13: validChildren.some((c) => (c.age ?? 0) < 13),
      }),
    [devices, wanted, validChildren],
  );

  useEffect(() => {
    const openAll = () => {
      document.querySelectorAll<HTMLDetailsElement>('details.plan-full').forEach((d) => {
        d.open = true;
      });
    };
    window.addEventListener('beforeprint', openAll);
    return () => window.removeEventListener('beforeprint', openAll);
  }, []);

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
        <section aria-labeledby="q-kids" className="rounded-[26px] border-2 border-line bg-surface px-[30px] pb-[30px] pt-7">
          <h2 id="q-kids" className="font-display text-[23px] font-extrabold text-navy">Who is this for?</h2>
          <p className="mt-1.5 text-[1.03rem] text-ink-soft">
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
                    className="mt-1.5 w-full rounded-[14px] border-2 border-panel-blue-line bg-panel-blue px-3.5 py-[11px] text-ink"
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
                    className="mt-1.5 w-full rounded-[14px] border-2 border-panel-blue-line bg-panel-blue px-3.5 py-[11px] text-ink"
                  />
                </label>
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setChildren((prev) => prev.filter((x) => x.key !== c.key))}
                    className="rounded-[14px] border-2 border-line px-4 py-[11px] font-medium text-ink-soft transition hover:border-coral hover:text-coral"
                  >
                    Remove<span className="sr-only"> {label(c, i)}</span>
                  </button>
                )}

                <p
                  className={`flex w-full items-center gap-1.5 text-sm ${
                    c.age === null ? 'text-ink-soft' : 'text-green-deep'
                  }`}
                >
                  {c.age === null ? (
                    'Enter an age to include this child.'
                  ) : (
                    <>
                      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none"
                        stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"
                        strokeLinejoin="round" aria-hidden="true">
                        <path d="m4 10.5 4 4 8-9" />
                      </svg>
                      Added. {label(c, i)} is in your plan.
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setChildren((prev) => [...prev, newChild()])}
            className="mt-5 rounded-full border-2 border-line px-5 py-2.5 font-label text-[14.5px] font-bold text-navy transition hover:border-navy"
          >
            Add another child
          </button>
        </section>

        <section aria-labeledby="q-devices" className="rounded-[26px] border-2 border-line bg-surface px-[30px] pb-[30px] pt-7">
          <h2 id="q-devices" className="font-display text-[23px] font-extrabold text-navy">What is in the house now?</h2>
          <p className="mt-1.5 text-[1.03rem] text-ink-soft">Be honest. The plan is more useful if it starts where you are.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {DEVICE_OPTIONS.map((o) => {
              const on = devices.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(devices, setDevices, o.id)}
                  className={`rounded-full border-2 px-4 py-2 font-medium transition ${
                    on ? 'border-primary bg-primary font-semibold text-on-navy-bright' : 'border-line text-ink hover:border-navy'
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labeledby="q-worries" className="rounded-[26px] border-2 border-line bg-surface px-[30px] pb-[30px] pt-7">
          <h2 id="q-worries" className="font-display text-[23px] font-extrabold text-navy">What worries you most?</h2>
          <p className="mt-1.5 text-[1.03rem] text-ink-soft">Pick as many as apply. This orders your plan.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {WORRY_OPTIONS.map((o) => {
              const on = worries.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(worries, setWorries, o.id)}
                  className={`rounded-full border-2 px-4 py-2 font-medium transition ${
                    on ? 'border-primary bg-primary font-semibold text-on-navy-bright' : 'border-line text-ink hover:border-navy'
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labeledby="q-stance" className="rounded-[26px] border-2 border-line bg-surface px-[30px] pb-[30px] pt-7">
          <h2 id="q-stance" className="font-display text-[23px] font-extrabold text-navy">How far do you want to go?</h2>
          <p className="mt-1.5 text-[1.03rem] text-ink-soft">
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
                  className={`rounded-[20px] border-2 p-5 text-left transition ${
                    on ? 'border-primary bg-panel-blue' : 'border-line hover:border-navy'
                  }`}
                >
                  <span className="block font-display text-[19px] font-extrabold text-navy">{o.label}</span>
                  <span className="mt-1.5 block text-[0.95rem] text-ink-soft">{o.blurb}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div>
          <button
            type="button"
            onClick={build}
            disabled={validChildren.length === 0}
            className="rounded-full bg-primary px-[34px] py-[17px] font-label text-lg font-bold text-on-navy-bright transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
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
          <div className="no-print mb-[34px] flex flex-wrap items-center justify-between gap-4 rounded-[20px] border-2 border-accent bg-panel-accent px-6 py-5">
            <p className="font-display text-lg font-extrabold text-navy">Your plan is ready. Print it and put it somewhere visible.</p>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-navy px-[22px] py-3 font-label text-[15px] font-bold text-page"
            >
              Print this
            </button>
          </div>

          <h2 className="font-display text-[38px] font-extrabold leading-[1.08] text-navy">Your family plan</h2>

          <section className="mt-10">
            <h3 className="font-display text-[28px] font-extrabold text-navy">House rules</h3>
            <p className="mt-2 text-ink-soft">
              These apply to everybody and do more work than any single device decision.
            </p>
            <ol className="mt-5">
              {rules.map((r, i) => (
                <li key={i} className="grid grid-cols-[38px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-panel-accent font-label text-[15px] font-bold text-navy"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="mb-2 font-display text-[19px] font-extrabold leading-[1.34] text-navy">{r.rule}</p>
                    <p className="text-[1.03rem] leading-[1.64] text-ink-soft">{r.why}</p>
                  </div>
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
                <h3 className="font-display text-[28px] font-extrabold text-navy">
                  {label(c, i)}, age {age}
                </h3>
                <p className="mt-1 text-ink-soft">Explanations below are written for ages {band}.</p>

                {ds.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-primary-text">
                      Decisions that apply now
                    </h4>
                    <ul className="mt-3 grid gap-3">
                      {ds.map((d) => {
                        const s = stanceFor(d, wanted);
                        return (
                          <li key={d.id} className="rounded-[22px] border-[1.5px] border-line bg-surface px-[26px] py-6">
                            <p className="font-display text-xl font-extrabold leading-[1.28] text-navy">{d.question}</p>
                            <p className="mt-2.5 leading-[1.64]">{d.shortAnswer}</p>
                            {s && (
                              <p className="mt-4 rounded-2xl bg-panel-blue px-[18px] py-4 leading-relaxed">
                                <span className="font-display font-extrabold">{s.label}. </span>
                                {s.summary}
                              </p>
                            )}
                            <details className="plan-full mt-4 rounded-2xl border border-line bg-page/60">
                              <summary className="no-print cursor-pointer list-none px-[18px] py-3 font-semibold text-primary-text">
                                The full answer, right here
                                <span aria-hidden="true" className="ml-1.5 text-ink-soft">&#9662;</span>
                              </summary>
                              <div
                                className="prose prose-compact px-[18px] pb-4"
                                dangerouslySetInnerHTML={{ __html: d.bodyHtml }}
                              />
                            </details>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {cs.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-accent-text">
                      Conversations to have
                    </h4>
                    <ul className="mt-3 grid gap-3">
                      {cs.map(({ concept, band: b }) => (
                        <li key={concept.id} className="rounded-[22px] border-[1.5px] border-line bg-surface px-[26px] py-6">
                          <p className="font-display text-xl font-extrabold leading-[1.28] text-navy">{concept.title}</p>
                          <p className="mt-1.5 text-ink-soft">{concept.idea}</p>
                          <p className="mt-4 rounded-2xl bg-panel-accent px-[18px] py-4 leading-[1.62]">{b.explain}</p>
                          <p className="mt-3 rounded-2xl bg-panel-accent px-[18px] py-4 leading-[1.62]">
                            <span className="font-display font-extrabold">Try this. </span>
                            {b.tryThis}
                          </p>
                          <p className="mt-3 rounded-2xl bg-panel-accent px-[18px] py-4 leading-[1.62]">
                            <span className="font-display font-extrabold">Listen for. </span>
                            {b.listenFor}
                          </p>
                          <details className="plan-full mt-4 rounded-2xl border border-line bg-page/60">
                            <summary className="no-print cursor-pointer list-none px-[18px] py-3 font-semibold text-primary-text">
                              The whole conversation, right here
                              <span aria-hidden="true" className="ml-1.5 text-ink-soft">&#9662;</span>
                            </summary>
                            <div
                              className="prose prose-compact px-[18px] pb-4"
                              dangerouslySetInnerHTML={{ __html: concept.bodyHtml }}
                            />
                          </details>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {ds.length === 0 && cs.length === 0 && (
                  <p className="mt-4 rounded-[22px] border-[1.5px] border-line bg-surface px-[26px] py-6 text-ink-soft">
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

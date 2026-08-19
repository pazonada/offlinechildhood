/** Shared types and pure logic for the family plan builder. */

export type AgeBand = '4-6' | '7-9' | '10-12' | '13+';
export type StanceId = 'start' | 'further' | 'allin';

export interface PlanStance {
  id: StanceId;
  label: string;
  summary: string;
  forFamiliesWho: string;
}

export interface PlanDecision {
  id: string;
  title: string;
  question: string;
  shortAnswer: string;
  appliesToBands: AgeBand[];
  stances: PlanStance[];
}

export interface PlanConceptBand {
  band: AgeBand;
  explain: string;
  tryThis: string;
}

export interface PlanConcept {
  id: string;
  title: string;
  idea: string;
  strand: string;
  bands: PlanConceptBand[];
}

export interface Child {
  /** Stable key for React lists. */
  key: string;
  name: string;
  age: number | null;
}

/**
 * Ages map to bands by the boundaries the curriculum was written against.
 * Under 4 falls into the youngest band: the explanations still work, and a
 * parent of a three-year-old should not be told there is nothing for them.
 */
export function bandForAge(age: number): AgeBand {
  if (age <= 6) return '4-6';
  if (age <= 9) return '7-9';
  if (age <= 12) return '10-12';
  return '13+';
}

export function decisionsForChild(age: number, decisions: PlanDecision[]): PlanDecision[] {
  const band = bandForAge(age);
  return decisions.filter((d) => d.appliesToBands.includes(band));
}

export function conceptsForChild(age: number, concepts: PlanConcept[]) {
  const band = bandForAge(age);
  return concepts
    .map((c) => ({ concept: c, band: c.bands.find((b) => b.band === band) }))
    .filter((x): x is { concept: PlanConcept; band: PlanConceptBand } => Boolean(x.band));
}

export function stanceFor(decision: PlanDecision, wanted: StanceId): PlanStance | undefined {
  return decision.stances.find((s) => s.id === wanted) ?? decision.stances[0];
}

/**
 * Household rules are the part of a plan that does not depend on any one child,
 * and in practice they do more work than any device decision. Ordered by how
 * much difference they make relative to how hard they are to hold.
 */
export function householdRules(opts: {
  hasBedroomDevices: boolean;
  wanted: StanceId;
  anyUnder13: boolean;
}): { rule: string; why: string }[] {
  const rules: { rule: string; why: string }[] = [
    {
      rule: 'Every device charges overnight in a shared room, adults included.',
      why: 'The clearest finding in this whole field is that the screens which cost children sleep are the portable ones that follow them to bed. A rule that applies to one person in the house gets argued about every night.',
    },
    {
      rule: 'Screens stay in shared rooms. Bedrooms stay screen-free.',
      why: 'It keeps use social and visible without anyone having to monitor anything, which is a better foundation than surveillance.',
    },
  ];

  if (opts.hasBedroomDevices) {
    rules.push({
      rule: 'Move the device that is currently in a bedroom this week.',
      why: 'This is the single highest-value change available to you right now, and it costs nothing.',
    });
  }

  rules.push({
    rule: 'One evening a week with nothing on, for everybody.',
    why: 'It sets a floor that does not depend on negotiating each individual request, and it is far easier to defend than a daily time limit.',
  });

  if (opts.wanted !== 'start') {
    rules.push({
      rule: 'Say the plan out loud before you need it.',
      why: '"You will get a phone, and not this year" is a different conversation from an argument that begins at the moment of refusal.',
    });
  }

  if (opts.anyUnder13) {
    rules.push({
      rule: 'Find two other families who will hold the same line.',
      why: 'The isolation argument is the strongest one your kid has, and it collapses as soon as a few families agree. This is the one step that changes the odds rather than the rules.',
    });
  }

  return rules;
}

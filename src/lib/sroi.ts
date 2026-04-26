import type { TranslationKey } from "./i18n";

export type QuestionType = "currency" | "percent" | "slider10" | "tier";

export interface TierOption {
  /** Translation key for this option's display label. */
  labelKey: TranslationKey;
  /** Score (0–100) awarded when this option is selected. */
  score: number;
}

export interface Question {
  id: string;
  pillar: "financial" | "social" | "planet" | "progress";
  labelKey: TranslationKey;
  helperKey: TranslationKey;
  type: QuestionType;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** For tier questions only — radio options. */
  options?: TierOption[];
  /** Default UI value (raw input, not score). */
  defaultValue: number;
  /** Map raw input value → 0..100 score. */
  score: (value: number) => number;
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

/* ------------------------------------------------------------------ */
/* Question definitions — ordered by category, Capital first.          */
/* ------------------------------------------------------------------ */

export const questions: Question[] = [
  // FINANCIAL
  {
    id: "capital",
    pillar: "financial",
    labelKey: "sroi.q.capital.label",
    helperKey: "sroi.q.capital.helper",
    type: "currency",
    min: 0,
    step: 1000,
    defaultValue: 250_000,
    // Capital is the multiplier — does NOT contribute to the impact score.
    score: () => 0,
  },
  {
    id: "roi",
    pillar: "financial",
    labelKey: "sroi.q.roi.label",
    helperKey: "sroi.q.roi.helper",
    type: "percent",
    min: 0,
    max: 200,
    step: 1,
    unit: "%",
    defaultValue: 100,
    // 0% (total loss) → 0 score; 200%+ (home run) → 100 score. Linear.
    score: (v) => clamp((v / 200) * 100),
  },
  // SOCIAL
  {
    id: "jobs",
    pillar: "social",
    labelKey: "sroi.q.jobs.label",
    helperKey: "sroi.q.jobs.helper",
    type: "tier",
    defaultValue: 2,
    options: [
      { labelKey: "sroi.q.jobs.opt.0", score: 0 },
      { labelKey: "sroi.q.jobs.opt.1", score: 25 },
      { labelKey: "sroi.q.jobs.opt.2", score: 50 },
      { labelKey: "sroi.q.jobs.opt.3", score: 75 },
      { labelKey: "sroi.q.jobs.opt.4", score: 100 },
    ],
    score: (i) => [0, 25, 50, 75, 100][clamp(i, 0, 4)] ?? 0,
  },
  {
    id: "wage",
    pillar: "social",
    labelKey: "sroi.q.wage.label",
    helperKey: "sroi.q.wage.helper",
    type: "percent",
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
    defaultValue: 60,
    score: (v) => clamp(v),
  },
  {
    id: "upskill",
    pillar: "social",
    labelKey: "sroi.q.upskill.label",
    helperKey: "sroi.q.upskill.helper",
    type: "tier",
    defaultValue: 1,
    options: [
      { labelKey: "sroi.q.upskill.opt.0", score: 0 },
      { labelKey: "sroi.q.upskill.opt.1", score: 35 },
      { labelKey: "sroi.q.upskill.opt.2", score: 70 },
      { labelKey: "sroi.q.upskill.opt.3", score: 100 },
    ],
    score: (i) => [0, 35, 70, 100][clamp(i, 0, 3)] ?? 0,
  },
  // PLANET
  {
    id: "carbon",
    pillar: "planet",
    labelKey: "sroi.q.carbon.label",
    helperKey: "sroi.q.carbon.helper",
    type: "slider10",
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 5,
    score: (v) => clamp(v * 10),
  },
  {
    id: "circular",
    pillar: "planet",
    labelKey: "sroi.q.circular.label",
    helperKey: "sroi.q.circular.helper",
    type: "slider10",
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 5,
    score: (v) => clamp(v * 10),
  },
  {
    id: "supply",
    pillar: "planet",
    labelKey: "sroi.q.supply.label",
    helperKey: "sroi.q.supply.helper",
    type: "percent",
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
    defaultValue: 50,
    score: (v) => clamp(v),
  },
  // PROGRESS
  {
    id: "ownership",
    pillar: "progress",
    labelKey: "sroi.q.ownership.label",
    helperKey: "sroi.q.ownership.helper",
    type: "tier",
    defaultValue: 1,
    options: [
      { labelKey: "sroi.q.ownership.opt.0", score: 0 },
      { labelKey: "sroi.q.ownership.opt.1", score: 30 },
      { labelKey: "sroi.q.ownership.opt.2", score: 65 },
      { labelKey: "sroi.q.ownership.opt.3", score: 100 },
    ],
    score: (i) => [0, 30, 65, 100][clamp(i, 0, 3)] ?? 0,
  },
  {
    id: "innovation",
    pillar: "progress",
    labelKey: "sroi.q.innovation.label",
    helperKey: "sroi.q.innovation.helper",
    type: "slider10",
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 5,
    score: (v) => clamp(v * 10),
  },
  {
    id: "transparency",
    pillar: "progress",
    labelKey: "sroi.q.transparency.label",
    helperKey: "sroi.q.transparency.helper",
    type: "tier",
    defaultValue: 1,
    options: [
      { labelKey: "sroi.q.transparency.opt.0", score: 0 },
      { labelKey: "sroi.q.transparency.opt.1", score: 25 },
      { labelKey: "sroi.q.transparency.opt.2", score: 50 },
      { labelKey: "sroi.q.transparency.opt.3", score: 75 },
      { labelKey: "sroi.q.transparency.opt.4", score: 100 },
    ],
    score: (i) => [0, 25, 50, 75, 100][clamp(i, 0, 4)] ?? 0,
  },
];

export const pillarWeights = { financial: 1, social: 1, planet: 1, progress: 1 } as const;

export const pillarLabelKeys: Record<keyof typeof pillarWeights, TranslationKey> = {
  financial: "sroi.pillar.financial",
  social: "sroi.pillar.social",
  planet: "sroi.pillar.planet",
  progress: "sroi.pillar.progress",
};

export type ImpactBand = "transformative" | "leader" | "creating" | "aware" | "loss";

export interface SroiResult {
  /** Average score per category (0–100). */
  pillarScores: Record<keyof typeof pillarWeights, number>;
  /** Average of all scoring questions (0–100). */
  rawTotal: number;
  /** Impact score 0–5 = average / 20. */
  impactScore: number;
  /** SROI percentage (-50% .. +75%). */
  sroiPercent: number;
  capital: number;
  totalReturn: number;
  tier: { labelKey: TranslationKey; descriptionKey: TranslationKey; band: ImpactBand };
}

function tierFor(score: number): SroiResult["tier"] {
  if (score >= 4.5) return { labelKey: "sroi.tier.transformative.label", descriptionKey: "sroi.tier.transformative.desc", band: "transformative" };
  if (score >= 3.5) return { labelKey: "sroi.tier.leader.label", descriptionKey: "sroi.tier.leader.desc", band: "leader" };
  if (score >= 2.5) return { labelKey: "sroi.tier.creating.label", descriptionKey: "sroi.tier.creating.desc", band: "creating" };
  if (score >= 1.5) return { labelKey: "sroi.tier.aware.label", descriptionKey: "sroi.tier.aware.desc", band: "aware" };
  return { labelKey: "sroi.tier.loss.label", descriptionKey: "sroi.tier.loss.desc", band: "loss" };
}

export function calculateSroi(answers: Record<string, number>): SroiResult {
  const byPillar: Record<keyof typeof pillarWeights, number[]> = {
    financial: [], social: [], planet: [], progress: [],
  };
  const scoring: number[] = [];
  for (const q of questions) {
    if (q.id === "capital") continue; // multiplier only
    const raw = answers[q.id] ?? q.defaultValue;
    const s = q.score(raw);
    byPillar[q.pillar].push(s);
    scoring.push(s);
  }
  const pillarScores = {
    financial: avg(byPillar.financial),
    social: avg(byPillar.social),
    planet: avg(byPillar.planet),
    progress: avg(byPillar.progress),
  };
  const rawTotal = avg(scoring); // 0..100
  const impactScore = Math.min(5, rawTotal / 20); // 0..5
  // 0 → -50, 1 → -25, 2 → 0, 3 → 25, 4 → 50, 5 → 75
  const sroiPercent = -50 + impactScore * 25;
  const capital = Math.max(answers.capital ?? 0, 1);
  const totalReturn = (sroiPercent / 100) * capital;
  return { pillarScores, rawTotal, impactScore, sroiPercent, capital, totalReturn, tier: tierFor(impactScore) };
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Currency-agnostic amount formatter. The user enters their amount in whichever
 * currency they like — we just return a clean numeric string with K/M/B suffixes.
 */
export function formatCurrency(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${Math.round(abs).toLocaleString()}`;
}

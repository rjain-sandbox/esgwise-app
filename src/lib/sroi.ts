import type { TranslationKey } from "./i18n";

export type QuestionType = "currency" | "percent" | "number" | "slider" | "binary" | "scale";

export interface Question {
  id: string;
  pillar: "financial" | "social" | "environmental" | "innovation";
  labelKey: TranslationKey;
  helperKey: TranslationKey;
  type: QuestionType;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  score: (value: number) => number;
}

const clamp = (n: number, min = 0, max = 10) => Math.max(min, Math.min(max, n));

export const questions: Question[] = [
  { id: "capital", pillar: "financial", labelKey: "sroi.q.capital.label", helperKey: "sroi.q.capital.helper", type: "currency", min: 0, step: 1000, unit: "$", score: (v) => clamp(v <= 0 ? 0 : Math.log10(v) - 2) },
  { id: "roi", pillar: "financial", labelKey: "sroi.q.roi.label", helperKey: "sroi.q.roi.helper", type: "percent", min: 0, max: 50, step: 0.5, unit: "%", score: (v) => clamp(v / 3) },
  { id: "jobs", pillar: "social", labelKey: "sroi.q.jobs.label", helperKey: "sroi.q.jobs.helper", type: "number", min: 0, step: 1, score: (v) => clamp(Math.log10(v + 1) * 3.3) },
  { id: "wage", pillar: "social", labelKey: "sroi.q.wage.label", helperKey: "sroi.q.wage.helper", type: "percent", min: 0, max: 100, step: 1, unit: "%", score: (v) => clamp(v / 10) },
  { id: "upskill", pillar: "social", labelKey: "sroi.q.upskill.label", helperKey: "sroi.q.upskill.helper", type: "scale", min: 0, max: 10, step: 1, score: (v) => clamp(v) },
  { id: "carbon", pillar: "environmental", labelKey: "sroi.q.carbon.label", helperKey: "sroi.q.carbon.helper", type: "scale", min: 0, max: 10, step: 1, score: (v) => clamp(v) },
  { id: "circular", pillar: "environmental", labelKey: "sroi.q.circular.label", helperKey: "sroi.q.circular.helper", type: "scale", min: 0, max: 10, step: 1, score: (v) => clamp(v) },
  { id: "ownership", pillar: "innovation", labelKey: "sroi.q.ownership.label", helperKey: "sroi.q.ownership.helper", type: "scale", min: 0, max: 10, step: 1, score: (v) => clamp(v) },
  { id: "innovation", pillar: "innovation", labelKey: "sroi.q.innovation.label", helperKey: "sroi.q.innovation.helper", type: "scale", min: 0, max: 10, step: 1, score: (v) => clamp(v) },
  { id: "transparency", pillar: "innovation", labelKey: "sroi.q.transparency.label", helperKey: "sroi.q.transparency.helper", type: "scale", min: 0, max: 10, step: 1, score: (v) => clamp(v) },
];

export const pillarWeights = { social: 0.4, financial: 0.2, environmental: 0.2, innovation: 0.2 } as const;

export const pillarLabelKeys: Record<keyof typeof pillarWeights, TranslationKey> = {
  social: "sroi.pillar.social",
  financial: "sroi.pillar.financial",
  environmental: "sroi.pillar.environmental",
  innovation: "sroi.pillar.innovation",
};

export type ImpactBand = "transformative" | "leader" | "creating" | "aware" | "loss";

export interface SroiResult {
  pillarScores: Record<keyof typeof pillarWeights, number>;
  rawTotal: number;
  impactScore: number;
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
  const byPillar: Record<keyof typeof pillarWeights, number[]> = { social: [], financial: [], environmental: [], innovation: [] };
  let rawTotal = 0;
  for (const q of questions) {
    const raw = answers[q.id] ?? 0;
    const s = q.score(raw);
    byPillar[q.pillar].push(s);
    rawTotal += s;
  }
  const pillarScores = {
    social: avg(byPillar.social),
    financial: avg(byPillar.financial),
    environmental: avg(byPillar.environmental),
    innovation: avg(byPillar.innovation),
  };
  const impactScore = Math.min(5, rawTotal / 20);
  const sroiPercent = -50 + (impactScore / 5) * 150;
  const capital = Math.max(answers.capital ?? 0, 1);
  const totalReturn = (sroiPercent / 100) * capital;
  return { pillarScores, rawTotal, impactScore, sroiPercent, capital, totalReturn, tier: tierFor(impactScore) };
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function formatCurrency(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

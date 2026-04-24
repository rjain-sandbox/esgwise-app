import type { TranslationKey } from "./i18n";

export type Axis = "money" | "values";

export interface DnaQuestion {
  id: string;
  axis: Axis;
  promptKey: TranslationKey;
  leftKey: TranslationKey;
  rightKey: TranslationKey;
}

export const dnaQuestions: DnaQuestion[] = [
  { id: "growth", axis: "money", promptKey: "dna.q.growth", leftKey: "dna.q.growth.left", rightKey: "dna.q.growth.right" },
  { id: "volatility", axis: "money", promptKey: "dna.q.volatility", leftKey: "dna.q.volatility.left", rightKey: "dna.q.volatility.right" },
  { id: "horizon", axis: "money", promptKey: "dna.q.horizon", leftKey: "dna.q.horizon.left", rightKey: "dna.q.horizon.right" },
  { id: "liquidity", axis: "money", promptKey: "dna.q.liquidity", leftKey: "dna.q.liquidity.left", rightKey: "dna.q.liquidity.right" },
  { id: "income", axis: "money", promptKey: "dna.q.income", leftKey: "dna.q.income.left", rightKey: "dna.q.income.right" },
  { id: "tradeoff", axis: "values", promptKey: "dna.q.tradeoff", leftKey: "dna.q.tradeoff.left", rightKey: "dna.q.tradeoff.right" },
  { id: "exclusion", axis: "values", promptKey: "dna.q.exclusion", leftKey: "dna.q.exclusion.left", rightKey: "dna.q.exclusion.right" },
  { id: "climate", axis: "values", promptKey: "dna.q.climate", leftKey: "dna.q.climate.left", rightKey: "dna.q.climate.right" },
  { id: "fairness", axis: "values", promptKey: "dna.q.fairness", leftKey: "dna.q.fairness.left", rightKey: "dna.q.fairness.right" },
  { id: "themes", axis: "values", promptKey: "dna.q.themes", leftKey: "dna.q.themes.left", rightKey: "dna.q.themes.right" },
];

export type QuadrantId = "guardian" | "builder" | "steward" | "catalyst";

export interface Quadrant {
  id: QuadrantId;
  nameKey: TranslationKey;
  taglineKey: TranslationKey;
  descriptionKey: TranslationKey;
  highMoney: boolean;
  highValues: boolean;
  accent: string;
  bg: string;
}

export const quadrants: Quadrant[] = [
  { id: "guardian", nameKey: "dna.quad.guardian.name", taglineKey: "dna.quad.guardian.tagline", descriptionKey: "dna.quad.guardian.description", highMoney: false, highValues: false, accent: "text-primary", bg: "bg-primary/10" },
  { id: "builder", nameKey: "dna.quad.builder.name", taglineKey: "dna.quad.builder.tagline", descriptionKey: "dna.quad.builder.description", highMoney: true, highValues: false, accent: "text-ochre-text", bg: "bg-ochre/15" },
  { id: "steward", nameKey: "dna.quad.steward.name", taglineKey: "dna.quad.steward.tagline", descriptionKey: "dna.quad.steward.description", highMoney: false, highValues: true, accent: "text-moss-text", bg: "bg-moss/15" },
  { id: "catalyst", nameKey: "dna.quad.catalyst.name", taglineKey: "dna.quad.catalyst.tagline", descriptionKey: "dna.quad.catalyst.description", highMoney: true, highValues: true, accent: "text-clay-text", bg: "bg-clay/15" },
];

export interface DnaResult {
  moneyScore: number;
  valuesScore: number;
  quadrant: Quadrant;
}

export function calculateDna(answers: Record<string, number>): DnaResult {
  const moneyQs = dnaQuestions.filter((q) => q.axis === "money");
  const valuesQs = dnaQuestions.filter((q) => q.axis === "values");
  const avg = (qs: DnaQuestion[]) =>
    qs.reduce((sum, q) => sum + (answers[q.id] ?? 5), 0) / qs.length;
  const moneyScore = avg(moneyQs) * 10;
  const valuesScore = avg(valuesQs) * 10;
  const highMoney = moneyScore >= 50;
  const highValues = valuesScore >= 50;
  const quadrant =
    quadrants.find((q) => q.highMoney === highMoney && q.highValues === highValues) ?? quadrants[0];
  return { moneyScore, valuesScore, quadrant };
}

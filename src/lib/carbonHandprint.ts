import type { TranslationKey } from "./i18n";

export type QuestionType = "scale" | "yesno" | "frequency";

export interface HandprintQuestion {
  id: string;
  type: QuestionType;
  promptKey: TranslationKey;
  helpKey?: TranslationKey;
}

export const handprintQuestions: HandprintQuestion[] = [
  { id: "knowledge", type: "scale", promptKey: "hp.q.knowledge", helpKey: "hp.q.knowledge.help" },
  { id: "ripple", type: "yesno", promptKey: "hp.q.ripple" },
  { id: "secondhand", type: "frequency", promptKey: "hp.q.secondhand" },
  { id: "supplier", type: "yesno", promptKey: "hp.q.supplier" },
  { id: "cleanenergy", type: "yesno", promptKey: "hp.q.cleanenergy" },
  { id: "community", type: "frequency", promptKey: "hp.q.community" },
  { id: "innovation", type: "scale", promptKey: "hp.q.innovation", helpKey: "hp.q.innovation.help" },
  { id: "gifting", type: "frequency", promptKey: "hp.q.gifting" },
  { id: "policy", type: "yesno", promptKey: "hp.q.policy" },
  { id: "solutions", type: "frequency", promptKey: "hp.q.solutions" },
];

export const frequencyOptions = [
  { value: "always", labelKey: "hp.freq.always" as TranslationKey, points: 10 },
  { value: "often", labelKey: "hp.freq.often" as TranslationKey, points: 7 },
  { value: "sometimes", labelKey: "hp.freq.sometimes" as TranslationKey, points: 4 },
  { value: "never", labelKey: "hp.freq.never" as TranslationKey, points: 1 },
] as const;

export type FrequencyValue = (typeof frequencyOptions)[number]["value"];

export interface HandprintLevel {
  score: number;
  nameKey: TranslationKey;
  meaningKey: TranslationKey;
  accent: "moss" | "ochre" | "clay" | "sky";
}

export const handprintLevels: HandprintLevel[] = [
  { score: 10, nameKey: "hp.lvl.10.name", meaningKey: "hp.lvl.10.meaning", accent: "moss" },
  { score: 9, nameKey: "hp.lvl.9.name", meaningKey: "hp.lvl.9.meaning", accent: "moss" },
  { score: 8, nameKey: "hp.lvl.8.name", meaningKey: "hp.lvl.8.meaning", accent: "moss" },
  { score: 7, nameKey: "hp.lvl.7.name", meaningKey: "hp.lvl.7.meaning", accent: "sky" },
  { score: 6, nameKey: "hp.lvl.6.name", meaningKey: "hp.lvl.6.meaning", accent: "sky" },
  { score: 5, nameKey: "hp.lvl.5.name", meaningKey: "hp.lvl.5.meaning", accent: "ochre" },
  { score: 4, nameKey: "hp.lvl.4.name", meaningKey: "hp.lvl.4.meaning", accent: "ochre" },
  { score: 3, nameKey: "hp.lvl.3.name", meaningKey: "hp.lvl.3.meaning", accent: "clay" },
  { score: 2, nameKey: "hp.lvl.2.name", meaningKey: "hp.lvl.2.meaning", accent: "clay" },
  { score: 1, nameKey: "hp.lvl.1.name", meaningKey: "hp.lvl.1.meaning", accent: "clay" },
];

export type HandprintAnswer = number | "yes" | "no" | FrequencyValue | null;

export function scoreAnswer(q: HandprintQuestion, answer: HandprintAnswer): number {
  if (answer === null || answer === undefined) return 0;
  if (q.type === "scale") return typeof answer === "number" ? answer : 0;
  if (q.type === "yesno") return answer === "yes" ? 10 : 1;
  const opt = frequencyOptions.find((o) => o.value === answer);
  return opt?.points ?? 0;
}

export interface HandprintResult {
  rawTotal: number;
  normalized: number;
  level: HandprintLevel;
}

export function calculateHandprint(answers: Record<string, HandprintAnswer>): HandprintResult {
  const rawTotal = handprintQuestions.reduce(
    (sum, q) => sum + scoreAnswer(q, answers[q.id] ?? null),
    0,
  );
  const normalized = Math.max(1, Math.min(10, Math.round(rawTotal / 10)));
  const level = handprintLevels.find((l) => l.score === normalized) ?? handprintLevels[9];
  return { rawTotal, normalized, level };
}

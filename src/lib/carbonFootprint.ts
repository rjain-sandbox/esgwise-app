import type { TranslationKey } from "./i18n";

export interface FootprintQuestion {
  id: string;
  area: string;
  promptKey: TranslationKey;
  lowKey: TranslationKey;
  highKey: TranslationKey;
}

export const footprintAreas = [
  { id: "living", nameKey: "fp.area.living" as TranslationKey, subtitleKey: "fp.area.living.subtitle" as TranslationKey },
  { id: "mobility", nameKey: "fp.area.mobility" as TranslationKey, subtitleKey: "fp.area.mobility.subtitle" as TranslationKey },
  { id: "transport", nameKey: "fp.area.transport" as TranslationKey, subtitleKey: "fp.area.transport.subtitle" as TranslationKey },
  { id: "consumption", nameKey: "fp.area.consumption" as TranslationKey, subtitleKey: "fp.area.consumption.subtitle" as TranslationKey },
] as const;

export const footprintQuestions: FootprintQuestion[] = [
  { id: "heating", area: "living", promptKey: "fp.q.heating.prompt", lowKey: "fp.q.heating.low", highKey: "fp.q.heating.high" },
  { id: "efficiency", area: "living", promptKey: "fp.q.efficiency.prompt", lowKey: "fp.q.efficiency.low", highKey: "fp.q.efficiency.high" },
  { id: "electricity", area: "living", promptKey: "fp.q.electricity.prompt", lowKey: "fp.q.electricity.low", highKey: "fp.q.electricity.high" },
  { id: "commute", area: "mobility", promptKey: "fp.q.commute.prompt", lowKey: "fp.q.commute.low", highKey: "fp.q.commute.high" },
  { id: "ev", area: "mobility", promptKey: "fp.q.ev.prompt", lowKey: "fp.q.ev.low", highKey: "fp.q.ev.high" },
  { id: "transit", area: "mobility", promptKey: "fp.q.transit.prompt", lowKey: "fp.q.transit.low", highKey: "fp.q.transit.high" },
  { id: "flights", area: "transport", promptKey: "fp.q.flights.prompt", lowKey: "fp.q.flights.low", highKey: "fp.q.flights.high" },
  { id: "alttravel", area: "transport", promptKey: "fp.q.alttravel.prompt", lowKey: "fp.q.alttravel.low", highKey: "fp.q.alttravel.high" },
  { id: "freight", area: "transport", promptKey: "fp.q.freight.prompt", lowKey: "fp.q.freight.low", highKey: "fp.q.freight.high" },
  { id: "diet", area: "consumption", promptKey: "fp.q.diet.prompt", lowKey: "fp.q.diet.low", highKey: "fp.q.diet.high" },
  { id: "waste", area: "consumption", promptKey: "fp.q.waste.prompt", lowKey: "fp.q.waste.low", highKey: "fp.q.waste.high" },
  { id: "buying", area: "consumption", promptKey: "fp.q.buying.prompt", lowKey: "fp.q.buying.low", highKey: "fp.q.buying.high" },
];

export interface FootprintLevel {
  score: number;
  nameKey: TranslationKey;
  meaningKey: TranslationKey;
  accent: "moss" | "sky" | "ochre" | "clay";
}

export const footprintLevels: FootprintLevel[] = [
  { score: 1, nameKey: "fp.lvl.1.name", meaningKey: "fp.lvl.1.meaning", accent: "moss" },
  { score: 2, nameKey: "fp.lvl.2.name", meaningKey: "fp.lvl.2.meaning", accent: "moss" },
  { score: 3, nameKey: "fp.lvl.3.name", meaningKey: "fp.lvl.3.meaning", accent: "moss" },
  { score: 4, nameKey: "fp.lvl.4.name", meaningKey: "fp.lvl.4.meaning", accent: "sky" },
  { score: 5, nameKey: "fp.lvl.5.name", meaningKey: "fp.lvl.5.meaning", accent: "sky" },
  { score: 6, nameKey: "fp.lvl.6.name", meaningKey: "fp.lvl.6.meaning", accent: "ochre" },
  { score: 7, nameKey: "fp.lvl.7.name", meaningKey: "fp.lvl.7.meaning", accent: "ochre" },
  { score: 8, nameKey: "fp.lvl.8.name", meaningKey: "fp.lvl.8.meaning", accent: "clay" },
  { score: 9, nameKey: "fp.lvl.9.name", meaningKey: "fp.lvl.9.meaning", accent: "clay" },
  { score: 10, nameKey: "fp.lvl.10.name", meaningKey: "fp.lvl.10.meaning", accent: "clay" },
];

export interface FootprintResult {
  rawTotal: number;
  normalized: number;
  level: FootprintLevel;
  areaScores: Record<string, number>;
}

export function calculateFootprint(answers: Record<string, number>): FootprintResult {
  const rawTotal = footprintQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const pct = (rawTotal - 12) / (120 - 12);
  const normalized = Math.max(1, Math.min(10, Math.round(1 + pct * 9)));
  const level = footprintLevels.find((l) => l.score === normalized) ?? footprintLevels[4];
  const areaScores: Record<string, number> = {};
  for (const area of footprintAreas) {
    const qs = footprintQuestions.filter((q) => q.area === area.id);
    const sum = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    areaScores[area.id] = Math.round((sum / qs.length) * 10) / 10;
  }
  return { rawTotal, normalized, level, areaScores };
}

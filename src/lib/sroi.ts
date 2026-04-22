// SROI scoring engine
// Each question scored 0-10, then normalised within its pillar, then weighted.

export type QuestionType = "currency" | "percent" | "number" | "slider" | "binary" | "scale";

export interface Question {
  id: string;
  pillar: "financial" | "social" | "environmental" | "innovation";
  label: string;
  helper: string;
  type: QuestionType;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  // function to convert a raw input value into a 0-10 score
  score: (value: number) => number;
}

const clamp = (n: number, min = 0, max = 10) => Math.max(min, Math.min(max, n));

export const questions: Question[] = [
  // Financial
  {
    id: "capital",
    pillar: "financial",
    label: "Capital Commitment",
    helper: "Total dollar amount of the investment (USD).",
    type: "currency",
    min: 0,
    step: 1000,
    unit: "$",
    // Capital itself isn't 'good' or 'bad' for impact; we score scale ambition lightly (log).
    score: (v) => clamp(v <= 0 ? 0 : Math.log10(v) - 2), // $100 → 0, $10M → 5, $1B → 7
  },
  {
    id: "roi",
    pillar: "financial",
    label: "Projected Financial Return",
    helper: "Expected annual financial ROI (%).",
    type: "percent",
    min: 0,
    max: 50,
    step: 0.5,
    unit: "%",
    score: (v) => clamp(v / 3), // 30% ROI → 10
  },
  // Social
  {
    id: "jobs",
    pillar: "social",
    label: "Local Job Creation",
    helper: "FTE roles created in underserved communities.",
    type: "number",
    min: 0,
    step: 1,
    score: (v) => clamp(Math.log10(v + 1) * 3.3), // 1000 jobs → ~10
  },
  {
    id: "wage",
    pillar: "social",
    label: "Living Wage Commitment",
    helper: "% of employees paid a living wage (vs. local minimum).",
    type: "percent",
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
    score: (v) => clamp(v / 10),
  },
  {
    id: "upskill",
    pillar: "social",
    label: "Upskilling & Growth",
    helper: "Formal technical certifications or training programmes.",
    type: "scale",
    min: 0,
    max: 10,
    step: 1,
    score: (v) => clamp(v),
  },
  // Environmental
  {
    id: "carbon",
    pillar: "environmental",
    label: "Carbon Displacement",
    helper: "Does the product reduce CO₂ or replace a high-carbon alternative?",
    type: "scale",
    min: 0,
    max: 10,
    step: 1,
    score: (v) => clamp(v),
  },
  {
    id: "circular",
    pillar: "environmental",
    label: "Resource Efficiency",
    helper: "Use of circular-economy principles (recycling / waste reduction).",
    type: "scale",
    min: 0,
    max: 10,
    step: 1,
    score: (v) => clamp(v),
  },
  // Innovation & Transparency
  {
    id: "ownership",
    pillar: "innovation",
    label: "Community Ownership",
    helper: "Profit-sharing or equity for local communities / employees.",
    type: "scale",
    min: 0,
    max: 10,
    step: 1,
    score: (v) => clamp(v),
  },
  {
    id: "innovation",
    pillar: "innovation",
    label: "Innovation Level",
    helper: "Solves a social problem previously unaddressed in this region.",
    type: "scale",
    min: 0,
    max: 10,
    step: 1,
    score: (v) => clamp(v),
  },
  {
    id: "transparency",
    pillar: "innovation",
    label: "Impact Transparency",
    helper: "KPIs audited or tracked via a transparent digital ledger.",
    type: "scale",
    min: 0,
    max: 10,
    step: 1,
    score: (v) => clamp(v),
  },
];

export const pillarWeights = {
  social: 0.4,
  financial: 0.2,
  environmental: 0.2,
  innovation: 0.2,
} as const;

export const pillarLabels: Record<keyof typeof pillarWeights, string> = {
  social: "Social",
  financial: "Financial",
  environmental: "Environmental",
  innovation: "Innovation & Transparency",
};

// Social Value Multiplier — scales the weighted score into a USD social-value figure.
// Base multiplier = $50,000 per impact point; tuned so a strong score on a moderate
// investment lands in the 2-4× range.
export const SOCIAL_VALUE_MULTIPLIER = 50_000;

export interface SroiResult {
  pillarScores: Record<keyof typeof pillarWeights, number>; // 0-10 each
  weightedScore: number; // 0-100
  capital: number;
  socialValue: number;
  ratio: number;
  tier: {
    label: string;
    description: string;
    band: "traditional" | "aware" | "transformative";
  };
}

export function calculateSroi(answers: Record<string, number>): SroiResult {
  const byPillar: Record<keyof typeof pillarWeights, number[]> = {
    social: [],
    financial: [],
    environmental: [],
    innovation: [],
  };

  for (const q of questions) {
    const raw = answers[q.id] ?? 0;
    byPillar[q.pillar].push(q.score(raw));
  }

  const pillarScores = {
    social: avg(byPillar.social),
    financial: avg(byPillar.financial),
    environmental: avg(byPillar.environmental),
    innovation: avg(byPillar.innovation),
  };

  // Weighted score out of 100
  const weightedScore =
    (pillarScores.social * pillarWeights.social +
      pillarScores.financial * pillarWeights.financial +
      pillarScores.environmental * pillarWeights.environmental +
      pillarScores.innovation * pillarWeights.innovation) *
    10;

  const capital = Math.max(answers.capital ?? 0, 1);
  const socialValue = weightedScore * SOCIAL_VALUE_MULTIPLIER;
  const ratio = socialValue / capital;

  let tier: SroiResult["tier"];
  if (ratio >= 4) {
    tier = {
      label: "Transformative",
      description: "High-impact social enterprise. The investment generates outsized social value.",
      band: "transformative",
    };
  } else if (ratio >= 2) {
    tier = {
      label: "Impact-Aware",
      description: "Positive social externalities meaningfully exceed the financial outlay.",
      band: "aware",
    };
  } else {
    tier = {
      label: "Traditional",
      description: "Market-aligned investment with limited measurable social return.",
      band: "traditional",
    };
  }

  return { pillarScores, weightedScore, capital, socialValue, ratio, tier };
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

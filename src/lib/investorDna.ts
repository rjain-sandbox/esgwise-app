export type Axis = "money" | "values";

export interface DnaQuestion {
  id: string;
  axis: Axis;
  prompt: string;
  // Left option = lower score (0), Right option = higher score (10)
  // For money axis: low = Safety/Stability, high = Growth/Risk
  // For values axis: low = Pure Profit, high = Strong Values
  left: string;
  right: string;
}

export const dnaQuestions: DnaQuestion[] = [
  // Part A — Money Focus (X-Axis): low = conservative, high = growth-seeking
  {
    id: "growth",
    axis: "money",
    prompt: "Growth: Would you rather grow your money fast or keep it safe?",
    left: "Keep it safe",
    right: "Grow it fast",
  },
  {
    id: "volatility",
    axis: "money",
    prompt: "Ups & downs: If your $1,000 became $800 tomorrow, how would you feel?",
    left: "I'd panic",
    right: "I'd stay calm",
  },
  {
    id: "horizon",
    axis: "money",
    prompt: "Patience: Are you investing for next year or for 20 years from now?",
    left: "Next year",
    right: "20+ years",
  },
  {
    id: "liquidity",
    axis: "money",
    prompt: "Quick cash: Do you need to pull money out anytime for emergencies?",
    left: "Yes, always",
    right: "No, I can lock it up",
  },
  {
    id: "income",
    axis: "money",
    prompt: "Regular pay: Do you prefer small dividend checks every few months?",
    left: "Yes, steady income",
    right: "No, reinvest for growth",
  },
  // Part B — Values Focus (Y-Axis): low = profit only, high = values-driven
  {
    id: "tradeoff",
    axis: "values",
    prompt: "Giving back: Okay making $90 instead of $100 if it helped a good cause?",
    left: "No, maximise returns",
    right: "Yes, gladly",
  },
  {
    id: "exclusion",
    axis: "values",
    prompt: "No-go zone: Should your money avoid 'bad' companies (tobacco, weapons)?",
    left: "Doesn't matter",
    right: "Absolutely",
  },
  {
    id: "climate",
    axis: "values",
    prompt: "Earth first: Do you care if a company is fighting pollution & climate change?",
    left: "Not really",
    right: "Very much",
  },
  {
    id: "fairness",
    axis: "values",
    prompt: "Fairness: Do you care if companies pay fair wages and treat workers well?",
    left: "Not a priority",
    right: "Top priority",
  },
  {
    id: "themes",
    axis: "values",
    prompt: "Specific causes: Want money going to things like solar power or clean water?",
    left: "Not specifically",
    right: "Yes, very much",
  },
];

export type QuadrantId = "guardian" | "builder" | "steward" | "catalyst";

export interface Quadrant {
  id: QuadrantId;
  name: string;
  tagline: string;
  description: string;
  // X: money axis, Y: values axis. true = high half (>50)
  highMoney: boolean;
  highValues: boolean;
  accent: string; // tailwind text color class
  bg: string; // tailwind bg class
}

export const quadrants: Quadrant[] = [
  {
    id: "guardian",
    name: "The Guardian",
    tagline: "Safety-first, profit-focused",
    description:
      "You prioritise capital preservation and steady returns over fast growth or social themes. You want money that works quietly and reliably.",
    highMoney: false,
    highValues: false,
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "builder",
    name: "The Builder",
    tagline: "Growth-hungry, returns-first",
    description:
      "You're comfortable with risk and play the long game. Performance is what matters most — values are a nice-to-have, not a filter.",
    highMoney: true,
    highValues: false,
    accent: "text-ochre-text",
    bg: "bg-ochre/15",
  },
  {
    id: "steward",
    name: "The Steward",
    tagline: "Cautious & conscience-driven",
    description:
      "You want your money safe AND aligned with your values. You'd rather earn less than fund harm — sustainability is non-negotiable.",
    highMoney: false,
    highValues: true,
    accent: "text-moss-text",
    bg: "bg-moss/15",
  },
  {
    id: "catalyst",
    name: "The Catalyst",
    tagline: "Bold growth meets bold impact",
    description:
      "You chase outsized returns AND outsized impact. You believe the best companies of tomorrow are the ones solving real-world problems today.",
    highMoney: true,
    highValues: true,
    accent: "text-clay-text",
    bg: "bg-clay/15",
  },
];

export interface DnaResult {
  moneyScore: number; // 0–100
  valuesScore: number; // 0–100
  quadrant: Quadrant;
}

export function calculateDna(answers: Record<string, number>): DnaResult {
  const moneyQs = dnaQuestions.filter((q) => q.axis === "money");
  const valuesQs = dnaQuestions.filter((q) => q.axis === "values");

  const avg = (qs: DnaQuestion[]) =>
    qs.reduce((sum, q) => sum + (answers[q.id] ?? 5), 0) / qs.length;

  // Each answer is 0–10, average is 0–10 → scale to 0–100
  const moneyScore = avg(moneyQs) * 10;
  const valuesScore = avg(valuesQs) * 10;

  const highMoney = moneyScore >= 50;
  const highValues = valuesScore >= 50;

  const quadrant =
    quadrants.find((q) => q.highMoney === highMoney && q.highValues === highValues) ??
    quadrants[0];

  return { moneyScore, valuesScore, quadrant };
}

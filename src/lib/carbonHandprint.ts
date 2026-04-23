export type QuestionType = "scale" | "yesno" | "frequency";

export interface HandprintQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  help?: string;
}

export const handprintQuestions: HandprintQuestion[] = [
  {
    id: "knowledge",
    type: "scale",
    prompt:
      "Knowledge Sharing: How often do you start conversations or share information about climate action with friends, family, or social media?",
    help: "1 (Never) to 10 (Daily)",
  },
  {
    id: "ripple",
    type: "yesno",
    prompt:
      "The Ripple Effect: Have you successfully inspired someone else to adopt a green habit (like biking to work or composting)?",
  },
  {
    id: "secondhand",
    type: "frequency",
    prompt:
      "Second-Hand Support: How often do you choose to buy used items, repair broken things, or use 'buy-back' services rather than buying new?",
  },
  {
    id: "supplier",
    type: "yesno",
    prompt:
      "Supplier Influence: Do you ask the businesses you buy from about their sustainability practices?",
  },
  {
    id: "cleanenergy",
    type: "yesno",
    prompt:
      "Clean Energy Advocacy: Have you helped or encouraged your household, workplace, or a local group to switch to a renewable energy provider?",
  },
  {
    id: "community",
    type: "frequency",
    prompt:
      "Community Action: How often do you participate in or donate to local environmental projects (like community gardens or tree planting)?",
  },
  {
    id: "innovation",
    type: "scale",
    prompt:
      "Innovation & Ideas: How much do you look for 'new ways' to do things better (like suggesting a paperless system at work or a carpool)?",
    help: "1 (Never) to 10 (Constantly)",
  },
  {
    id: "gifting",
    type: "frequency",
    prompt:
      "Low-Carbon Gifting/Sharing: Do you prioritise sharing tools with neighbours or giving 'experience' gifts rather than physical products?",
  },
  {
    id: "policy",
    type: "yesno",
    prompt:
      "Policy Support: Do you sign petitions or vote for local policies that prioritise climate-friendly infrastructure (like better bike lanes or public transit)?",
  },
  {
    id: "solutions",
    type: "frequency",
    prompt:
      "Sustainable Solutions: If you run a business or have a hobby, does your 'product' or service help others save energy or reduce waste?",
  },
];

export const frequencyOptions = [
  { value: "always", label: "Always", points: 10 },
  { value: "often", label: "Often", points: 7 },
  { value: "sometimes", label: "Sometimes", points: 4 },
  { value: "never", label: "Never", points: 1 },
] as const;

export type FrequencyValue = (typeof frequencyOptions)[number]["value"];

export interface HandprintLevel {
  score: number;
  name: string;
  meaning: string;
  accent: "moss" | "ochre" | "clay" | "sky";
}

export const handprintLevels: HandprintLevel[] = [
  { score: 10, name: "Climate Positive Hero", meaning: "Your positive influence significantly outweighs your own footprint.", accent: "moss" },
  { score: 9, name: "Community Catalyst", meaning: "You are a major driver of change in your local area.", accent: "moss" },
  { score: 8, name: "Impact Leader", meaning: "You actively help others reduce their carbon impact.", accent: "moss" },
  { score: 7, name: "Green Advocate", meaning: "You consistently influence your circle toward better choices.", accent: "sky" },
  { score: 6, name: "Handprint Emerging", meaning: "You've started looking outward to help others, not just yourself.", accent: "sky" },
  { score: 5, name: "Net-Positive Trainee", meaning: "You are creating slightly more 'good' than 'bad'.", accent: "ochre" },
  { score: 4, name: "Carbon Neutral", meaning: "Your positive actions perfectly balance out your negative footprint.", accent: "ochre" },
  { score: 3, name: "Self-Focused", meaning: "You focus on your own footprint but rarely help others.", accent: "clay" },
  { score: 2, name: "Bystander", meaning: "You have very few positive environmental actions outside yourself.", accent: "clay" },
  { score: 1, name: "Carbon Heavyweight", meaning: "You have a high footprint with almost no handprint influence.", accent: "clay" },
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
  rawTotal: number; // 0–100
  normalized: number; // 1–10
  level: HandprintLevel;
}

export function calculateHandprint(answers: Record<string, HandprintAnswer>): HandprintResult {
  const rawTotal = handprintQuestions.reduce(
    (sum, q) => sum + scoreAnswer(q, answers[q.id] ?? null),
    0,
  );
  // Map 0–100 → 1–10
  const normalized = Math.max(1, Math.min(10, Math.round(rawTotal / 10)));
  const level = handprintLevels.find((l) => l.score === normalized) ?? handprintLevels[9];
  return { rawTotal, normalized, level };
}

export interface FootprintQuestion {
  id: string;
  area: string;
  prompt: string;
  lowLabel: string;
  highLabel: string;
}

export const footprintAreas = [
  { id: "living", name: "Living", subtitle: "Home & Energy" },
  { id: "mobility", name: "Mobility", subtitle: "Daily Commute" },
  { id: "transport", name: "Transportation", subtitle: "Long Distance" },
  { id: "consumption", name: "Consumption", subtitle: "Food & Stuff" },
] as const;

export const footprintQuestions: FootprintQuestion[] = [
  {
    id: "heating",
    area: "living",
    prompt: "Home Heating/Cooling: How much do you rely on fossil fuels (gas, oil, or coal) to heat or cool your home?",
    lowLabel: "100% Renewable/Solar",
    highLabel: "100% Fossil Fuels",
  },
  {
    id: "efficiency",
    area: "living",
    prompt: "Energy Efficiency: How well-insulated is your home, and do you use energy-saving appliances?",
    lowLabel: "Perfectly Insulated/Smart Home",
    highLabel: "Drafty/Old Appliances",
  },
  {
    id: "electricity",
    area: "living",
    prompt: "Electricity Usage: How often do you leave lights or electronics on when they aren't being used?",
    lowLabel: "Always Off",
    highLabel: "Always On",
  },
  {
    id: "commute",
    area: "mobility",
    prompt: "Commuting Mode: How do you usually get to work or school?",
    lowLabel: "Walk/Bike",
    highLabel: "Single-person Petrol Car",
  },
  {
    id: "ev",
    area: "mobility",
    prompt: "Electric Transition: Is your primary vehicle powered by electricity or high-emission fuel?",
    lowLabel: "EV/E-Bike",
    highLabel: "Large SUV/Diesel",
  },
  {
    id: "transit",
    area: "mobility",
    prompt: "Public Transit Use: How often do you choose buses or trains over a private car?",
    lowLabel: "Always Public",
    highLabel: "Never Public",
  },
  {
    id: "flights",
    area: "transport",
    prompt: "Air Travel: How many flights (short or long-haul) do you take in a typical year?",
    lowLabel: "None",
    highLabel: "Frequent Flyer",
  },
  {
    id: "alttravel",
    area: "transport",
    prompt: "Alternative Travel: Do you actively choose trains or carpooling for trips over 300 miles?",
    lowLabel: "Always",
    highLabel: "Never",
  },
  {
    id: "freight",
    area: "transport",
    prompt: "Freight & Shipping: How often do you order items online that require 'next-day' or air shipping?",
    lowLabel: "Never",
    highLabel: "Daily",
  },
  {
    id: "diet",
    area: "consumption",
    prompt: "Dietary Impact: How much meat and dairy (especially beef) is in your weekly diet?",
    lowLabel: "Plant-based",
    highLabel: "Meat with every meal",
  },
  {
    id: "waste",
    area: "consumption",
    prompt: "Waste Generation: How much trash does your household produce that goes to a landfill?",
    lowLabel: "Zero Waste/Compost",
    highLabel: "Several bags a week",
  },
  {
    id: "buying",
    area: "consumption",
    prompt: "Buying Habits: Do you prefer buying new, cheap 'fast-fashion' items over durable or second-hand goods?",
    lowLabel: "Only Second-hand",
    highLabel: "Always New/Fast-fashion",
  },
];

export interface FootprintLevel {
  score: number;
  name: string;
  meaning: string;
  accent: "moss" | "sky" | "ochre" | "clay";
}

export const footprintLevels: FootprintLevel[] = [
  { score: 1, name: "Earth Guardian", meaning: "Your footprint is as low as modern life allows.", accent: "moss" },
  { score: 2, name: "Eco-Efficient", meaning: "You have optimized most of your high-impact habits.", accent: "moss" },
  { score: 3, name: "Mindful Consumer", meaning: "You are below the average global carbon footprint.", accent: "moss" },
  { score: 4, name: "Carbon Neutral (Target)", meaning: "Your footprint is balanced with natural absorption.", accent: "sky" },
  { score: 5, name: "Global Average", meaning: "You are on par with the average citizen in a developed nation.", accent: "sky" },
  { score: 6, name: "Impact Heavy", meaning: "Your lifestyle requires more than one Earth to sustain.", accent: "ochre" },
  { score: 7, name: "High Emitter", meaning: "Your habits in mobility or diet are significantly above average.", accent: "ochre" },
  { score: 8, name: "Industrial-Scale Consumer", meaning: "You have high frequent travel and consumption habits.", accent: "clay" },
  { score: 9, name: "Climate Risk", meaning: "Your footprint is among the top 10% of individual emitters.", accent: "clay" },
  { score: 10, name: "Carbon Giant", meaning: "Your current lifestyle has a massive environmental cost.", accent: "clay" },
];

export interface FootprintResult {
  rawTotal: number; // 12–120
  normalized: number; // 1–10
  level: FootprintLevel;
  areaScores: Record<string, number>; // average per area, 1–10
}

export function calculateFootprint(answers: Record<string, number>): FootprintResult {
  const rawTotal = footprintQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  // Map 12 (best) – 120 (worst) → 1 – 10
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

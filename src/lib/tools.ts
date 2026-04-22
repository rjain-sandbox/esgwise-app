export type ToolAccent = "moss" | "ochre" | "clay" | "sky";

export interface Tool {
  slug: "investor-dna" | "esgpt" | "sroi" | "carbon-footprint" | "carbon-handprint";
  number: string;
  name: string;
  tagline: string;
  description: string;
  accent: ToolAccent;
  meta: string;
}

export const tools: Tool[] = [
  {
    slug: "investor-dna",
    number: "01",
    name: "Investor DNA",
    tagline: "Discover your ESG investor archetype",
    description:
      "A short questionnaire that maps your values, risk appetite and impact priorities into a personalised investor profile.",
    accent: "moss",
    meta: "12 questions · 4 min",
  },
  {
    slug: "esgpt",
    number: "02",
    name: "ESGpt",
    tagline: "Conversational ESG intelligence",
    description:
      "Ask anything about ratings, frameworks, regulations or specific companies. ESGpt cites sources and explains the why.",
    accent: "sky",
    meta: "Chat · Always on",
  },
  {
    slug: "sroi",
    number: "03",
    name: "SROI Calculator",
    tagline: "Quantify social return on investment",
    description:
      "Walk through inputs, outputs, outcomes and proxies to estimate how much social value each dollar of your investment creates.",
    accent: "ochre",
    meta: "Guided · 8 min",
  },
  {
    slug: "carbon-footprint",
    number: "04",
    name: "Carbon Footprint",
    tagline: "Measure the emissions you cause",
    description:
      "Estimate the tonnes of CO₂e produced by an individual, household or portfolio across scope 1, 2 and 3 categories.",
    accent: "clay",
    meta: "Calculator · 5 min",
  },
  {
    slug: "carbon-handprint",
    number: "05",
    name: "Carbon Handprint",
    tagline: "Measure the emissions you avoid",
    description:
      "The positive twin of the footprint — quantify the CO₂e your choices and investments help the world avoid.",
    accent: "moss",
    meta: "Calculator · 5 min",
  },
];

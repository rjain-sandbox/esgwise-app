import type { TranslationKey } from "./i18n";

export type ToolAccent = "moss" | "ochre" | "clay" | "sky";

export type ToolSlug =
  | "investor-dna"
  | "esgpt"
  | "sroi"
  | "carbon-footprint"
  | "carbon-handprint";

export interface Tool {
  slug: ToolSlug;
  number: string;
  nameKey: TranslationKey;
  taglineKey: TranslationKey;
  descriptionKey: TranslationKey;
  metaKey: TranslationKey;
  accent: ToolAccent;
}

export const tools: Tool[] = [
  {
    slug: "investor-dna",
    number: "01",
    nameKey: "tool.investor-dna.name",
    taglineKey: "tool.investor-dna.tagline",
    descriptionKey: "tool.investor-dna.description",
    metaKey: "tool.investor-dna.meta",
    accent: "moss",
  },
  {
    slug: "esgpt",
    number: "02",
    nameKey: "tool.esgpt.name",
    taglineKey: "tool.esgpt.tagline",
    descriptionKey: "tool.esgpt.description",
    metaKey: "tool.esgpt.meta",
    accent: "sky",
  },
  {
    slug: "sroi",
    number: "03",
    nameKey: "tool.sroi.name",
    taglineKey: "tool.sroi.tagline",
    descriptionKey: "tool.sroi.description",
    metaKey: "tool.sroi.meta",
    accent: "ochre",
  },
  {
    slug: "carbon-footprint",
    number: "04",
    nameKey: "tool.carbon-footprint.name",
    taglineKey: "tool.carbon-footprint.tagline",
    descriptionKey: "tool.carbon-footprint.description",
    metaKey: "tool.carbon-footprint.meta",
    accent: "clay",
  },
  {
    slug: "carbon-handprint",
    number: "05",
    nameKey: "tool.carbon-handprint.name",
    taglineKey: "tool.carbon-handprint.tagline",
    descriptionKey: "tool.carbon-handprint.description",
    metaKey: "tool.carbon-handprint.meta",
    accent: "moss",
  },
];

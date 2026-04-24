import csvEnRaw from "@/assets/esgpt_knowledge_base.csv?raw";
import csvDeRaw from "@/assets/esgpt_knowledge_base_de.csv?raw";
import type { Lang } from "./i18n";

export interface KnowledgeEntry {
  question: string;
  answer: string;
  tokens: string[];
  keywords: string[];
}

const STOPWORDS_EN = new Set([
  "what", "is", "the", "a", "an", "are", "of", "in", "on", "to", "for", "and",
  "or", "by", "with", "as", "at", "do", "does", "how", "why", "tell", "me",
  "about", "explain", "define", "definition", "mean", "means", "can", "you",
  "please", "i", "we", "they", "it", "this", "that",
]);

const STOPWORDS_DE = new Set([
  "was", "ist", "der", "die", "das", "ein", "eine", "einen", "einer", "und",
  "oder", "im", "in", "auf", "für", "von", "vom", "mit", "zu", "zur", "zum",
  "wie", "warum", "bedeutet", "heißt", "heisst", "erklär", "erkläre", "erklärt",
  "erklären", "definition", "definiere", "definiert", "kann", "kannst", "du",
  "ich", "wir", "sie", "es", "dies", "diese", "dieser", "über", "den", "dem",
  "des", "bitte", "mir",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function keywordsOf(text: string, lang: Lang): string[] {
  const stop = lang === "de" ? STOPWORDS_DE : STOPWORDS_EN;
  return tokenize(text).filter((t) => t.length > 2 && !stop.has(t));
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { cur.push(field); field = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && input[i + 1] === "\n") i++;
        cur.push(field); rows.push(cur); cur = []; field = "";
      } else field += ch;
    }
  }
  if (field.length > 0 || cur.length > 0) { cur.push(field); rows.push(cur); }
  return rows.filter((r) => r.length >= 2 && r.some((c) => c.trim().length > 0));
}

function buildBase(raw: string, lang: Lang): KnowledgeEntry[] {
  const rows = parseCsv(raw).slice(1); // skip header
  return rows.map(([question, answer]) => ({
    question: question.trim(),
    answer: answer.trim(),
    tokens: tokenize(question),
    keywords: keywordsOf(question, lang),
  }));
}

const KB_EN = buildBase(csvEnRaw, "en");
const KB_DE = buildBase(csvDeRaw, "de");

export function getKnowledgeBase(lang: Lang): KnowledgeEntry[] {
  return lang === "de" ? KB_DE : KB_EN;
}

/**
 * Union of ALL keywords across BOTH knowledge bases — defines the topical scope.
 * Used to reject totally off-topic queries (e.g., "How do I bake bread?").
 */
const ESG_KEYWORD_UNIVERSE: Set<string> = (() => {
  const s = new Set<string>();
  for (const e of KB_EN) for (const k of e.keywords) s.add(k);
  for (const e of KB_DE) for (const k of e.keywords) s.add(k);
  // Also add answer-side keywords so wider phrasings still match scope
  for (const e of KB_EN) for (const k of keywordsOf(e.answer, "en")) s.add(k);
  for (const e of KB_DE) for (const k of keywordsOf(e.answer, "de")) s.add(k);
  return s;
})();

function bigrams(s: string): Set<string> {
  const clean = s.replace(/\s+/g, " ").trim();
  const out = new Set<string>();
  for (let i = 0; i < clean.length - 1; i++) out.add(clean.slice(i, i + 2));
  return out;
}

function scoreEntry(query: string, entry: KnowledgeEntry, lang: Lang): number {
  const q = query.toLowerCase().trim();
  const eq = entry.question.toLowerCase();
  if (!q) return 0;
  if (eq === q) return 100;
  if (eq.includes(q) || q.includes(eq)) return 80;

  const queryKeywords = keywordsOf(query, lang);
  if (queryKeywords.length === 0) return 0;

  const entryKw = new Set(entry.keywords);
  let overlap = 0;
  for (const k of queryKeywords) if (entryKw.has(k)) overlap += 1;

  const denom = Math.max(queryKeywords.length, entry.keywords.length);
  const jaccard = denom === 0 ? 0 : overlap / denom;

  const qBg = bigrams(q);
  const eBg = bigrams(eq);
  const bgOverlap = qBg.size === 0 ? 0 : [...qBg].filter((b) => eBg.has(b)).length / qBg.size;

  return overlap * 12 + jaccard * 35 + bgOverlap * 18;
}

export interface MatchOutcome {
  inScope: boolean;
  matched?: KnowledgeEntry;
  answer?: string;
}

/**
 * Strict match:
 *  1. Reject if query has no overlap with the ESG keyword universe (off-topic).
 *  2. Otherwise rank entries; require a meaningful score AND keyword overlap.
 */
export function findAnswer(query: string, lang: Lang): MatchOutcome {
  const text = query.trim();
  if (!text) return { inScope: false };

  const queryKeywords = keywordsOf(text, lang);
  // Out-of-scope guard: must share at least one keyword with the ESG universe.
  const inUniverse = queryKeywords.some((k) => ESG_KEYWORD_UNIVERSE.has(k));
  if (queryKeywords.length === 0 || !inUniverse) {
    return { inScope: false };
  }

  const base = getKnowledgeBase(lang);
  let best: { entry: KnowledgeEntry; score: number; overlap: number } | null = null;
  for (const entry of base) {
    const score = scoreEntry(text, entry, lang);
    const entryKw = new Set(entry.keywords);
    let overlap = 0;
    for (const k of queryKeywords) if (entryKw.has(k)) overlap += 1;
    if (!best || score > best.score) best = { entry, score, overlap };
  }

  // Require BOTH a strong-enough score AND at least one direct keyword overlap.
  if (!best || best.score < 22 || best.overlap < 1) {
    return { inScope: false };
  }
  return { inScope: true, matched: best.entry, answer: best.entry.answer };
}

export function knowledgeCount(lang: Lang): number {
  return getKnowledgeBase(lang).length;
}

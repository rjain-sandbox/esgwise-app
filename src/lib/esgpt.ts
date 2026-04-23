import csvRaw from "@/assets/esgpt_knowledge_base.csv?raw";

export interface KnowledgeEntry {
  question: string;
  answer: string;
  /** Lowercased tokenised question for matching */
  tokens: string[];
  keywords: string[];
}

const STOPWORDS = new Set([
  "what", "is", "the", "a", "an", "are", "of", "in", "on", "to", "for", "and",
  "or", "by", "with", "as", "at", "do", "does", "how", "why", "tell", "me",
  "about", "esg", "explain", "define", "definition", "mean", "means",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function keywordsOf(text: string): string[] {
  return tokenize(text).filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/** Minimal CSV parser that handles quoted fields with commas. */
function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        cur.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && input[i + 1] === "\n") i++;
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  return rows.filter((r) => r.length >= 2 && r.some((c) => c.trim().length > 0));
}

export const knowledgeBase: KnowledgeEntry[] = (() => {
  const rows = parseCsv(csvRaw);
  // Skip header
  const data = rows.slice(1);
  return data.map(([question, answer]) => ({
    question: question.trim(),
    answer: answer.trim(),
    tokens: tokenize(question),
    keywords: keywordsOf(question),
  }));
})();

export const FALLBACK_ANSWER =
  "I am still learning or it is currently out of my scope.";

interface MatchScore {
  entry: KnowledgeEntry;
  score: number;
}

/**
 * Score a query against an entry using:
 *  - exact substring containment
 *  - keyword overlap (Jaccard-ish)
 *  - bigram overlap for fuzzy phrasing
 */
function scoreEntry(query: string, entry: KnowledgeEntry): number {
  const q = query.toLowerCase().trim();
  const eq = entry.question.toLowerCase();

  if (!q) return 0;

  // Exact / containment boost
  if (eq === q) return 100;
  if (eq.includes(q) || q.includes(eq)) return 80;

  const queryKeywords = keywordsOf(query);
  if (queryKeywords.length === 0) return 0;

  const entryKw = new Set(entry.keywords);
  let overlap = 0;
  for (const k of queryKeywords) {
    if (entryKw.has(k)) overlap += 1;
  }

  const denom = Math.max(queryKeywords.length, entry.keywords.length);
  const jaccard = denom === 0 ? 0 : overlap / denom;

  // Bigram overlap on the raw question
  const qBigrams = bigrams(q);
  const eBigrams = bigrams(eq);
  const bigramOverlap = qBigrams.size === 0 ? 0 :
    [...qBigrams].filter((b) => eBigrams.has(b)).length / qBigrams.size;

  return overlap * 10 + jaccard * 30 + bigramOverlap * 20;
}

function bigrams(s: string): Set<string> {
  const clean = s.replace(/\s+/g, " ").trim();
  const out = new Set<string>();
  for (let i = 0; i < clean.length - 1; i++) {
    out.add(clean.slice(i, i + 2));
  }
  return out;
}

export function findAnswer(query: string): { answer: string; matched?: KnowledgeEntry } {
  if (!query.trim()) return { answer: FALLBACK_ANSWER };

  const scored: MatchScore[] = knowledgeBase.map((entry) => ({
    entry,
    score: scoreEntry(query, entry),
  }));

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  // Threshold: require at least one meaningful keyword overlap or strong bigram match
  if (!best || best.score < 8) {
    return { answer: FALLBACK_ANSWER };
  }

  return { answer: best.entry.answer, matched: best.entry };
}

export const quickStartTopics = [
  "Carbon Footprint",
  "SROI",
  "Scope 1 emissions",
  "Greenwashing",
  "Net Zero",
  "Paris Agreement",
];

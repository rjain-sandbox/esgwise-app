import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  questions,
  calculateSroi,
  pillarLabelKeys,
  pillarWeights,
  formatCurrency,
  type Question,
  type SroiResult,
} from "@/lib/sroi";
import { useI18n } from "@/lib/i18n";

const pillarColor: Record<keyof typeof pillarWeights, string> = {
  financial: "bg-primary",
  social: "bg-clay",
  planet: "bg-moss",
  progress: "bg-ochre",
};

const pillarText: Record<keyof typeof pillarWeights, string> = {
  financial: "text-primary",
  social: "text-clay-text",
  planet: "text-moss-text",
  progress: "text-ochre-text",
};

const tierColor: Record<SroiResult["tier"]["band"], string> = {
  loss: "bg-muted text-foreground",
  aware: "bg-muted text-foreground",
  creating: "bg-ochre/25 text-ochre-text",
  leader: "bg-moss/25 text-moss-text",
  transformative: "bg-primary/15 text-primary",
};

/** Display order of categories. Capital sits in Financial first. */
const CATEGORY_ORDER: Array<keyof typeof pillarWeights> = ["financial", "social", "planet", "progress"];

function defaults(): Record<string, number> {
  const d: Record<string, number> = {};
  for (const q of questions) d[q.id] = q.defaultValue;
  return d;
}

export function SroiCalculator() {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, number>>(defaults);
  const [showResult, setShowResult] = useState(false);
  const result = useMemo(() => calculateSroi(answers), [answers]);
  const update = (id: string, value: number) => setAnswers((prev) => ({ ...prev, [id]: value }));

  if (showResult) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <ResultsView result={result} onBack={() => setShowResult(false)} onReset={() => setAnswers(defaults())} />
      </div>
    );
  }

  // Build questions grouped by category. Capital is shown unnumbered; the 10 scored
  // questions are numbered 1–10 starting at "Financial Return".
  let counter = 0;
  const groups = CATEGORY_ORDER.map((pillar) => ({
    pillar,
    items: questions
      .filter((q) => q.pillar === pillar)
      .map((q) => ({ q, index: q.id === "capital" ? null : ++counter })),
  }));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("common.back")}</Link>

        <div className="mt-8 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ochre" aria-hidden="true" />
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("sroi.eyebrow")}</p>
        </div>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl">
          {t("sroi.titleA")}
          <br />
          <span className="italic text-primary">{t("sroi.titleB")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t("sroi.lead")}</p>

        <form onSubmit={(e) => { e.preventDefault(); setShowResult(true); }} className="mt-12 space-y-10">
          {groups.map((g) => (
            <section key={g.pillar} aria-labelledby={`section-${g.pillar}`} className="space-y-4">
              <header className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${pillarColor[g.pillar]}`} aria-hidden="true" />
                <h2 id={`section-${g.pillar}`} className={`font-display text-sm font-semibold uppercase tracking-[0.22em] ${pillarText[g.pillar]}`}>
                  {t(pillarLabelKeys[g.pillar])}
                </h2>
              </header>
              {g.items.map(({ q, index }) => (
                <QuestionCard
                  key={q.id}
                  index={index}
                  question={q}
                  value={answers[q.id]}
                  onChange={(v) => update(q.id, v)}
                />
              ))}
            </section>
          ))}

          <div className="sticky bottom-4 z-10 mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/95 p-4 backdrop-blur-md shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--primary)_25%,transparent)]">
            <div className="text-sm" aria-live="polite" aria-atomic="true">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("sroi.livePreview")}</div>
              <div className="font-display text-2xl font-semibold text-foreground">
                {result.impactScore.toFixed(2)}<span className="text-base font-sans font-normal text-muted-foreground">/5</span>{" "}
                <span className="text-base font-sans font-normal text-muted-foreground">· {t(result.tier.labelKey)}</span>
              </div>
            </div>
            <button type="submit" className="min-h-11 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
              {t("sroi.calculate")}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

interface QuestionCardProps {
  index: number | null;
  question: Question;
  value: number;
  onChange: (v: number) => void;
}

function QuestionCard({ index, question: q, value, onChange }: QuestionCardProps) {
  const { t } = useI18n();
  const inputId = `sroi-${q.id}`;
  const helpId = `sroi-${q.id}-help`;
  const isCapital = q.id === "capital";

  return (
    <div className={`grain rounded-2xl border bg-card p-6 transition-colors ${isCapital ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/30"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          {index !== null && (
            <span className="font-display text-3xl font-semibold text-primary/40" aria-hidden="true">
              {String(index).padStart(2, "0")}
            </span>
          )}
          <div>
            <label htmlFor={inputId} className="font-display text-xl font-semibold leading-tight text-foreground cursor-pointer">
              {t(q.labelKey)}
            </label>
            <p id={helpId} className="mt-1 text-sm text-muted-foreground">{t(q.helperKey)}</p>
            {isCapital && (
              <p className="mt-2 text-xs italic text-muted-foreground">{t("sroi.capitalNote")}</p>
            )}
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${pillarText[q.pillar]}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${pillarColor[q.pillar]}`} aria-hidden="true" />
          {t(pillarLabelKeys[q.pillar])}
        </span>
      </div>

      <div className="mt-5">
        {q.type === "currency" ? (
          <NumberInput question={q} value={value} onChange={onChange} inputId={inputId} helpId={helpId} />
        ) : q.type === "percent" ? (
          <SliderInput
            question={q}
            value={value}
            onChange={onChange}
            format={(v) => `${v}%`}
            inputId={inputId}
            helpId={helpId}
            segments={
              q.id === "roi"
                ? [
                    { at: 0, key: "sroi.q.roi.seg.0" },
                    { at: 50, key: "sroi.q.roi.seg.50" },
                    { at: 100, key: "sroi.q.roi.seg.100" },
                    { at: 120, key: "sroi.q.roi.seg.120" },
                    { at: 160, key: "sroi.q.roi.seg.160" },
                    { at: 200, key: "sroi.q.roi.seg.200" },
                  ]
                : undefined
            }
          />
        ) : q.type === "slider10" ? (
          <SliderInput question={q} value={value} onChange={onChange} format={(v) => `${v} / 10`} inputId={inputId} helpId={helpId} />
        ) : (
          <TierInput question={q} value={value} onChange={onChange} inputId={inputId} />
        )}
      </div>
    </div>
  );
}

function NumberInput({ question: q, value, onChange, inputId, helpId }: {
  question: Question; value: number; onChange: (v: number) => void; inputId: string; helpId: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {q.unit && <span className="font-display text-2xl text-muted-foreground" aria-hidden="true">{q.unit}</span>}
      <input
        id={inputId}
        type="number"
        min={q.min}
        step={q.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        aria-describedby={helpId}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 font-display text-2xl font-semibold text-foreground outline-none ring-primary/30 transition focus:border-primary focus:ring-2"
      />
    </div>
  );
}

function SliderInput({ question: q, value, onChange, format, inputId, helpId, segments }: {
  question: Question; value: number; onChange: (v: number) => void; format: (v: number) => string; inputId: string; helpId: string;
  segments?: Array<{ at: number; key: import("@/lib/i18n").TranslationKey }>;
}) {
  const { t } = useI18n();
  const min = q.min ?? 0;
  const max = q.max ?? 100;
  const range = Math.max(max - min, 1);
  // Find the active segment (largest segment.at <= value)
  const activeSegIdx = segments
    ? segments.reduce((acc, s, i) => (value >= s.at ? i : acc), 0)
    : -1;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-3xl font-semibold text-foreground" aria-hidden="true">{format(value)}</span>
        {segments ? (
          <span className="text-xs font-medium text-primary" aria-hidden="true">{t(segments[activeSegIdx].key)}</span>
        ) : (
          <span className="text-xs text-muted-foreground" aria-hidden="true">{q.min} — {q.max}</span>
        )}
      </div>
      <input
        id={inputId}
        type="range"
        min={q.min}
        max={q.max}
        step={q.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={helpId}
        aria-valuetext={segments ? `${format(value)} — ${t(segments[activeSegIdx].key)}` : format(value)}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
      {segments && (
        <div className="relative mt-2 h-8" aria-hidden="true">
          {segments.map((s, i) => {
            const pct = ((s.at - min) / range) * 100;
            const align =
              pct <= 4 ? "items-start text-left" : pct >= 96 ? "items-end text-right" : "items-center text-center";
            const translate =
              pct <= 4 ? "translateX(0)" : pct >= 96 ? "translateX(-100%)" : "translateX(-50%)";
            return (
              <div
                key={i}
                className={`absolute top-0 flex flex-col ${align}`}
                style={{ left: `${pct}%`, transform: translate, maxWidth: "5.5rem" }}
              >
                <span className="h-1.5 w-px bg-border" />
                <span
                  className={`mt-1 text-[10px] leading-tight ${
                    i === activeSegIdx ? "font-semibold text-primary" : "text-muted-foreground"
                  }`}
                >
                  {t(s.key)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TierInput({ question: q, value, onChange, inputId }: {
  question: Question; value: number; onChange: (v: number) => void; inputId: string;
}) {
  const { t } = useI18n();
  const opts = q.options ?? [];
  return (
    <div role="radiogroup" aria-labelledby={inputId} className="grid gap-2 sm:grid-cols-2">
      {opts.map((opt, i) => {
        const active = i === value;
        return (
          <button
            type="button"
            key={i}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(i)}
            className={`min-h-11 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
              active
                ? "border-primary bg-primary/10 text-foreground"
                : "border-input bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            <span className="font-display text-base">{t(opt.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}

function ResultsView({ result, onBack, onReset }: { result: SroiResult; onBack: () => void; onReset: () => void }) {
  const { t } = useI18n();
  const max = 5;
  const scoreCapped = Math.min(result.impactScore, max);
  const angle = -90 + (scoreCapped / max) * 180;
  const tierLabel = t(result.tier.labelKey);

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <button type="button" onClick={onBack} className="min-h-11 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors">
        {t("common.editAnswers")}
      </button>

      <div className="mt-8 grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("sroi.score")}</p>
          <h1 aria-live="polite" className="mt-2 font-display text-6xl font-semibold leading-none text-foreground sm:text-7xl">
            {result.impactScore.toFixed(2)}<span className="text-primary/40" aria-hidden="true">/5</span>
            <span className="sr-only"> {t("sroi.outOf5")}</span>
          </h1>

          <div role="status" className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${tierColor[result.tier.band]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {tierLabel}
          </div>

          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{t(result.tier.descriptionKey)}</p>

          <div className="relative mt-10 aspect-[2/1] w-full max-w-md">
            <svg viewBox="0 0 200 110" className="h-full w-full" role="img" aria-label={`${result.impactScore.toFixed(2)}/5 — ${tierLabel}`}>
              <title>{`${result.impactScore.toFixed(2)}/5 — ${tierLabel}`}</title>
              <defs>
                <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.65 0.04 150)" />
                  <stop offset="50%" stopColor="oklch(0.78 0.13 75)" />
                  <stop offset="100%" stopColor="oklch(0.55 0.1 145)" />
                </linearGradient>
              </defs>
              <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="url(#arc)" strokeWidth="14" strokeLinecap="round" />
              {[
                { x: 15, y: 108, label: "0" },
                { x: 60, y: 30, label: "2" },
                { x: 140, y: 30, label: "4" },
                { x: 185, y: 108, label: "5" },
              ].map((tk) => (
                <text key={tk.label} x={tk.x} y={tk.y} textAnchor="middle" className="fill-foreground" fontSize="9">{tk.label}</text>
              ))}
              <g transform={`translate(100 100) rotate(${angle})`}>
                <line x1="0" y1="0" x2="0" y2="-78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-foreground" />
                <circle r="6" className="fill-primary" />
              </g>
            </svg>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("sroi.sroi")}</div>
              <div className="mt-1 font-display text-3xl font-semibold text-foreground">{result.sroiPercent.toFixed(0)}%</div>
              <div className="mt-1 text-xs text-muted-foreground">{(result.sroiPercent / 100).toFixed(2)} {t("sroi.perDollar")}</div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("sroi.rawTotal")}</div>
              <div className="mt-1 font-display text-3xl font-semibold text-foreground">
                {result.rawTotal.toFixed(0)}<span className="text-base text-muted-foreground"> /100</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{t("sroi.toScore")}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("sroi.pillarBreakdown")}</div>
            <ul className="mt-4 space-y-4">
              {(Object.keys(pillarWeights) as Array<keyof typeof pillarWeights>).map((p) => {
                const score = result.pillarScores[p];
                const pct = score; // 0..100
                return (
                  <li key={p}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className={`font-medium ${pillarText[p]}`}>{t(pillarLabelKeys[p])}</span>
                      <span className="text-muted-foreground">{score.toFixed(0)}/100</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className={`h-full ${pillarColor[p]} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("sroi.capital")}</div>
              <div className="mt-1 font-display text-2xl font-semibold text-foreground">{formatCurrency(result.capital)}</div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("sroi.totalReturn")}</div>
              <div className={`mt-1 font-display text-2xl font-semibold ${result.totalReturn < 0 ? "text-clay-text" : "text-primary"}`}>
                {formatCurrency(result.totalReturn)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onBack} className="min-h-11 rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary">
              {t("common.refine")}
            </button>
            <button type="button" onClick={onReset} className="min-h-11 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
              {t("common.startOver")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-3xl border border-border bg-card/60 p-6">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("sroi.scale")}</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-5">
          {([
            { band: "loss", range: "1.0", labelKey: "sroi.tier.loss.label", descKey: "sroi.tier.loss.desc" },
            { band: "aware", range: "2.0", labelKey: "sroi.tier.aware.label", descKey: "sroi.tier.aware.desc" },
            { band: "creating", range: "3.0", labelKey: "sroi.tier.creating.label", descKey: "sroi.tier.creating.desc" },
            { band: "leader", range: "4.0", labelKey: "sroi.tier.leader.label", descKey: "sroi.tier.leader.desc" },
            { band: "transformative", range: "5.0", labelKey: "sroi.tier.transformative.label", descKey: "sroi.tier.transformative.desc" },
          ] as const).map((tk) => {
            const active = result.tier.band === tk.band;
            return (
              <div key={tk.band} className={`rounded-2xl border p-5 transition ${active ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${tierColor[tk.band]}`}>{tk.range}</div>
                <div className="mt-3 font-display text-lg font-semibold text-foreground">{t(tk.labelKey)}</div>
                <p className="mt-1 text-sm text-muted-foreground">{t(tk.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mt-10 rounded-2xl border border-dashed border-border bg-background/40 p-5">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{t("sroi.methodology.title")}</div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("sroi.methodology.body")}</p>
      </footer>
    </main>
  );
}

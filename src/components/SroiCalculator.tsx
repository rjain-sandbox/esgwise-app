import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  questions,
  calculateSroi,
  pillarLabels,
  pillarWeights,
  formatCurrency,
  type SroiResult,
} from "@/lib/sroi";

const pillarColor: Record<keyof typeof pillarWeights, string> = {
  social: "bg-clay",
  financial: "bg-primary",
  environmental: "bg-moss",
  innovation: "bg-ochre",
};

const pillarText: Record<keyof typeof pillarWeights, string> = {
  social: "text-clay-text",
  financial: "text-primary",
  environmental: "text-moss-text",
  innovation: "text-ochre-text",
};

const tierColor: Record<SroiResult["tier"]["band"], string> = {
  loss: "bg-muted text-foreground",
  aware: "bg-muted text-foreground",
  creating: "bg-ochre/25 text-ochre-text",
  leader: "bg-moss/25 text-moss-text",
  transformative: "bg-primary/15 text-primary",
};

function defaults(): Record<string, number> {
  const d: Record<string, number> = {};
  for (const q of questions) {
    if (q.id === "capital") d[q.id] = 250_000;
    else if (q.id === "roi") d[q.id] = 8;
    else if (q.id === "jobs") d[q.id] = 25;
    else if (q.id === "wage") d[q.id] = 60;
    else d[q.id] = 5;
  }
  return d;
}

export function SroiCalculator() {
  const [answers, setAnswers] = useState<Record<string, number>>(defaults);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => calculateSroi(answers), [answers]);

  const update = (id: string, value: number) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  if (showResult) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <ResultsView result={result} onBack={() => setShowResult(false)} onReset={() => setAnswers(defaults())} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to dashboard
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ochre" aria-hidden="true" />
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Tool 03 · SROI Calculator</p>
        </div>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl">
          Social Return
          <br />
          <span className="italic text-primary">on Investment.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Answer 10 questions about your planned investment. We score each on a 0–10 scale,
          divide the total by 20 to get a 0–5 Social Impact Score, then translate that into
          an SROI percentage and a Total Social Return in dollars.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowResult(true);
          }}
          className="mt-12 space-y-4"
        >
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              index={i + 1}
              question={q}
              value={answers[q.id]}
              onChange={(v) => update(q.id, v)}
            />
          ))}

          <div className="sticky bottom-4 z-10 mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/95 p-4 backdrop-blur-md shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--primary)_25%,transparent)]">
            <div className="text-sm" aria-live="polite" aria-atomic="true">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Live preview</div>
              <div className="font-display text-2xl font-semibold text-foreground">
                {result.impactScore.toFixed(2)}<span className="text-base font-sans font-normal text-muted-foreground">/5</span>{" "}
                <span className="text-base font-sans font-normal text-muted-foreground">
                  · {result.tier.label}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="min-h-11 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Calculate SROI →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

interface QuestionCardProps {
  index: number;
  question: (typeof questions)[number];
  value: number;
  onChange: (v: number) => void;
}

function QuestionCard({ index, question: q, value, onChange }: QuestionCardProps) {
  const pillar = q.pillar;

  return (
    <div className="grain rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <span className="font-display text-3xl font-semibold text-primary/25">
            {String(index).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-display text-xl font-semibold leading-tight text-foreground">
              {q.label}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{q.helper}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${pillarText[pillar]}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${pillarColor[pillar]}`} />
          {pillarLabels[pillar]}
        </span>
      </div>

      <div className="mt-5">
        {q.type === "currency" || q.type === "number" ? (
          <NumberInput question={q} value={value} onChange={onChange} />
        ) : q.type === "percent" ? (
          <SliderInput question={q} value={value} onChange={onChange} format={(v) => `${v}%`} />
        ) : (
          <SliderInput question={q} value={value} onChange={onChange} format={(v) => `${v} / 10`} />
        )}
      </div>
    </div>
  );
}

function NumberInput({
  question: q,
  value,
  onChange,
}: {
  question: (typeof questions)[number];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {q.unit && <span className="font-display text-2xl text-muted-foreground">{q.unit}</span>}
      <input
        type="number"
        min={q.min}
        step={q.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 font-display text-2xl font-semibold text-foreground outline-none ring-primary/30 transition focus:border-primary focus:ring-2"
      />
    </div>
  );
}

function SliderInput({
  question: q,
  value,
  onChange,
  format,
}: {
  question: (typeof questions)[number];
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-display text-3xl font-semibold text-foreground">{format(value)}</span>
        <span className="text-xs text-muted-foreground">
          {q.min} — {q.max}
        </span>
      </div>
      <input
        type="range"
        min={q.min}
        max={q.max}
        step={q.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
    </div>
  );
}

/* ───────────────────────── Results ───────────────────────── */

function ResultsView({
  result,
  onBack,
  onReset,
}: {
  result: SroiResult;
  onBack: () => void;
  onReset: () => void;
}) {
  // Gauge maps the 0–5 social impact score across a 180° arc.
  const max = 5;
  const scoreCapped = Math.min(result.impactScore, max);
  const angle = -90 + (scoreCapped / max) * 180;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <button
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Edit answers
      </button>

      <div className="mt-8 grid items-start gap-12 lg:grid-cols-12">
        {/* Gauge */}
        <div className="lg:col-span-7">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Social Impact Score</div>
          <h1 className="mt-2 font-display text-6xl font-semibold leading-none text-foreground sm:text-7xl">
            {result.impactScore.toFixed(2)}<span className="text-primary/40">/5</span>
          </h1>

          <div className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${tierColor[result.tier.band]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {result.tier.label}
          </div>

          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            {result.tier.description}
          </p>

          <div className="relative mt-10 aspect-[2/1] w-full max-w-md">
            <svg viewBox="0 0 200 110" className="h-full w-full">
              <defs>
                <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.65 0.04 150)" />
                  <stop offset="50%" stopColor="oklch(0.78 0.13 75)" />
                  <stop offset="100%" stopColor="oklch(0.55 0.1 145)" />
                </linearGradient>
              </defs>
              <path
                d="M 15 100 A 85 85 0 0 1 185 100"
                fill="none"
                stroke="url(#arc)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {[
                { x: 15, y: 108, label: "0" },
                { x: 60, y: 30, label: "2" },
                { x: 140, y: 30, label: "4" },
                { x: 185, y: 108, label: "5" },
              ].map((t) => (
                <text key={t.label} x={t.x} y={t.y} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
                  {t.label}
                </text>
              ))}
              <g transform={`translate(100 100) rotate(${angle})`}>
                <line x1="0" y1="0" x2="0" y2="-78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-foreground" />
                <circle r="6" className="fill-primary" />
              </g>
            </svg>
          </div>
        </div>

        {/* Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">SROI</div>
              <div className="mt-1 font-display text-3xl font-semibold text-foreground">
                {Math.round(result.sroiPercent)}%
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                ${(result.sroiPercent / 100).toFixed(2)} per $1 invested
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Raw total</div>
              <div className="mt-1 font-display text-3xl font-semibold text-foreground">
                {result.rawTotal.toFixed(0)}
                <span className="text-base text-muted-foreground"> /100</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">÷ 20 → impact score</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Pillar breakdown</div>
            <ul className="mt-4 space-y-4">
              {(Object.keys(pillarWeights) as Array<keyof typeof pillarWeights>).map((p) => {
                const score = result.pillarScores[p];
                const pct = (score / 10) * 100;
                return (
                  <li key={p}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className={`font-medium ${pillarText[p]}`}>{pillarLabels[p]}</span>
                      <span className="text-muted-foreground">
                        {score.toFixed(1)}/10
                      </span>
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
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Capital invested</div>
              <div className="mt-1 font-display text-2xl font-semibold text-foreground">
                {formatCurrency(result.capital)}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Total social return</div>
              <div className="mt-1 font-display text-2xl font-semibold text-primary">
                {formatCurrency(result.totalReturn)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onBack}
              className="rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              Refine answers
            </button>
            <button
              onClick={onReset}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Start over
            </button>
          </div>
        </div>
      </div>

      {/* Tier scale */}
      <div className="mt-16 rounded-3xl border border-border bg-card/60 p-6">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Rating scale</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-5">
          {[
            { band: "loss" as const, range: "1.0", label: "Value Loss", desc: "Negative or zero social impact." },
            { band: "aware" as const, range: "2.0", label: "Impact Aware", desc: "Minimal positive impact." },
            { band: "creating" as const, range: "3.0", label: "Value Creating", desc: "Solid, positive externalities." },
            { band: "leader" as const, range: "4.0", label: "Impact Leader", desc: "High social/environmental performance." },
            { band: "transformative" as const, range: "5.0", label: "Transformative", desc: "Exceptional impact across all pillars." },
          ].map((t) => {
            const active = result.tier.band === t.band;
            return (
              <div
                key={t.band}
                className={`rounded-2xl border p-5 transition ${active ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${tierColor[t.band]}`}>
                  {t.range}
                </div>
                <div className="mt-3 font-display text-lg font-semibold text-foreground">{t.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

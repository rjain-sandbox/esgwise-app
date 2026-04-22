import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  dnaQuestions,
  calculateDna,
  quadrants,
  type DnaResult,
} from "@/lib/investorDna";

function defaults(): Record<string, number> {
  const d: Record<string, number> = {};
  for (const q of dnaQuestions) d[q.id] = 5;
  return d;
}

export function InvestorDna() {
  const [answers, setAnswers] = useState<Record<string, number>>(defaults);
  const [showResult, setShowResult] = useState(false);

  const result: DnaResult = useMemo(() => calculateDna(answers), [answers]);

  const setAnswer = (id: string, value: number) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  if (showResult) {
    return <ResultView result={result} onReset={() => setShowResult(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Tool 01 · Investor DNA
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            What kind of investor are you?
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Ten quick questions map you onto two axes — how you think about money, and how
            much your values shape where it goes. You'll land in one of four quadrants.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowResult(true);
          }}
        >
          <ol className="space-y-8">
            {dnaQuestions.map((q, i) => {
              const inputId = `dna-${q.id}`;
              const helpId = `dna-${q.id}-help`;
              return (
                <li
                  key={q.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p id={helpId} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} ·{" "}
                      {q.axis === "money" ? "Money focus" : "Values focus"}
                    </p>
                  </div>
                  <label htmlFor={inputId} className="mt-2 block font-display text-lg font-medium leading-snug cursor-pointer">
                    <span className="sr-only">Question {i + 1}: </span>
                    {q.prompt}
                  </label>

                  <div className="mt-6">
                    <input
                      id={inputId}
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={answers[q.id] ?? 5}
                      onChange={(e) => setAnswer(q.id, Number(e.target.value))}
                      className="w-full accent-primary"
                      aria-describedby={helpId}
                      aria-valuetext={`${answers[q.id] ?? 5} of 10. ${q.left} to ${q.right}`}
                    />
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span aria-hidden="true">{q.left}</span>
                      <span className="font-mono text-foreground" aria-hidden="true">
                        {answers[q.id] ?? 5}/10
                      </span>
                      <span aria-hidden="true">{q.right}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/"
              className="min-h-11 inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-center text-sm text-muted-foreground transition hover:bg-muted"
            >
              Back to dashboard
            </Link>
            <button
              type="submit"
              className="min-h-11 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Reveal my Investor DNA →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function ResultView({ result, onReset }: { result: DnaResult; onReset: () => void }) {
  const { moneyScore, valuesScore, quadrant } = result;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Your result
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          You are <span className={quadrant.accent}>{quadrant.name}</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{quadrant.tagline}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Quadrant chart */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Your position
            </p>
            <div className="relative mt-6 aspect-square w-full">
              {/* Quadrant grid */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-xl border border-border">
                {quadrants
                  .slice()
                  .sort((a, b) => {
                    // top-left, top-right, bottom-left, bottom-right
                    const order = (q: typeof a) =>
                      (q.highValues ? 0 : 2) + (q.highMoney ? 1 : 0);
                    return order(a) - order(b);
                  })
                  .map((q) => (
                    <div
                      key={q.id}
                      className={`flex items-center justify-center p-3 text-center text-xs font-medium ${
                        q.id === quadrant.id
                          ? `${quadrant.bg} ${quadrant.accent}`
                          : "bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      {q.name}
                    </div>
                  ))}
              </div>

              {/* Axis lines */}
              <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" />
              <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />

              {/* Marker */}
              <div
                className="absolute h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-background bg-foreground shadow-lg"
                style={{
                  left: `${moneyScore}%`,
                  bottom: `${valuesScore}%`,
                }}
                aria-label="Your position"
              />
            </div>

            {/* Axis labels */}
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>← Safety</span>
              <span className="font-mono text-foreground">Money focus</span>
              <span>Growth →</span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>↓ Profit only</span>
              <span className="font-mono text-foreground">Values focus</span>
              <span>Values-led ↑</span>
            </div>
          </div>

          {/* Description + scores */}
          <div className="space-y-6">
            <div className={`rounded-2xl border border-border ${quadrant.bg} p-6`}>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Your archetype
              </p>
              <h2 className={`mt-2 font-display text-2xl font-semibold ${quadrant.accent}`}>
                {quadrant.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {quadrant.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ScoreCard label="Money focus" score={moneyScore} hint="0 = Safety · 100 = Growth" />
              <ScoreCard label="Values focus" score={valuesScore} hint="0 = Profit · 100 = Values" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="rounded-full border border-border px-5 py-2.5 text-center text-sm text-muted-foreground transition hover:bg-muted"
          >
            Back to dashboard
          </Link>
          <button
            onClick={onReset}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Retake the quiz
          </button>
        </div>
      </main>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  hint,
}: {
  label: string;
  score: number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
        {Math.round(score)}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  dnaQuestions,
  calculateDna,
  quadrants,
  type DnaResult,
} from "@/lib/investorDna";
import { useI18n } from "@/lib/i18n";

function defaults(): Record<string, number> {
  const d: Record<string, number> = {};
  for (const q of dnaQuestions) d[q.id] = 5;
  return d;
}

export function InvestorDna() {
  const { t } = useI18n();
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
            {t("dna.eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("dna.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{t("dna.lead")}</p>
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
              const left = t(q.leftKey);
              const right = t(q.rightKey);
              return (
                <li key={q.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <p id={helpId} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} ·{" "}
                      {q.axis === "money" ? t("dna.moneyAxis") : t("dna.valuesAxis")}
                    </p>
                  </div>
                  <label htmlFor={inputId} className="mt-2 block font-display text-lg font-medium leading-snug cursor-pointer">
                    <span className="sr-only">{t("dna.questionN")} {i + 1}: </span>
                    {t(q.promptKey)}
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
                      aria-valuetext={`${answers[q.id] ?? 5} ${t("dna.outOf10")}. ${left} → ${right}`}
                    />
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span aria-hidden="true">{left}</span>
                      <span className="font-mono text-foreground" aria-hidden="true">
                        {answers[q.id] ?? 5}/10
                      </span>
                      <span aria-hidden="true">{right}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="min-h-11 inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-center text-sm text-muted-foreground transition hover:bg-muted">
              {t("common.back")}
            </Link>
            <button type="submit" className="min-h-11 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
              {t("dna.submit")}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function ResultView({ result, onReset }: { result: DnaResult; onReset: () => void }) {
  const { t } = useI18n();
  const { moneyScore, valuesScore, quadrant } = result;
  const quadName = t(quadrant.nameKey);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("dna.resultEyebrow")}
        </p>
        <h1 aria-live="polite" className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("dna.youAre")} <span className={quadrant.accent}>{quadName}</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{t(quadrant.taglineKey)}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <figure className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <figcaption className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("dna.position")}
            </figcaption>
            <div
              className="relative mt-6 aspect-square w-full"
              role="img"
              aria-label={`${t("dna.score.money")} ${Math.round(moneyScore)}/100, ${t("dna.score.values")} ${Math.round(valuesScore)}/100. ${quadName}.`}
            >
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-xl border border-border" aria-hidden="true">
                {quadrants
                  .slice()
                  .sort((a, b) => {
                    const order = (q: typeof a) => (q.highValues ? 0 : 2) + (q.highMoney ? 1 : 0);
                    return order(a) - order(b);
                  })
                  .map((q) => (
                    <div
                      key={q.id}
                      className={`flex items-center justify-center p-3 text-center text-xs font-medium ${
                        q.id === quadrant.id ? `${quadrant.bg} ${quadrant.accent}` : "bg-muted/30 text-foreground"
                      }`}
                    >
                      {t(q.nameKey)}
                    </div>
                  ))}
              </div>
              <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" aria-hidden="true" />
              <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" aria-hidden="true" />
              <div
                aria-hidden="true"
                className="absolute h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-background bg-foreground shadow-lg"
                style={{ left: `${moneyScore}%`, bottom: `${valuesScore}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>{t("dna.axis.safety")}</span>
              <span className="font-mono text-foreground">{t("dna.score.money")}</span>
              <span>{t("dna.axis.growth")}</span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>{t("dna.axis.profit")}</span>
              <span className="font-mono text-foreground">{t("dna.score.values")}</span>
              <span>{t("dna.axis.values")}</span>
            </div>
          </figure>

          <div className="space-y-6">
            <div className={`rounded-2xl border border-border ${quadrant.bg} p-6`}>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {t("dna.archetype")}
              </p>
              <h2 className={`mt-2 font-display text-2xl font-semibold ${quadrant.accent}`}>
                {quadName}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                {t(quadrant.descriptionKey)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ScoreCard label={t("dna.score.money")} score={moneyScore} hint={t("dna.score.moneyHint")} />
              <ScoreCard label={t("dna.score.values")} score={valuesScore} hint={t("dna.score.valuesHint")} />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="min-h-11 inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-center text-sm text-muted-foreground transition hover:bg-muted">
            {t("common.back")}
          </Link>
          <button type="button" onClick={onReset} className="min-h-11 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            {t("common.retake")}
          </button>
        </div>
      </main>
    </div>
  );
}

function ScoreCard({ label, score, hint }: { label: string; score: number; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{Math.round(score)}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

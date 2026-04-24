import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  footprintQuestions,
  footprintAreas,
  footprintLevels,
  calculateFootprint,
  type FootprintResult,
} from "@/lib/carbonFootprint";
import { useI18n } from "@/lib/i18n";

const accentBg: Record<string, string> = {
  moss: "bg-moss/15 text-moss-text border-moss/30",
  sky: "bg-sky/15 text-sky-text border-sky/30",
  ochre: "bg-ochre/15 text-ochre-text border-ochre/30",
  clay: "bg-clay/15 text-clay-text border-clay/30",
};

function defaults(): Record<string, number> {
  const d: Record<string, number> = {};
  for (const q of footprintQuestions) d[q.id] = 5;
  return d;
}

export function CarbonFootprint() {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, number>>(defaults);
  const [showResult, setShowResult] = useState(false);
  const result: FootprintResult = useMemo(() => calculateFootprint(answers), [answers]);
  const setAnswer = (id: string, value: number) => setAnswers((prev) => ({ ...prev, [id]: value }));

  if (showResult) return <ResultView result={result} onReset={() => setShowResult(false)} />;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("fp.eyebrow")}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t("fp.title")}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{t("fp.lead")}</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setShowResult(true); }}>
          {footprintAreas.map((area) => {
            const areaQs = footprintQuestions.filter((q) => q.area === area.id);
            return (
              <section key={area.id} aria-labelledby={`area-${area.id}`} className="mb-10">
                <header className="mb-4 flex items-baseline gap-3">
                  <h2 id={`area-${area.id}`} className="font-display text-2xl font-semibold">
                    {t(area.nameKey)}
                  </h2>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t(area.subtitleKey)}
                  </span>
                </header>
                <ol className="space-y-6">
                  {areaQs.map((q) => {
                    const qIndex = footprintQuestions.findIndex((x) => x.id === q.id);
                    const inputId = `fp-${q.id}`;
                    return (
                      <li key={q.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <label htmlFor={inputId} className="mb-4 flex gap-3">
                          <span className="font-mono text-sm text-muted-foreground" aria-hidden="true">
                            {String(qIndex + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-lg font-medium leading-snug">
                            {t(q.promptKey)}
                          </span>
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            id={inputId}
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            value={answers[q.id]}
                            onChange={(e) => setAnswer(q.id, Number(e.target.value))}
                            aria-describedby={`${inputId}-help`}
                            aria-valuetext={`${answers[q.id]} / 10`}
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-primary/20 accent-primary"
                          />
                          <span aria-hidden="true" className="w-10 shrink-0 text-right font-mono text-base font-semibold tabular-nums text-foreground">
                            {answers[q.id]}
                          </span>
                        </div>
                        <p id={`${inputId}-help`} className="mt-2 flex justify-between gap-4 text-xs text-muted-foreground">
                          <span>1 — {t(q.lowKey)}</span>
                          <span>10 — {t(q.highKey)}</span>
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{t("fp.helper")}</p>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90">
              {t("fp.submit")}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function ResultView({ result, onReset }: { result: FootprintResult; onReset: () => void }) {
  const { t } = useI18n();
  const accent = accentBg[result.level.accent];
  const pct = (result.normalized / 10) * 100;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("fp.resultEyebrow")}</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl" aria-live="polite">
          {t(result.level.nameKey)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t(result.level.meaningKey)}</p>

        <section aria-labelledby="score-heading" className={`mt-10 rounded-3xl border p-8 ${accent}`}>
          <h2 id="score-heading" className="sr-only">{t("fp.resultEyebrow")}</h2>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-7xl font-semibold tabular-nums">{result.normalized}</span>
            <span className="font-mono text-sm uppercase tracking-widest opacity-70">{t("fp.outOf10Lower")}</span>
          </div>
          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-foreground/10" role="img" aria-label={`${result.normalized}/10`}>
            <div className="h-full rounded-full bg-current transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-4 font-mono text-xs opacity-70">{t("fp.raw")}: {result.rawTotal} / 120</p>
        </section>

        <section aria-labelledby="area-heading" className="mt-12">
          <h2 id="area-heading" className="font-display text-2xl font-semibold">{t("fp.areaTitle")}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {footprintAreas.map((area) => (
              <div key={area.id} className="rounded-2xl border border-border bg-card p-5">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t(area.subtitleKey)}
                </dt>
                <dd className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-semibold tabular-nums">{result.areaScores[area.id]}</span>
                  <span className="font-mono text-xs text-muted-foreground">/ 10</span>
                </dd>
                <p className="mt-1 text-sm text-foreground">{t(area.nameKey)}</p>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="scale-heading" className="mt-12">
          <h2 id="scale-heading" className="font-display text-2xl font-semibold">{t("fp.scale")}</h2>
          <ol className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {footprintLevels.map((lvl) => {
              const active = lvl.score === result.normalized;
              return (
                <li key={lvl.score} className={`flex items-start gap-4 px-5 py-3 ${active ? "bg-primary/5" : ""}`} aria-current={active ? "true" : undefined}>
                  <span className="w-6 shrink-0 font-mono text-sm tabular-nums text-muted-foreground">{lvl.score}</span>
                  <div>
                    <p className={`font-medium ${active ? "text-primary" : "text-foreground"}`}>{t(lvl.nameKey)}</p>
                    <p className="text-sm text-muted-foreground">{t(lvl.meaningKey)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={onReset} className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-5 py-2 text-sm font-medium hover:bg-muted">
            {t("common.retake")}
          </button>
          <Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            {t("common.back")}
          </Link>
        </div>
      </main>
    </div>
  );
}

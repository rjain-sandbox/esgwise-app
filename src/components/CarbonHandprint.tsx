import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  handprintQuestions,
  frequencyOptions,
  calculateHandprint,
  handprintLevels,
  type HandprintAnswer,
  type HandprintResult,
} from "@/lib/carbonHandprint";
import { useI18n } from "@/lib/i18n";

function defaults(): Record<string, HandprintAnswer> {
  const d: Record<string, HandprintAnswer> = {};
  for (const q of handprintQuestions) {
    if (q.type === "scale") d[q.id] = 5;
    else d[q.id] = null;
  }
  return d;
}

const accentBg: Record<string, string> = {
  moss: "bg-moss/15 text-moss-text border-moss/30",
  sky: "bg-sky/15 text-sky-text border-sky/30",
  ochre: "bg-ochre/15 text-ochre-text border-ochre/30",
  clay: "bg-clay/15 text-clay-text border-clay/30",
};

export function CarbonHandprint() {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, HandprintAnswer>>(defaults);
  const [showResult, setShowResult] = useState(false);
  const result: HandprintResult = useMemo(() => calculateHandprint(answers), [answers]);
  const setAnswer = (id: string, value: HandprintAnswer) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const allAnswered = handprintQuestions.every((q) => {
    const a = answers[q.id];
    return a !== null && a !== undefined;
  });

  if (showResult) return <ResultView result={result} onReset={() => setShowResult(false)} />;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("hp.eyebrow")}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t("hp.title")}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{t("hp.lead")}</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setShowResult(true); }}>
          <ol className="space-y-8">
            {handprintQuestions.map((q, i) => {
              const groupId = `hp-${q.id}`;
              return (
                <li key={q.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <fieldset>
                    <legend className="mb-4 flex gap-3">
                      <span className="font-mono text-sm text-muted-foreground" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-lg font-medium leading-snug">{t(q.promptKey)}</span>
                    </legend>
                    {q.type === "scale" && (
                      <ScaleInput
                        id={groupId}
                        value={(answers[q.id] as number) ?? 5}
                        help={q.helpKey ? t(q.helpKey) : "1 — 10"}
                        onChange={(v) => setAnswer(q.id, v)}
                      />
                    )}
                    {q.type === "yesno" && (
                      <ChoiceGroup
                        name={groupId}
                        value={answers[q.id] as string | null}
                        options={[
                          { value: "yes", label: t("hp.yes") },
                          { value: "no", label: t("hp.no") },
                        ]}
                        onChange={(v) => setAnswer(q.id, v as HandprintAnswer)}
                      />
                    )}
                    {q.type === "frequency" && (
                      <ChoiceGroup
                        name={groupId}
                        value={answers[q.id] as string | null}
                        options={frequencyOptions.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
                        onChange={(v) => setAnswer(q.id, v as HandprintAnswer)}
                      />
                    )}
                  </fieldset>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {allAnswered ? t("hp.helperReady") : t("hp.helperPending")}
            </p>
            <button type="submit" disabled={!allAnswered} className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50">
              {t("hp.submit")}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function ScaleInput({ id, value, help, onChange }: { id: string; value: number; help: string; onChange: (v: number) => void }) {
  const helpId = `${id}-help`;
  return (
    <div>
      <div className="flex items-center gap-4">
        <input
          id={id}
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-describedby={helpId}
          aria-valuetext={`${value} / 10`}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-primary/20 accent-primary"
        />
        <span aria-hidden="true" className="w-10 shrink-0 text-right font-mono text-base font-semibold tabular-nums text-foreground">{value}</span>
      </div>
      <p id={helpId} className="mt-2 text-xs text-muted-foreground">{help}</p>
    </div>
  );
}

function ChoiceGroup({ name, value, options, onChange }: {
  name: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const checked = value === opt.value;
        const inputId = `${name}-${opt.value}`;
        return (
          <label key={opt.value} htmlFor={inputId} className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-5 py-2 text-sm font-medium transition ${
            checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/50"
          }`}>
            <input id={inputId} type="radio" name={name} value={opt.value} checked={checked} onChange={() => onChange(opt.value)} className="sr-only" />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

function ResultView({ result, onReset }: { result: HandprintResult; onReset: () => void }) {
  const { t } = useI18n();
  const accent = accentBg[result.level.accent];
  const pct = (result.normalized / 10) * 100;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("hp.resultEyebrow")}</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl" aria-live="polite">
          {t(result.level.nameKey)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t(result.level.meaningKey)}</p>

        <section aria-labelledby="score-heading" className={`mt-10 rounded-3xl border p-8 ${accent}`}>
          <h2 id="score-heading" className="sr-only">{t("hp.resultEyebrow")}</h2>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-7xl font-semibold tabular-nums">{result.normalized}</span>
            <span className="font-mono text-sm uppercase tracking-widest opacity-70">{t("hp.outOf10")}</span>
          </div>
          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-foreground/10" role="img" aria-label={`${result.normalized}/10`}>
            <div className="h-full rounded-full bg-current transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-4 font-mono text-xs opacity-70">{t("hp.raw")}: {result.rawTotal} / 100</p>
        </section>

        <section aria-labelledby="scale-heading" className="mt-12">
          <h2 id="scale-heading" className="font-display text-2xl font-semibold">{t("hp.scale")}</h2>
          <ol className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {handprintLevels.map((lvl) => {
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

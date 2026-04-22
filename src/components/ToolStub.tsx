import { Link } from "@tanstack/react-router";
import { SiteHeader } from "./SiteHeader";

interface ToolStubProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  accent: "moss" | "ochre" | "clay" | "sky";
}

const accentMap: Record<ToolStubProps["accent"], string> = {
  moss: "bg-moss",
  ochre: "bg-ochre",
  clay: "bg-clay",
  sky: "bg-sky",
};

export function ToolStub({ eyebrow, title, description, bullets, accent }: ToolStubProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to dashboard
        </Link>
        <div className="mt-8 flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${accentMap[accent]}`} aria-hidden="true" />
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>
        </div>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2">
          {bullets.map((b, i) => (
            <li key={i} className="bg-card p-6">
              <div className="font-display text-3xl text-primary/40" aria-hidden="true">{String(i + 1).padStart(2, "0")}</div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{b}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="min-h-11 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground opacity-70 cursor-not-allowed"
          >
            Coming soon
          </button>
          <span className="text-sm text-muted-foreground">This tool is in active development.</span>
        </div>
      </main>
    </div>
  );
}

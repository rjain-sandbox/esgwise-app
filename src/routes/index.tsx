import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { tools, type ToolAccent } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ESGwise — ESG Toolkit for investors and individuals" },
      {
        name: "description",
        content:
          "Five sharp tools to understand, measure and improve your ESG impact: Investor DNA, ESGpt, SROI Calculator, Carbon Footprint and Carbon Handprint.",
      },
      { property: "og:title", content: "ESGwise — ESG Toolkit" },
      {
        property: "og:description",
        content: "Investor DNA, ESGpt, SROI, Carbon Footprint and Handprint — all in one place.",
      },
    ],
  }),
  component: Index,
});

const accentBg: Record<ToolAccent, string> = {
  moss: "bg-moss",
  ochre: "bg-ochre",
  clay: "bg-clay",
  sky: "bg-sky",
};

const accentSoft: Record<ToolAccent, string> = {
  moss: "bg-moss/10 text-moss",
  ochre: "bg-ochre/15 text-ochre",
  clay: "bg-clay/15 text-clay",
  sky: "bg-sky/15 text-sky",
};

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content">
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-moss" aria-hidden="true" />
                A toolkit for thoughtful capital
              </span>
              <h1 id="hero-heading" className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[1.02] text-foreground">
                Measure what
                <br />
                <span className="italic text-primary">actually matters.</span>
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Five focused instruments for investors and individuals to understand their ESG profile,
                quantify impact, and put numbers behind values.
              </p>
              <a
                href="#tools"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Explore the toolkit
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-border/80 sm:grid-cols-3">
            {[
              { k: "5", v: "Specialist tools" },
              { k: "2 min", v: "To your first insight" },
              { k: "100%", v: "Framework-aligned (GRI, SASB, SFDR)" },
            ].map((s) => (
              <div key={s.v} className="grain bg-card p-6">
                <div className="font-display text-4xl font-semibold text-primary">{s.k}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" aria-labelledby="tools-heading" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">The toolkit</div>
            <h2 id="tools-heading" className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              Five tools, one practice.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Each tool stands alone — together they form a complete picture of your ESG posture.
          </p>
        </div>

        <ul className="grid gap-5 md:grid-cols-2">
          {tools.map((tool, i) => (
            <li key={tool.slug} className={i === 0 ? "md:col-span-2" : ""}>
              <Link
                to="/tools/$slug"
                params={{ slug: tool.slug }}
                className="group relative grain block h-full overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--primary)_30%,transparent)]"
              >
                <div className="flex items-start justify-between">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${accentSoft[tool.accent]}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${accentBg[tool.accent]}`} />
                    {tool.meta}
                  </span>
                  <span className="font-display text-5xl font-semibold text-primary/15 transition-colors group-hover:text-primary/30">
                    {tool.number}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-3xl font-semibold leading-tight text-foreground">
                  {tool.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary/70">{tool.tagline}</p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>

                <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  Open tool
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </div>

                <div className={`absolute -bottom-16 -right-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30 ${accentBg[tool.accent]}`} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* About */}
      <section id="about" aria-labelledby="about-heading" className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Why ESGwise</div>
            <h2 id="about-heading" className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground">
              ESG without the
              <br />
              <span className="italic">jargon tax.</span>
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground lg:col-span-7">
            <p>
              Most ESG products serve compliance teams. ESGwise is built for the people writing the cheques —
              and the people whose lives those cheques affect. Plain language, defensible numbers, no
              dashboards bloated with vanity metrics.
            </p>
            <p>
              Each tool is opinionated about what to measure and transparent about how. You can defend every
              number to a board, a partner, or your future self.
            </p>
          </div>
        </div>
      </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} ESGwise Toolkit</div>
          <div className="font-display italic">Capital with conscience.</div>
        </div>
      </footer>
    </div>
  );
}

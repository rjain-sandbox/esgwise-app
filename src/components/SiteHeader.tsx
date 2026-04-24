import { Link } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/lib/i18n";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();

  return (
    <>
      {/* WCAG 2.4.1 — Bypass blocks */}
      <a href="#main-content" className="skip-link">
        {t("nav.skip")}
      </a>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-2.5" aria-label={t("nav.home")}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" focusable="false">
                <path d="M12 3c-4 4-6 7-6 11a6 6 0 0 0 12 0c0-4-2-7-6-11Z" />
                <path d="M12 14v7" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold text-foreground">ESGwise</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("header.tagline")}</div>
            </div>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground", "aria-current": "page" }}
              className="hover:text-foreground transition-colors"
            >
              {t("nav.dashboard")}
            </Link>
            <a href="/#tools" className="hover:text-foreground transition-colors">{t("nav.tools")}</a>
            <a href="/#about" className="hover:text-foreground transition-colors">{t("nav.about")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LangToggle lang={lang} setLang={setLang} label={t("lang.label")} />
            <a
              href="/#tools"
              className="hidden min-h-11 items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              {t("nav.getStarted")}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

function LangToggle({
  lang,
  setLang,
  label,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-medium"
    >
      {(["en", "de"] as const).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={`min-h-8 rounded-full px-3 py-1.5 uppercase tracking-wider transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

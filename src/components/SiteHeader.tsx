import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <>
      {/* WCAG 2.4.1 — Bypass blocks */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-2.5" aria-label="ESGwise home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" focusable="false">
                <path d="M12 3c-4 4-6 7-6 11a6 6 0 0 0 12 0c0-4-2-7-6-11Z" />
                <path d="M12 14v7" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold text-foreground">ESGwise</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">ESG Toolkit</div>
            </div>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground", "aria-current": "page" }}
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <a href="/#tools" className="hover:text-foreground transition-colors">Tools</a>
            <a href="/#about" className="hover:text-foreground transition-colors">About</a>
          </nav>
          <a
            href="/#tools"
            className="hidden min-h-11 items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Get started
          </a>
        </div>
      </header>
    </>
  );
}

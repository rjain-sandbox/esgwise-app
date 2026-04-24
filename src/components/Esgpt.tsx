import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findAnswer, knowledgeCount } from "@/lib/esgpt";
import { useI18n, type TranslationKey } from "@/lib/i18n";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  matchedQuestion?: string;
}

const QUICK_KEYS: TranslationKey[] = [
  "esgpt.qs.carbonFootprint",
  "esgpt.qs.sroi",
  "esgpt.qs.scope1",
  "esgpt.qs.greenwashing",
  "esgpt.qs.netZero",
  "esgpt.qs.paris",
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function Esgpt() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);

  // Reset welcome message when language changes
  useEffect(() => {
    setMessages([{ id: "welcome", role: "assistant", content: t("esgpt.welcome") }]);
  }, [lang, t]);

  const termCount = useMemo(() => knowledgeCount(lang), [lang]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const outcome = findAnswer(text, lang);
    const reply = outcome.inScope && outcome.answer ? outcome.answer : t("esgpt.fallback");
    const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
    const botMsg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: reply,
      matchedQuestion: outcome.matched?.question,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
    if (liveRef.current) liveRef.current.textContent = reply;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("common.back")}
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside aria-label="ESGpt" className="space-y-6">
            <section aria-labelledby="kb-stats" className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 id="kb-stats" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("esgpt.kbStats")}
              </h2>
              <div className="mt-3">
                <div className="font-display text-4xl font-semibold text-foreground">{termCount}</div>
                <p className="mt-1 text-sm text-muted-foreground">{t("esgpt.kbCount")}</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-moss" aria-hidden="true" />
                {t("esgpt.local")}
              </div>
            </section>

            <section aria-labelledby="quick-start" className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 id="quick-start" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("esgpt.quickStart")}
              </h2>
              <ul className="mt-3 space-y-2">
                {QUICK_KEYS.map((k) => {
                  const label = t(k);
                  return (
                    <li key={k}>
                      <button
                        type="button"
                        onClick={() => send(lang === "de" ? `Was ist ${label}?` : `What is ${label}?`)}
                        className="w-full min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>

          <section aria-labelledby="esgpt-title" className="flex h-[70vh] min-h-[520px] flex-col rounded-2xl border border-border bg-card shadow-sm">
            <header className="border-b border-border p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("esgpt.eyebrow")}</p>
              <h1 id="esgpt-title" className="font-display text-2xl font-semibold text-foreground">{t("esgpt.title")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("esgpt.lead")}</p>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5" aria-label="Conversation">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} botLabel={t("esgpt.bot")} matchedLabel={t("esgpt.matched")} />
              ))}
            </div>

            <div ref={liveRef} aria-live="polite" className="sr-only" />

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border p-4" aria-label={t("esgpt.askLabel")}>
              <label htmlFor="esgpt-input" className="sr-only">{t("esgpt.askLabel")}</label>
              <Input
                id="esgpt-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("esgpt.placeholder")}
                className="h-11"
                autoComplete="off"
              />
              <Button type="submit" className="h-11 px-5" disabled={!input.trim()}>{t("esgpt.send")}</Button>
            </form>
          </section>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{t("esgpt.note")}</p>
      </main>
    </div>
  );
}

function MessageBubble({ message, botLabel, matchedLabel }: { message: ChatMessage; botLabel: string; matchedLabel: string }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={
        isUser
          ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground shadow-sm"
          : "max-w-[80%] rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm"
      }>
        {!isUser && (
          <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{botLabel}</div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {message.matchedQuestion && (
          <p className="mt-2 text-[11px] text-muted-foreground">{matchedLabel}: {message.matchedQuestion}</p>
        )}
      </div>
    </div>
  );
}

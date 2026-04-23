import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  knowledgeBase,
  findAnswer,
  quickStartTopics,
  FALLBACK_ANSWER,
} from "@/lib/esgpt";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  matchedQuestion?: string;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm ESGpt. Ask me about ESG terms, frameworks, or sustainability concepts. If I don't know something, I'll say so.",
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function Esgpt() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);

  const termCount = useMemo(() => knowledgeBase.length, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
    const { answer, matched } = findAnswer(text);
    const botMsg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: answer,
      matchedQuestion: matched?.question,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
    if (liveRef.current) liveRef.current.textContent = answer;
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
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside aria-label="ESGpt sidebar" className="space-y-6">
            <section
              aria-labelledby="kb-stats"
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <h2
                id="kb-stats"
                className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Knowledge Stats
              </h2>
              <div className="mt-3">
                <div className="font-display text-4xl font-semibold text-foreground">
                  {termCount}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  ESG terms in the local knowledge base
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-moss"
                  aria-hidden="true"
                />
                Local CSV · offline match
              </div>
            </section>

            <section
              aria-labelledby="quick-start"
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <h2
                id="quick-start"
                className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Quick Start
              </h2>
              <ul className="mt-3 space-y-2">
                {quickStartTopics.map((topic) => (
                  <li key={topic}>
                    <button
                      type="button"
                      onClick={() => send(`What is ${topic}?`)}
                      className="w-full min-h-11 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {topic}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          {/* Chat */}
          <section
            aria-labelledby="esgpt-title"
            className="flex h-[70vh] min-h-[520px] flex-col rounded-2xl border border-border bg-card shadow-sm"
          >
            <header className="border-b border-border p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Tool 02
              </p>
              <h1
                id="esgpt-title"
                className="font-display text-2xl font-semibold text-foreground"
              >
                ESGpt
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Conversational ESG intelligence — answers sourced from a curated local glossary.
              </p>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-5"
              aria-label="Conversation"
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>

            <div ref={liveRef} aria-live="polite" className="sr-only" />

            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-border p-4"
              aria-label="Send a message"
            >
              <label htmlFor="esgpt-input" className="sr-only">
                Ask ESGpt
              </label>
              <Input
                id="esgpt-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about an ESG term, e.g. What is SROI?"
                className="h-11"
                autoComplete="off"
              />
              <Button type="submit" className="h-11 px-5" disabled={!input.trim()}>
                Send
              </Button>
            </form>
          </section>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          ESGpt only responds with information found in the local knowledge base. Out-of-scope
          questions return: <em>"{FALLBACK_ANSWER}"</em>
        </p>
      </main>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground shadow-sm"
            : "max-w-[80%] rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm"
        }
      >
        {!isUser && (
          <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            ESGpt
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {message.matchedQuestion && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Matched: {message.matchedQuestion}
          </p>
        )}
      </div>
    </div>
  );
}

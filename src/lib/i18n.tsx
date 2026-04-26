import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "de";

/** Translation dictionary. Each key has both English and German strings. */
export const dict = {
  // Header
  "header.tagline": { en: "ESG Toolkit", de: "ESG-Toolkit" },
  "nav.dashboard": { en: "Dashboard", de: "Übersicht" },
  "nav.tools": { en: "Tools", de: "Werkzeuge" },
  "nav.about": { en: "About", de: "Über uns" },
  "nav.getStarted": { en: "Get started", de: "Loslegen" },
  "nav.skip": { en: "Skip to main content", de: "Zum Hauptinhalt springen" },
  "nav.home": { en: "ESGwise home", de: "ESGwise Startseite" },
  "lang.label": { en: "Language", de: "Sprache" },
  "lang.en": { en: "English", de: "Englisch" },
  "lang.de": { en: "German", de: "Deutsch" },

  // Common
  "common.back": { en: "← Back to dashboard", de: "← Zurück zur Übersicht" },
  "common.startOver": { en: "Start over", de: "Neu starten" },
  "common.retake": { en: "Retake the quiz", de: "Quiz erneut starten" },
  "common.refine": { en: "Refine answers", de: "Antworten anpassen" },
  "common.editAnswers": { en: "← Edit answers", de: "← Antworten bearbeiten" },

  // Index / Hero
  "index.hero.eyebrow": { en: "A toolkit for thoughtful capital", de: "Ein Toolkit für bewusstes Kapital" },
  "index.hero.titleA": { en: "Measure what", de: "Messen, was" },
  "index.hero.titleB": { en: "actually matters.", de: "wirklich zählt." },
  "index.hero.lead": {
    en: "Five focused instruments for investors and individuals to understand their ESG profile, quantify impact, and put numbers behind values.",
    de: "Fünf fokussierte Instrumente für Anleger:innen und Privatpersonen, um Ihr ESG-Profil zu verstehen, Wirkung zu quantifizieren und Werten Zahlen zu geben.",
  },
  "index.hero.explore": { en: "Explore the toolkit", de: "Toolkit entdecken" },
  "index.stat.tools": { en: "Specialist tools", de: "Spezialisierte Werkzeuge" },
  "index.stat.time": { en: "To your first insight", de: "Bis zur ersten Erkenntnis" },
  "index.stat.timeValue": { en: "2 min", de: "2 Min." },
  "index.stat.frameworks": { en: "Framework-aligned (GRI, SASB, SFDR)", de: "Standardkonform (GRI, SASB, SFDR)" },
  "index.tools.eyebrow": { en: "The toolkit", de: "Das Toolkit" },
  "index.tools.title": { en: "Five tools, one practice.", de: "Fünf Werkzeuge, eine Praxis." },
  "index.tools.lead": {
    en: "Each tool stands alone — together they form a complete picture of your ESG posture.",
    de: "Jedes Werkzeug funktioniert für sich – gemeinsam ergeben sie ein vollständiges Bild Ihrer ESG-Haltung.",
  },
  "index.tools.openTool": { en: "Open tool", de: "Werkzeug öffnen" },
  "index.about.eyebrow": { en: "Why ESGwise", de: "Warum ESGwise" },
  "index.about.titleA": { en: "ESG without the", de: "ESG ohne den" },
  "index.about.titleB": { en: "jargon tax.", de: "Fachjargon-Aufschlag." },
  "index.about.p1": {
    en: "Most ESG products serve compliance teams. ESGwise is built for the people writing the cheques — and the people whose lives those cheques affect. Plain language, defensible numbers, no dashboards bloated with vanity metrics.",
    de: "Die meisten ESG-Produkte richten sich an Compliance-Teams. ESGwise ist für die Menschen gemacht, die das Kapital bewegen – und für jene, deren Leben davon beeinflusst wird. Klare Sprache, belastbare Zahlen, keine aufgeblähten Dashboards.",
  },
  "index.about.p2": {
    en: "Each tool is opinionated about what to measure and transparent about how. You can defend every number to a board, a partner, or your future self.",
    de: "Jedes Werkzeug hat eine klare Meinung dazu, was gemessen wird, und ist transparent im Wie. Jede Zahl lässt sich gegenüber einem Vorstand, einer Partnerin oder Ihrem zukünftigen Ich begründen.",
  },
  "footer.tagline": { en: "Capital with conscience.", de: "Kapital mit Gewissen." },
  "footer.copy": { en: "ESGwise Toolkit", de: "ESGwise Toolkit" },

  // Tool meta (cards)
  "tool.investor-dna.name": { en: "Investor DNA", de: "Anleger-DNA" },
  "tool.investor-dna.tagline": { en: "Discover your ESG investor archetype", de: "Entdecken Sie Ihren ESG-Anlegertyp" },
  "tool.investor-dna.description": {
    en: "A short questionnaire that maps your values, risk appetite and impact priorities into a personalised investor profile.",
    de: "Ein kurzer Fragebogen, der Ihre Werte, Risikobereitschaft und Wirkungsprioritäten in ein persönliches Anlegerprofil überführt.",
  },
  "tool.investor-dna.meta": { en: "12 questions · 4 min", de: "12 Fragen · 4 Min." },

  "tool.esgpt.name": { en: "ESGpt", de: "ESGpt" },
  "tool.esgpt.tagline": { en: "Conversational ESG intelligence", de: "ESG-Wissen im Dialog" },
  "tool.esgpt.description": {
    en: "Ask anything about ratings, frameworks, regulations or specific companies. ESGpt cites sources and explains the why.",
    de: "Fragen Sie alles zu Ratings, Rahmenwerken, Vorschriften oder Unternehmen. ESGpt erklärt das Warum.",
  },
  "tool.esgpt.meta": { en: "Chat · Always on", de: "Chat · Immer verfügbar" },

  "tool.sroi.name": { en: "SROI Calculator", de: "SROI-Rechner" },
  "tool.sroi.tagline": { en: "Quantify social return on investment", de: "Sozialen Investitionsertrag quantifizieren" },
  "tool.sroi.description": {
    en: "Walk through inputs, outputs, outcomes and proxies to estimate how much social value each dollar of your investment creates.",
    de: "Schritt für Schritt durch Inputs, Outputs, Wirkungen und Hilfswerte – schätzen Sie, wie viel sozialen Wert jeder investierte Euro schafft.",
  },
  "tool.sroi.meta": { en: "Guided · 8 min", de: "Geführt · 8 Min." },

  "tool.carbon-footprint.name": { en: "Carbon Footprint", de: "CO₂-Fußabdruck" },
  "tool.carbon-footprint.tagline": { en: "Measure the emissions you cause", de: "Messen Sie die Emissionen, die Sie verursachen" },
  "tool.carbon-footprint.description": {
    en: "Estimate the tonnes of CO₂e produced by an individual, household or portfolio across scope 1, 2 and 3 categories.",
    de: "Schätzen Sie die CO₂e-Tonnen, die eine Person, ein Haushalt oder ein Portfolio in den Scopes 1, 2 und 3 verursacht.",
  },
  "tool.carbon-footprint.meta": { en: "Calculator · 5 min", de: "Rechner · 5 Min." },

  "tool.carbon-handprint.name": { en: "Carbon Handprint", de: "CO₂-Handabdruck" },
  "tool.carbon-handprint.tagline": { en: "Measure the emissions you avoid", de: "Messen Sie die Emissionen, die Sie vermeiden" },
  "tool.carbon-handprint.description": {
    en: "The positive twin of the footprint — quantify the CO₂e your choices and investments help the world avoid.",
    de: "Das positive Gegenstück zum Fußabdruck – quantifizieren Sie die CO₂e, die durch Ihre Entscheidungen vermieden werden.",
  },
  "tool.carbon-handprint.meta": { en: "Calculator · 5 min", de: "Rechner · 5 Min." },

  // Tool stub
  "stub.comingSoon": { en: "Coming soon", de: "Demnächst verfügbar" },
  "stub.development": { en: "This tool is in active development.", de: "Dieses Werkzeug wird derzeit entwickelt." },
  "stub.toolN": { en: "Tool", de: "Werkzeug" },

  // Investor DNA
  "dna.eyebrow": { en: "Tool 01 · Investor DNA", de: "Werkzeug 01 · Anleger-DNA" },
  "dna.title": { en: "What kind of investor are you?", de: "Welcher Anlegertyp sind Sie?" },
  "dna.lead": {
    en: "Ten quick questions map you onto two axes — how you think about money, and how much your values shape where it goes. You'll land in one of four quadrants.",
    de: "Zehn kurze Fragen verorten Sie auf zwei Achsen: wie Sie über Geld denken und wie sehr Ihre Werte mitentscheiden. Sie landen in einem von vier Quadranten.",
  },
  "dna.moneyAxis": { en: "Money focus", de: "Geld-Fokus" },
  "dna.valuesAxis": { en: "Values focus", de: "Werte-Fokus" },
  "dna.questionN": { en: "Question", de: "Frage" },
  "dna.submit": { en: "Reveal my Investor DNA →", de: "Meine Anleger-DNA anzeigen →" },
  "dna.resultEyebrow": { en: "Your result", de: "Ihr Ergebnis" },
  "dna.youAre": { en: "You are", de: "Sie sind" },
  "dna.position": { en: "Your position", de: "Ihre Position" },
  "dna.archetype": { en: "Your archetype", de: "Ihr Archetyp" },
  "dna.axis.safety": { en: "← Safety", de: "← Sicherheit" },
  "dna.axis.growth": { en: "Growth →", de: "Wachstum →" },
  "dna.axis.profit": { en: "↓ Profit only", de: "↓ Nur Gewinn" },
  "dna.axis.values": { en: "Values-led ↑", de: "Wertegeleitet ↑" },
  "dna.score.money": { en: "Money focus", de: "Geld-Fokus" },
  "dna.score.moneyHint": { en: "0 = Safety · 100 = Growth", de: "0 = Sicherheit · 100 = Wachstum" },
  "dna.score.values": { en: "Values focus", de: "Werte-Fokus" },
  "dna.score.valuesHint": { en: "0 = Profit · 100 = Values", de: "0 = Gewinn · 100 = Werte" },
  "dna.outOf10": { en: "of 10", de: "von 10" },
  // DNA questions
  "dna.q.growth": { en: "Growth: Would you rather grow your money fast or keep it safe?", de: "Wachstum: Möchten Sie Ihr Geld lieber schnell vermehren oder sicher anlegen?" },
  "dna.q.growth.left": { en: "Keep it safe", de: "Sicher anlegen" },
  "dna.q.growth.right": { en: "Grow it fast", de: "Schnell vermehren" },
  "dna.q.volatility": { en: "Ups & downs: If your $1,000 became $800 tomorrow, how would you feel?", de: "Auf und ab: Wenn aus 1.000 € morgen 800 € würden – wie fühlen Sie sich?" },
  "dna.q.volatility.left": { en: "I'd panic", de: "Ich würde in Panik geraten" },
  "dna.q.volatility.right": { en: "I'd stay calm", de: "Ich bliebe ruhig" },
  "dna.q.horizon": { en: "Patience: Are you investing for next year or for 20 years from now?", de: "Geduld: Investieren Sie für nächstes Jahr oder für die nächsten 20 Jahre?" },
  "dna.q.horizon.left": { en: "Next year", de: "Nächstes Jahr" },
  "dna.q.horizon.right": { en: "20+ years", de: "20+ Jahre" },
  "dna.q.liquidity": { en: "Quick cash: Do you need to pull money out anytime for emergencies?", de: "Schneller Zugriff: Müssen Sie jederzeit für Notfälle Geld abziehen können?" },
  "dna.q.liquidity.left": { en: "Yes, always", de: "Ja, immer" },
  "dna.q.liquidity.right": { en: "No, I can lock it up", de: "Nein, ich kann es binden" },
  "dna.q.income": { en: "Regular pay: Do you prefer small dividend checks every few months?", de: "Regelmäßige Auszahlung: Mögen Sie kleine Dividenden alle paar Monate?" },
  "dna.q.income.left": { en: "Yes, steady income", de: "Ja, stetiges Einkommen" },
  "dna.q.income.right": { en: "No, reinvest for growth", de: "Nein, lieber reinvestieren" },
  "dna.q.tradeoff": { en: "Giving back: Okay making $90 instead of $100 if it helped a good cause?", de: "Etwas zurückgeben: 90 € statt 100 € verdienen, wenn es einer guten Sache hilft?" },
  "dna.q.tradeoff.left": { en: "No, maximise returns", de: "Nein, Rendite maximieren" },
  "dna.q.tradeoff.right": { en: "Yes, gladly", de: "Ja, gerne" },
  "dna.q.exclusion": { en: "No-go zone: Should your money avoid 'bad' companies (tobacco, weapons)?", de: "Tabuzone: Soll Ihr Geld „schlechte“ Branchen meiden (Tabak, Waffen)?" },
  "dna.q.exclusion.left": { en: "Doesn't matter", de: "Spielt keine Rolle" },
  "dna.q.exclusion.right": { en: "Absolutely", de: "Unbedingt" },
  "dna.q.climate": { en: "Earth first: Do you care if a company is fighting pollution & climate change?", de: "Erde zuerst: Ist es Ihnen wichtig, wenn ein Unternehmen aktiv gegen Klimawandel kämpft?" },
  "dna.q.climate.left": { en: "Not really", de: "Eher nicht" },
  "dna.q.climate.right": { en: "Very much", de: "Sehr" },
  "dna.q.fairness": { en: "Fairness: Do you care if companies pay fair wages and treat workers well?", de: "Fairness: Wichtig, dass Unternehmen faire Löhne zahlen und Mitarbeitende gut behandeln?" },
  "dna.q.fairness.left": { en: "Not a priority", de: "Keine Priorität" },
  "dna.q.fairness.right": { en: "Top priority", de: "Höchste Priorität" },
  "dna.q.themes": { en: "Specific causes: Want money going to things like solar power or clean water?", de: "Konkrete Themen: Soll Ihr Geld in Solar oder sauberes Wasser fließen?" },
  "dna.q.themes.left": { en: "Not specifically", de: "Nicht speziell" },
  "dna.q.themes.right": { en: "Yes, very much", de: "Ja, unbedingt" },
  // DNA quadrants
  "dna.quad.guardian.name": { en: "The Guardian", de: "Der Bewahrer" },
  "dna.quad.guardian.tagline": { en: "Safety-first, profit-focused", de: "Sicherheit zuerst, gewinnorientiert" },
  "dna.quad.guardian.description": {
    en: "You prioritise capital preservation and steady returns over fast growth or social themes. You want money that works quietly and reliably.",
    de: "Sie priorisieren Kapitalerhalt und stetige Rendite gegenüber schnellem Wachstum oder sozialen Themen. Geld soll leise und verlässlich arbeiten.",
  },
  "dna.quad.builder.name": { en: "The Builder", de: "Der Aufbauer" },
  "dna.quad.builder.tagline": { en: "Growth-hungry, returns-first", de: "Wachstumshungrig, renditeorientiert" },
  "dna.quad.builder.description": {
    en: "You're comfortable with risk and play the long game. Performance is what matters most — values are a nice-to-have, not a filter.",
    de: "Sie gehen Risiken ein und spielen langfristig. Performance steht im Mittelpunkt – Werte sind nett, aber kein Filter.",
  },
  "dna.quad.steward.name": { en: "The Steward", de: "Die Verwalterin" },
  "dna.quad.steward.tagline": { en: "Cautious & conscience-driven", de: "Vorsichtig & gewissensgeleitet" },
  "dna.quad.steward.description": {
    en: "You want your money safe AND aligned with your values. You'd rather earn less than fund harm — sustainability is non-negotiable.",
    de: "Ihr Geld soll sicher UND mit Ihren Werten im Einklang sein. Lieber weniger verdienen, als Schaden zu finanzieren – Nachhaltigkeit ist nicht verhandelbar.",
  },
  "dna.quad.catalyst.name": { en: "The Catalyst", de: "Der Katalysator" },
  "dna.quad.catalyst.tagline": { en: "Bold growth meets bold impact", de: "Mutiges Wachstum trifft mutige Wirkung" },
  "dna.quad.catalyst.description": {
    en: "You chase outsized returns AND outsized impact. You believe the best companies of tomorrow are the ones solving real-world problems today.",
    de: "Sie streben überdurchschnittliche Renditen UND große Wirkung an. Die besten Unternehmen von morgen lösen heute reale Probleme.",
  },

  // SROI
  "sroi.eyebrow": { en: "Tool 03 · SROI Calculator", de: "Werkzeug 03 · SROI-Rechner" },
  "sroi.titleA": { en: "Social Return", de: "Sozialer Ertrag" },
  "sroi.titleB": { en: "on Investment.", de: "auf Investitionen." },
  "sroi.lead": {
    en: "Start with the capital you plan to commit, then answer 10 questions across Financial, Social, Planet and Progress to discover your Impact Score and Total Social Return.",
    de: "Beginnen Sie mit dem geplanten Kapitaleinsatz und beantworten Sie 10 Fragen aus Finanzen, Sozialem, Planet und Fortschritt, um Ihren Wirkungswert und sozialen Gesamtertrag zu ermitteln.",
  },
  "sroi.capitalSection": { en: "Start with your capital", de: "Mit Ihrem Kapital beginnen" },
  "sroi.capitalNote": { en: "Used only to translate the impact score into a monetary return — the quiz starts with question 1.", de: "Wird nur verwendet, um den Wirkungswert in einen Geldbetrag zu übersetzen – das Quiz beginnt mit Frage 1." },
  "sroi.livePreview": { en: "Live preview", de: "Live-Vorschau" },
  "sroi.calculate": { en: "Calculate SROI →", de: "SROI berechnen →" },
  "sroi.score": { en: "Social Impact Score", de: "Sozialer Wirkungswert" },
  "sroi.outOf5": { en: "out of 5", de: "von 5" },
  "sroi.sroi": { en: "SROI", de: "SROI" },
  "sroi.perDollar": { en: "per unit invested", de: "pro investierter Einheit" },
  "sroi.rawTotal": { en: "Raw total", de: "Rohwert" },
  "sroi.toScore": { en: "Average across 10 answers", de: "Durchschnitt über 10 Antworten" },
  "sroi.pillarBreakdown": { en: "Category breakdown", de: "Aufschlüsselung nach Kategorien" },
  "sroi.capital": { en: "Capital invested", de: "Investiertes Kapital" },
  "sroi.totalReturn": { en: "Total social return", de: "Sozialer Gesamtertrag" },
  "sroi.scale": { en: "Rating scale", de: "Bewertungsskala" },
  "sroi.methodology.title": { en: "How the score is calculated", de: "So wird der Wert berechnet" },
  "sroi.methodology.body": {
    en: "Each of the 10 questions is scored on a 0–100 scale. We average those scores and divide by 20 to land on a 0–5 Impact Score, which is then mapped linearly to an SROI %: 0 → −50%, 1 → −25%, 2 → 0%, 3 → +25%, 4 → +50%, 5 → +75%. Total Social Return = Investment Amount × SROI %. The Investment Amount is currency-agnostic — results are expressed in the same unit you entered.",
    de: "Jede der 10 Fragen wird auf einer Skala von 0–100 bewertet. Wir bilden den Durchschnitt und teilen durch 20, um einen Wirkungswert von 0–5 zu erhalten, der linear in einen SROI-% übersetzt wird: 0 → −50 %, 1 → −25 %, 2 → 0 %, 3 → +25 %, 4 → +50 %, 5 → +75 %. Sozialer Gesamtertrag = Investitionsbetrag × SROI %. Der Investitionsbetrag ist währungsunabhängig – die Ergebnisse werden in derselben Einheit ausgewiesen, die Sie eingegeben haben.",
  },
  "sroi.pillar.social": { en: "Social", de: "Sozial" },
  "sroi.pillar.financial": { en: "Financial", de: "Finanziell" },
  "sroi.pillar.planet": { en: "Planet", de: "Planet" },
  "sroi.pillar.progress": { en: "Progress", de: "Fortschritt" },
  // SROI tier labels
  "sroi.tier.transformative.label": { en: "Transformative", de: "Transformativ" },
  "sroi.tier.transformative.desc": { en: "Exceptional impact across all pillars.", de: "Außergewöhnliche Wirkung über alle Säulen." },
  "sroi.tier.leader.label": { en: "Impact Leader", de: "Wirkungs-Vorreiter" },
  "sroi.tier.leader.desc": { en: "High social and environmental performance.", de: "Hohe soziale und ökologische Leistung." },
  "sroi.tier.creating.label": { en: "Value Creating", de: "Wertschöpfend" },
  "sroi.tier.creating.desc": { en: "Solid, positive externalities.", de: "Solide, positive externe Effekte." },
  "sroi.tier.aware.label": { en: "Impact Aware", de: "Wirkungsbewusst" },
  "sroi.tier.aware.desc": { en: "Minimal positive impact.", de: "Minimale positive Wirkung." },
  "sroi.tier.loss.label": { en: "Value Loss", de: "Wertverlust" },
  "sroi.tier.loss.desc": { en: "Negative or zero social impact.", de: "Negative oder keine soziale Wirkung." },
  // SROI questions — Financial
  "sroi.q.capital.label": { en: "Investment Amount", de: "Investitionsbetrag" },
  "sroi.q.capital.helper": { en: "Total amount of the investment in your local currency.", de: "Gesamtbetrag der Investition in Ihrer Landeswährung." },
  "sroi.q.roi.label": { en: "Total Capital Returned (%)", de: "Gesamtes zurückgezahltes Kapital (%)" },
  "sroi.q.roi.helper": {
    en: "How much total capital (principal + profit) do you expect back at the end of the investment period? 0% = philanthropy · 100% = break-even · above 100% = profit.",
    de: "Wie viel Kapital (Einsatz + Gewinn) erwarten Sie am Ende der Investitionsdauer zurück? 0 % = Philanthropie · 100 % = Break-even · über 100 % = Gewinn.",
  },
 "sroi.q.roi.seg.0": { en: "Total loss", de: "Totalverlust" },
 "sroi.q.roi.seg.50": { en: "Recoverable grant", de: "Teil­rück­zahlung" },
 "sroi.q.roi.seg.100": { en: "Break-even", de: "Break-even" },
 "sroi.q.roi.seg.120": { en: "Concessional", de: "Vergünstigt" },
 "sroi.q.roi.seg.160": { en: "Market-rate", de: "Marktüblich" },
 "sroi.q.roi.seg.200": { en: "Home run", de: "Volltreffer" },
  // Social
  "sroi.q.jobs.label": { en: "New Local Jobs", de: "Neue lokale Arbeitsplätze" },
  "sroi.q.jobs.helper": { en: "How many FTE roles will be created in the local community?", de: "Wie viele Vollzeitstellen entstehen in der lokalen Gemeinschaft?" },
  "sroi.q.jobs.opt.0": { en: "0–1 jobs", de: "0–1 Stellen" },
  "sroi.q.jobs.opt.1": { en: "1–4 jobs", de: "1–4 Stellen" },
  "sroi.q.jobs.opt.2": { en: "5–10 jobs", de: "5–10 Stellen" },
  "sroi.q.jobs.opt.3": { en: "11–25 jobs", de: "11–25 Stellen" },
  "sroi.q.jobs.opt.4": { en: "25+ jobs", de: "25+ Stellen" },
  "sroi.q.wage.label": { en: "Living Wage Pay (%)", de: "Existenzlohn-Anteil (%)" },
  "sroi.q.wage.helper": { en: "What % of employees are paid a living wage vs local minimum?", de: "Welcher Anteil der Mitarbeitenden erhält einen Existenzlohn statt des Mindestlohns?" },
  "sroi.q.upskill.label": { en: "Skills & Training", de: "Qualifizierung & Weiterbildung" },
  "sroi.q.upskill.helper": { en: "What level of formal training is provided to the team?", de: "Welches Niveau formaler Weiterbildung erhält das Team?" },
  "sroi.q.upskill.opt.0": { en: "None", de: "Keine" },
  "sroi.q.upskill.opt.1": { en: "Basic", de: "Grundlegend" },
  "sroi.q.upskill.opt.2": { en: "Certified", de: "Zertifiziert" },
  "sroi.q.upskill.opt.3": { en: "Extensive", de: "Umfassend" },
  // Planet
  "sroi.q.carbon.label": { en: "Energy Saving", de: "Energie­ein­sparung" },
  "sroi.q.carbon.helper": { en: "Does the product reduce CO₂ or help the community save energy? 0 (high footprint) – 10 (net zero).", de: "Senkt das Produkt CO₂ oder hilft es der Gemeinschaft, Energie zu sparen? 0 (hoher Fußabdruck) – 10 (Netto-Null)." },
  "sroi.q.circular.label": { en: "Waste Reduction", de: "Abfall­reduktion" },
  "sroi.q.circular.helper": { en: "Does the business actively reduce trash and use circular principles? 0 (linear) – 10 (zero waste).", de: "Reduziert das Unternehmen aktiv Abfall und nutzt Kreislaufprinzipien? 0 (linear) – 10 (Zero Waste)." },
  "sroi.q.supply.label": { en: "Sustainable Sourcing", de: "Nachhaltige Beschaffung" },
  "sroi.q.supply.helper": { en: "What percentage of your materials/suppliers are certified sustainable or local?", de: "Welcher Anteil Ihrer Materialien/Lieferanten ist zertifiziert nachhaltig oder lokal?" },
  // Progress
  "sroi.q.ownership.label": { en: "Community Voice", de: "Stimme der Gemeinschaft" },
  "sroi.q.ownership.helper": { en: "Do local stakeholders have a say in profits or operations?", de: "Haben lokale Stakeholder Mitsprache bei Gewinnen oder Betrieb?" },
  "sroi.q.ownership.opt.0": { en: "External", de: "Extern" },
  "sroi.q.ownership.opt.1": { en: "Advisory", de: "Beratend" },
  "sroi.q.ownership.opt.2": { en: "Profit-Share", de: "Gewinn­beteiligung" },
  "sroi.q.ownership.opt.3": { en: "Equity", de: "Anteils­eigentum" },
  "sroi.q.innovation.label": { en: "Problem Solving", de: "Problemlösung" },
  "sroi.q.innovation.helper": { en: "Is your product solving a previously unaddressed local problem? 0 (standard) – 10 (world-first).", de: "Löst Ihr Produkt ein bisher unbeachtetes lokales Problem? 0 (Standard) – 10 (weltweit erstmalig)." },
  "sroi.q.transparency.label": { en: "Impact Reporting", de: "Wirkungs-Reporting" },
  "sroi.q.transparency.helper": { en: "How are results and KPIs tracked and shared with stakeholders?", de: "Wie werden Ergebnisse und KPIs erfasst und geteilt?" },
  "sroi.q.transparency.opt.0": { en: "None", de: "Keine" },
  "sroi.q.transparency.opt.1": { en: "Internal", de: "Intern" },
  "sroi.q.transparency.opt.2": { en: "Public", de: "Öffentlich" },
  "sroi.q.transparency.opt.3": { en: "Audited", de: "Geprüft" },
  "sroi.q.transparency.opt.4": { en: "Ledger", de: "Digitales Register" },

  // Carbon Footprint
  "fp.eyebrow": { en: "Tool 04 · Carbon Footprint", de: "Werkzeug 04 · CO₂-Fußabdruck" },
  "fp.title": { en: "Measure the carbon weight of your lifestyle.", de: "Messen Sie das CO₂-Gewicht Ihres Lebensstils." },
  "fp.lead": {
    en: "Twelve questions across four areas — Living, Mobility, Transportation and Consumption. Unlike the Handprint, here a lower score is the goal.",
    de: "Zwölf Fragen in vier Bereichen – Wohnen, Mobilität, Transport und Konsum. Anders als beim Handabdruck ist hier ein niedriger Wert das Ziel.",
  },
  "fp.helper": { en: "Adjust each slider, then reveal your footprint weight.", de: "Bewegen Sie jeden Schieberegler, dann zeigen wir Ihr Fußabdruck-Gewicht." },
  "fp.submit": { en: "See my footprint →", de: "Meinen Fußabdruck anzeigen →" },
  "fp.resultEyebrow": { en: "Your Carbon Footprint", de: "Ihr CO₂-Fußabdruck" },
  "fp.outOf10Lower": { en: "/ 10 (lower is better)", de: "/ 10 (niedriger ist besser)" },
  "fp.raw": { en: "Raw carbon points", de: "CO₂-Rohpunkte" },
  "fp.areaTitle": { en: "Where your weight comes from", de: "Woher Ihr Gewicht kommt" },
  "fp.scale": { en: "The footprint scale", de: "Die Fußabdruck-Skala" },
  // areas
  "fp.area.living": { en: "Living", de: "Wohnen" },
  "fp.area.living.subtitle": { en: "Home & Energy", de: "Zuhause & Energie" },
  "fp.area.mobility": { en: "Mobility", de: "Mobilität" },
  "fp.area.mobility.subtitle": { en: "Daily Commute", de: "Täglicher Pendelweg" },
  "fp.area.transport": { en: "Transportation", de: "Transport" },
  "fp.area.transport.subtitle": { en: "Long Distance", de: "Langstrecke" },
  "fp.area.consumption": { en: "Consumption", de: "Konsum" },
  "fp.area.consumption.subtitle": { en: "Food & Stuff", de: "Essen & Dinge" },
  // Footprint questions
  "fp.q.heating.prompt": { en: "Home Heating/Cooling: How much do you rely on fossil fuels (gas, oil, or coal) to heat or cool your home?", de: "Heizen/Kühlen: Wie sehr verlassen Sie sich auf fossile Brennstoffe (Gas, Öl, Kohle) zum Heizen oder Kühlen?" },
  "fp.q.heating.low": { en: "100% Renewable/Solar", de: "100 % erneuerbar/Solar" },
  "fp.q.heating.high": { en: "100% Fossil Fuels", de: "100 % fossile Brennstoffe" },
  "fp.q.efficiency.prompt": { en: "Energy Efficiency: How well-insulated is your home, and do you use energy-saving appliances?", de: "Energieeffizienz: Wie gut ist Ihr Zuhause gedämmt und nutzen Sie energiesparende Geräte?" },
  "fp.q.efficiency.low": { en: "Perfectly Insulated/Smart Home", de: "Perfekt gedämmt/Smart Home" },
  "fp.q.efficiency.high": { en: "Drafty/Old Appliances", de: "Zugig/alte Geräte" },
  "fp.q.electricity.prompt": { en: "Electricity Usage: How often do you leave lights or electronics on when they aren't being used?", de: "Stromnutzung: Wie oft lassen Sie Licht oder Geräte an, wenn sie nicht benutzt werden?" },
  "fp.q.electricity.low": { en: "Always Off", de: "Immer aus" },
  "fp.q.electricity.high": { en: "Always On", de: "Immer an" },
  "fp.q.commute.prompt": { en: "Commuting Mode: How do you usually get to work or school?", de: "Pendelart: Wie kommen Sie üblicherweise zur Arbeit oder Schule?" },
  "fp.q.commute.low": { en: "Walk/Bike", de: "Zu Fuß/Fahrrad" },
  "fp.q.commute.high": { en: "Single-person Petrol Car", de: "Allein im Benzinauto" },
  "fp.q.ev.prompt": { en: "Electric Transition: Is your primary vehicle powered by electricity or high-emission fuel?", de: "Elektrifizierung: Wird Ihr Hauptfahrzeug elektrisch oder mit emissionsstarkem Kraftstoff betrieben?" },
  "fp.q.ev.low": { en: "EV/E-Bike", de: "E-Auto/E-Bike" },
  "fp.q.ev.high": { en: "Large SUV/Diesel", de: "Großer SUV/Diesel" },
  "fp.q.transit.prompt": { en: "Public Transit Use: How often do you choose buses or trains over a private car?", de: "ÖPNV-Nutzung: Wie oft wählen Sie Bus oder Bahn statt Privatauto?" },
  "fp.q.transit.low": { en: "Always Public", de: "Immer ÖPNV" },
  "fp.q.transit.high": { en: "Never Public", de: "Nie ÖPNV" },
  "fp.q.flights.prompt": { en: "Air Travel: How many flights (short or long-haul) do you take in a typical year?", de: "Flugreisen: Wie viele Flüge (Kurz- oder Langstrecke) machen Sie pro Jahr?" },
  "fp.q.flights.low": { en: "None", de: "Keine" },
  "fp.q.flights.high": { en: "Frequent Flyer", de: "Vielflieger" },
  "fp.q.alttravel.prompt": { en: "Alternative Travel: Do you actively choose trains or carpooling for trips over 300 miles?", de: "Alternative Reisen: Wählen Sie Bahn oder Mitfahrgelegenheit für Strecken über 500 km?" },
  "fp.q.alttravel.low": { en: "Always", de: "Immer" },
  "fp.q.alttravel.high": { en: "Never", de: "Nie" },
  "fp.q.freight.prompt": { en: "Freight & Shipping: How often do you order items online that require 'next-day' or air shipping?", de: "Versand: Wie oft bestellen Sie online mit Express- oder Luftversand?" },
  "fp.q.freight.low": { en: "Never", de: "Nie" },
  "fp.q.freight.high": { en: "Daily", de: "Täglich" },
  "fp.q.diet.prompt": { en: "Dietary Impact: How much meat and dairy (especially beef) is in your weekly diet?", de: "Ernährung: Wie viel Fleisch und Milchprodukte (besonders Rind) essen Sie pro Woche?" },
  "fp.q.diet.low": { en: "Plant-based", de: "Pflanzlich" },
  "fp.q.diet.high": { en: "Meat with every meal", de: "Fleisch zu jeder Mahlzeit" },
  "fp.q.waste.prompt": { en: "Waste Generation: How much trash does your household produce that goes to a landfill?", de: "Abfall: Wie viel Restmüll produziert Ihr Haushalt?" },
  "fp.q.waste.low": { en: "Zero Waste/Compost", de: "Zero Waste/Kompost" },
  "fp.q.waste.high": { en: "Several bags a week", de: "Mehrere Säcke pro Woche" },
  "fp.q.buying.prompt": { en: "Buying Habits: Do you prefer buying new, cheap 'fast-fashion' items over durable or second-hand goods?", de: "Kaufverhalten: Bevorzugen Sie neue, billige Fast-Fashion gegenüber langlebiger oder Second-Hand-Ware?" },
  "fp.q.buying.low": { en: "Only Second-hand", de: "Nur Second-Hand" },
  "fp.q.buying.high": { en: "Always New/Fast-fashion", de: "Immer neu/Fast Fashion" },
  // Footprint levels (1-10)
  "fp.lvl.1.name": { en: "Earth Guardian", de: "Erde-Bewahrer:in" },
  "fp.lvl.1.meaning": { en: "Your footprint is as low as modern life allows.", de: "Ihr Fußabdruck ist so niedrig, wie modernes Leben erlaubt." },
  "fp.lvl.2.name": { en: "Eco-Efficient", de: "Öko-effizient" },
  "fp.lvl.2.meaning": { en: "You have optimized most of your high-impact habits.", de: "Sie haben die meisten wirkungsstarken Gewohnheiten optimiert." },
  "fp.lvl.3.name": { en: "Mindful Consumer", de: "Bewusste:r Konsument:in" },
  "fp.lvl.3.meaning": { en: "You are below the average global carbon footprint.", de: "Sie liegen unter dem globalen Durchschnitt." },
  "fp.lvl.4.name": { en: "Carbon Neutral (Target)", de: "CO₂-neutral (Zielmarke)" },
  "fp.lvl.4.meaning": { en: "Your footprint is balanced with natural absorption.", de: "Ihr Fußabdruck ist mit natürlicher Aufnahme im Gleichgewicht." },
  "fp.lvl.5.name": { en: "Global Average", de: "Weltdurchschnitt" },
  "fp.lvl.5.meaning": { en: "You are on par with the average citizen in a developed nation.", de: "Sie liegen auf Höhe des Durchschnitts in Industrieländern." },
  "fp.lvl.6.name": { en: "Impact Heavy", de: "Wirkungsstark" },
  "fp.lvl.6.meaning": { en: "Your lifestyle requires more than one Earth to sustain.", de: "Ihr Lebensstil bräuchte mehr als eine Erde." },
  "fp.lvl.7.name": { en: "High Emitter", de: "Hoher Emittent" },
  "fp.lvl.7.meaning": { en: "Your habits in mobility or diet are significantly above average.", de: "Mobilität oder Ernährung liegen deutlich über dem Schnitt." },
  "fp.lvl.8.name": { en: "Industrial-Scale Consumer", de: "Industrielle:r Konsument:in" },
  "fp.lvl.8.meaning": { en: "You have high frequent travel and consumption habits.", de: "Häufige Reisen und hoher Konsum prägen Ihren Alltag." },
  "fp.lvl.9.name": { en: "Climate Risk", de: "Klimarisiko" },
  "fp.lvl.9.meaning": { en: "Your footprint is among the top 10% of individual emitters.", de: "Ihr Fußabdruck zählt zu den obersten 10 % der Einzel­emitter." },
  "fp.lvl.10.name": { en: "Carbon Giant", de: "CO₂-Gigant" },
  "fp.lvl.10.meaning": { en: "Your current lifestyle has a massive environmental cost.", de: "Ihr derzeitiger Lebensstil hat enorme Umweltkosten." },

  // Carbon Handprint
  "hp.eyebrow": { en: "Tool 05 · Carbon Handprint", de: "Werkzeug 05 · CO₂-Handabdruck" },
  "hp.title": { en: "Measure the good you put into the world.", de: "Messen Sie das Gute, das Sie in die Welt bringen." },
  "hp.lead": {
    en: "Your footprint counts what you take. Your handprint counts what you give — the change you inspire in others. Ten questions to see your positive influence.",
    de: "Der Fußabdruck zählt, was Sie nehmen. Der Handabdruck zählt, was Sie geben – den Wandel, den Sie anstoßen. Zehn Fragen zu Ihrem positiven Einfluss.",
  },
  "hp.helperReady": { en: "All questions answered. Reveal your handprint score.", de: "Alle Fragen beantwortet. Ihr Handabdruck-Wert kann angezeigt werden." },
  "hp.helperPending": { en: "Answer every question to reveal your handprint.", de: "Beantworten Sie alle Fragen, um Ihren Handabdruck zu sehen." },
  "hp.submit": { en: "See my handprint →", de: "Meinen Handabdruck anzeigen →" },
  "hp.resultEyebrow": { en: "Your Carbon Handprint", de: "Ihr CO₂-Handabdruck" },
  "hp.scale": { en: "The handprint scale", de: "Die Handabdruck-Skala" },
  "hp.raw": { en: "Raw influence points", de: "Einfluss-Rohpunkte" },
  "hp.outOf10": { en: "/ 10", de: "/ 10" },
  "hp.yes": { en: "Yes", de: "Ja" },
  "hp.no": { en: "No", de: "Nein" },
  "hp.freq.always": { en: "Always", de: "Immer" },
  "hp.freq.often": { en: "Often", de: "Oft" },
  "hp.freq.sometimes": { en: "Sometimes", de: "Manchmal" },
  "hp.freq.never": { en: "Never", de: "Nie" },
  // Handprint question prompts
  "hp.q.knowledge": { en: "Knowledge Sharing: How often do you start conversations or share information about climate action with friends, family, or social media?", de: "Wissen teilen: Wie oft sprechen Sie über Klimaschutz oder teilen Inhalte mit Familie, Freunden oder in sozialen Medien?" },
  "hp.q.knowledge.help": { en: "1 (Never) to 10 (Daily)", de: "1 (Nie) bis 10 (Täglich)" },
  "hp.q.ripple": { en: "The Ripple Effect: Have you successfully inspired someone else to adopt a green habit (like biking to work or composting)?", de: "Welleneffekt: Haben Sie schon jemanden zu einer grünen Gewohnheit inspiriert (z. B. Rad statt Auto, Kompostieren)?" },
  "hp.q.secondhand": { en: "Second-Hand Support: How often do you choose to buy used items, repair broken things, or use 'buy-back' services rather than buying new?", de: "Second-Hand: Wie oft kaufen Sie gebraucht, reparieren oder nutzen Rücknahme-Services statt Neuware?" },
  "hp.q.supplier": { en: "Supplier Influence: Do you ask the businesses you buy from about their sustainability practices?", de: "Lieferanteneinfluss: Fragen Sie Geschäfte und Anbieter nach ihren Nachhaltigkeitspraktiken?" },
  "hp.q.cleanenergy": { en: "Clean Energy Advocacy: Have you helped or encouraged your household, workplace, or a local group to switch to a renewable energy provider?", de: "Erneuerbare Energie: Haben Sie Haushalt, Arbeitsplatz oder eine Gruppe dazu bewegt, zu Ökostrom zu wechseln?" },
  "hp.q.community": { en: "Community Action: How often do you participate in or donate to local environmental projects (like community gardens or tree planting)?", de: "Gemeinschaftsaktion: Wie oft engagieren oder spenden Sie für lokale Umweltprojekte (z. B. Gemeinschaftsgarten, Baumpflanzung)?" },
  "hp.q.innovation": { en: "Innovation & Ideas: How much do you look for 'new ways' to do things better (like suggesting a paperless system at work or a carpool)?", de: "Innovation & Ideen: Wie sehr suchen Sie nach neuen Wegen, Dinge besser zu tun (z. B. papierlos im Büro, Fahrgemeinschaft)?" },
  "hp.q.innovation.help": { en: "1 (Never) to 10 (Constantly)", de: "1 (Nie) bis 10 (Ständig)" },
  "hp.q.gifting": { en: "Low-Carbon Gifting/Sharing: Do you prioritise sharing tools with neighbours or giving 'experience' gifts rather than physical products?", de: "Geringe-Emissions-Geschenke/Teilen: Teilen Sie Werkzeuge mit Nachbar:innen oder verschenken lieber Erlebnisse als Produkte?" },
  "hp.q.policy": { en: "Policy Support: Do you sign petitions or vote for local policies that prioritise climate-friendly infrastructure (like better bike lanes or public transit)?", de: "Politische Unterstützung: Unterzeichnen Sie Petitionen oder stimmen für klimafreundliche Infrastruktur (z. B. Radwege, ÖPNV)?" },
  "hp.q.solutions": { en: "Sustainable Solutions: If you run a business or have a hobby, does your 'product' or service help others save energy or reduce waste?", de: "Nachhaltige Lösungen: Hilft Ihr Unternehmen oder Hobby anderen, Energie zu sparen oder Abfall zu reduzieren?" },
  // Handprint levels
  "hp.lvl.10.name": { en: "Climate Positive Hero", de: "Klimapositive:r Held:in" },
  "hp.lvl.10.meaning": { en: "Your positive influence significantly outweighs your own footprint.", de: "Ihr positiver Einfluss übersteigt deutlich Ihren eigenen Fußabdruck." },
  "hp.lvl.9.name": { en: "Community Catalyst", de: "Gemeinschafts-Katalysator:in" },
  "hp.lvl.9.meaning": { en: "You are a major driver of change in your local area.", de: "Sie sind eine treibende Kraft des Wandels vor Ort." },
  "hp.lvl.8.name": { en: "Impact Leader", de: "Wirkungs-Vorreiter:in" },
  "hp.lvl.8.meaning": { en: "You actively help others reduce their carbon impact.", de: "Sie helfen anderen aktiv, ihren CO₂-Beitrag zu senken." },
  "hp.lvl.7.name": { en: "Green Advocate", de: "Grüne:r Fürsprecher:in" },
  "hp.lvl.7.meaning": { en: "You consistently influence your circle toward better choices.", de: "Sie beeinflussen Ihr Umfeld konsequent zu besseren Entscheidungen." },
  "hp.lvl.6.name": { en: "Handprint Emerging", de: "Handabdruck wächst" },
  "hp.lvl.6.meaning": { en: "You've started looking outward to help others, not just yourself.", de: "Sie schauen nach außen und helfen anderen, nicht nur sich selbst." },
  "hp.lvl.5.name": { en: "Net-Positive Trainee", de: "Netto-positiv in Ausbildung" },
  "hp.lvl.5.meaning": { en: "You are creating slightly more 'good' than 'bad'.", de: "Sie schaffen etwas mehr „Gutes“ als „Schlechtes“." },
  "hp.lvl.4.name": { en: "Carbon Neutral", de: "CO₂-neutral" },
  "hp.lvl.4.meaning": { en: "Your positive actions perfectly balance out your negative footprint.", de: "Ihre positiven Handlungen gleichen den Fußabdruck genau aus." },
  "hp.lvl.3.name": { en: "Self-Focused", de: "Auf sich selbst fokussiert" },
  "hp.lvl.3.meaning": { en: "You focus on your own footprint but rarely help others.", de: "Sie konzentrieren sich auf Ihren Fußabdruck, helfen aber selten anderen." },
  "hp.lvl.2.name": { en: "Bystander", de: "Beobachter:in" },
  "hp.lvl.2.meaning": { en: "You have very few positive environmental actions outside yourself.", de: "Sie unternehmen kaum positive Umweltaktionen über sich hinaus." },
  "hp.lvl.1.name": { en: "Carbon Heavyweight", de: "CO₂-Schwergewicht" },
  "hp.lvl.1.meaning": { en: "You have a high footprint with almost no handprint influence.", de: "Hoher Fußabdruck bei kaum vorhandenem Handabdruck." },

  // ESGpt
  "esgpt.eyebrow": { en: "Tool 02", de: "Werkzeug 02" },
  "esgpt.title": { en: "ESGpt", de: "ESGpt" },
  "esgpt.lead": {
    en: "Conversational ESG intelligence — answers sourced from a curated local glossary.",
    de: "ESG-Wissen im Dialog – Antworten aus einem kuratierten lokalen Glossar.",
  },
  "esgpt.welcome": {
    en: "Hi, I'm ESGpt. Ask me about ESG terms, frameworks, or sustainability concepts. If I don't know something, I'll say so.",
    de: "Hallo, ich bin ESGpt. Fragen Sie mich zu ESG-Begriffen, Rahmenwerken oder Nachhaltigkeitskonzepten. Wenn ich etwas nicht weiß, sage ich es ehrlich.",
  },
  "esgpt.fallback": {
    en: "I am still learning or it is currently out of my scope.",
    de: "Ich lerne noch oder das Thema liegt aktuell außerhalb meines Wissensbereichs.",
  },
  "esgpt.kbStats": { en: "Knowledge Stats", de: "Wissens­statistik" },
  "esgpt.kbCount": { en: "ESG terms in the local knowledge base", de: "ESG-Begriffe in der lokalen Wissens­datenbank" },
  "esgpt.local": { en: "Local CSV · offline match", de: "Lokales CSV · Offline-Abgleich" },
  "esgpt.quickStart": { en: "Quick Start", de: "Schnellstart" },
  "esgpt.placeholder": {
    en: "Ask about an ESG term, e.g. What is SROI?",
    de: "Fragen Sie nach einem ESG-Begriff, z. B. Was ist SROI?",
  },
  "esgpt.send": { en: "Send", de: "Senden" },
  "esgpt.askLabel": { en: "Ask ESGpt", de: "ESGpt fragen" },
  "esgpt.bot": { en: "ESGpt", de: "ESGpt" },
  "esgpt.matched": { en: "Matched", de: "Treffer" },
  "esgpt.note": {
    en: "ESGpt only responds with information found in the local knowledge base. Out-of-scope questions return a fallback message.",
    de: "ESGpt antwortet ausschließlich aus der lokalen Wissens­datenbank. Themen außerhalb davon erhalten eine Hinweismeldung.",
  },
  "esgpt.qs.carbonFootprint": { en: "Carbon Footprint", de: "CO₂-Fußabdruck" },
  "esgpt.qs.sroi": { en: "SROI", de: "SROI" },
  "esgpt.qs.scope1": { en: "Scope 1 emissions", de: "Scope-1-Emissionen" },
  "esgpt.qs.greenwashing": { en: "Greenwashing", de: "Greenwashing" },
  "esgpt.qs.netZero": { en: "Net Zero", de: "Netto-Null" },
  "esgpt.qs.paris": { en: "Paris Agreement", de: "Pariser Abkommen" },

  // 404
  "404.title": { en: "Page not found", de: "Seite nicht gefunden" },
  "404.lead": { en: "The page you're looking for doesn't exist or has been moved.", de: "Die gesuchte Seite existiert nicht oder wurde verschoben." },
  "404.home": { en: "Go home", de: "Zur Startseite" },
  "404.toolTitle": { en: "Tool not found", de: "Werkzeug nicht gefunden" },
  "404.toolLead": { en: "That tool doesn't exist (yet).", de: "Dieses Werkzeug gibt es (noch) nicht." },
} as const satisfies Record<string, { en: string; de: string }>;

export type TranslationKey = keyof typeof dict;

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "esgwise.lang";

function detectInitial(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "de") return saved;
  const nav = window.navigator?.language?.toLowerCase() ?? "";
  return nav.startsWith("de") ? "de" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Detect on mount only (avoids SSR mismatch)
  useEffect(() => {
    setLangState(detectInitial());
  }, []);

  // Reflect in <html lang>
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
    }
  }, []);

  const t = useCallback(
    (k: TranslationKey) => {
      const entry = dict[k];
      if (!entry) return k;
      return entry[lang] ?? entry.en;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe default for SSR / before provider mounts
    return {
      lang: "en",
      setLang: () => {},
      t: (k) => dict[k]?.en ?? k,
    };
  }
  return ctx;
}

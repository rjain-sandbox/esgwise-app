import { createFileRoute, notFound } from "@tanstack/react-router";
import { ToolStub } from "@/components/ToolStub";
import { SroiCalculator } from "@/components/SroiCalculator";
import { tools } from "@/lib/tools";

const stubContent: Record<string, { bullets: string[] }> = {
  "investor-dna": {
    bullets: [
      "Map your values across environmental, social and governance axes.",
      "Assess your time horizon, risk appetite and impact tolerance.",
      "Receive an archetype: Steward, Catalyst, Pragmatist or Pioneer.",
      "Get curated themes and asset classes that fit your DNA.",
    ],
  },
  esgpt: {
    bullets: [
      "Ask about ratings, frameworks (GRI, SASB, TCFD, SFDR) and regulations.",
      "Get plain-language explanations with cited sources.",
      "Compare two companies' ESG profiles in seconds.",
      "Save threads to revisit your research trail.",
    ],
  },
  sroi: {
    bullets: [
      "Define inputs, outputs, outcomes and stakeholders step by step.",
      "Apply financial proxies to non-market outcomes.",
      "Discount for deadweight, attribution and drop-off.",
      "Export an SROI ratio with an audit-ready breakdown.",
    ],
  },
  "carbon-footprint": {
    bullets: [
      "Capture energy, transport, food and consumption inputs.",
      "Allocate emissions across scope 1, 2 and 3.",
      "Benchmark against country and peer-group averages.",
      "Identify the three highest-leverage reductions you can make.",
    ],
  },
  "carbon-handprint": {
    bullets: [
      "Estimate avoided emissions from products, services or investments.",
      "Apply conservative counterfactual baselines.",
      "Net handprint against footprint to see your true contribution.",
      "Generate a one-page summary you can share with stakeholders.",
    ],
  },
};

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = tools.find((t) => t.slug === params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    const tool = loaderData?.tool;
    if (!tool) return { meta: [{ title: "Tool not found — ESGwise" }] };
    return {
      meta: [
        { title: `${tool.name} — ESGwise ESG Toolkit` },
        { name: "description", content: tool.description },
        { property: "og:title", content: `${tool.name} — ESGwise` },
        { property: "og:description", content: tool.description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-4xl font-semibold">Tool not found</h1>
        <p className="mt-2 text-muted-foreground">That tool doesn't exist (yet).</p>
        <a href="/" className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">
          Back to dashboard
        </a>
      </div>
    </div>
  ),
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();

  if (tool.slug === "sroi") {
    return <SroiCalculator />;
  }

  const content = stubContent[tool.slug];
  return (
    <ToolStub
      eyebrow={`Tool ${tool.number}`}
      title={tool.name}
      description={tool.description}
      bullets={content?.bullets ?? []}
      accent={tool.accent}
    />
  );
}

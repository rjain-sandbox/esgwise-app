import { createFileRoute, notFound } from "@tanstack/react-router";
import { ToolStub } from "@/components/ToolStub";
import { SroiCalculator } from "@/components/SroiCalculator";
import { InvestorDna } from "@/components/InvestorDna";
import { CarbonHandprint } from "@/components/CarbonHandprint";
import { CarbonFootprint } from "@/components/CarbonFootprint";
import { Esgpt } from "@/components/Esgpt";
import { tools } from "@/lib/tools";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const stubBullets: Partial<Record<string, TranslationKey[]>> = {
  // ESGpt is fully implemented; no stub bullets needed.
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
        { title: `ESGwise — ${tool.slug}` },
      ],
    };
  },
  notFoundComponent: () => <NotFoundView />,
  component: ToolPage,
});

function NotFoundView() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-4xl font-semibold">{t("404.toolTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("404.toolLead")}</p>
        <a href="/" className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">
          {t("404.home")}
        </a>
      </div>
    </div>
  );
}

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const { t } = useI18n();

  if (tool.slug === "sroi") return <SroiCalculator />;
  if (tool.slug === "investor-dna") return <InvestorDna />;
  if (tool.slug === "carbon-handprint") return <CarbonHandprint />;
  if (tool.slug === "carbon-footprint") return <CarbonFootprint />;
  if (tool.slug === "esgpt") return <Esgpt />;

  const bullets = stubBullets[tool.slug] ?? [];
  return (
    <ToolStub
      eyebrow={`${t("stub.toolN")} ${tool.number}`}
      title={t(tool.nameKey)}
      description={t(tool.descriptionKey)}
      bullets={bullets.map((k) => t(k))}
      accent={tool.accent}
    />
  );
}

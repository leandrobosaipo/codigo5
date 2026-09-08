import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "../..");

const publicFiles = [
  "src/components/SolutionsSection.tsx",
  "src/components/TechStackSection.tsx",
  "src/components/TestimonialsSection.tsx",
  "src/components/ContactSection.tsx",
  "src/components/UseCasesSection.tsx",
  "src/components/ProcessSection.tsx",
  "src/components/EditorialSection.tsx",
  "src/components/InternalPageHero.tsx",
  "src/components/BlogCollectionHero.tsx",
  "src/pages/AboutPage.tsx",
  "src/pages/ServicesPage.tsx",
  "src/pages/PortfolioPage.tsx",
  "src/pages/ContactPage.tsx",
  "src/pages/BlogIndex.tsx",
];

const bannedCopyPatterns = [
  "o bloco foi redesenhado",
  "a referência aqui",
  "a linguagem visual",
  "o objetivo aqui é parecer",
  "o blog foi reconstruído",
  "como ler esse acervo",
  "leitura certa",
  "leitura do acervo",
  "ecossistema comercial",
  "máquina única",
  "máquina comercial",
  "camada de inteligência da marca",
  "ai marketing agency direction",
  "growth cockpit",
  "código5 os",
  "stack em cena",
  "ritmo de entrega",
  "sistema visual do site",
];

const bannedVisualPatterns = [
  "#fff8ea",
  "#f4e1bc",
  "bg-amber-100",
  "text-amber-700",
  "bg-emerald-100",
  "text-emerald-700",
];

const readFiles = () =>
  publicFiles.map((relativePath) => ({
    relativePath,
    content: fs.readFileSync(path.join(projectRoot, relativePath), "utf8").toLowerCase(),
  }));

describe("site guardrails", () => {
  it("does not keep backstage or AI-style copy in public-facing sections", () => {
    const files = readFiles();

    for (const pattern of bannedCopyPatterns) {
      const offenders = files.filter((file) => file.content.includes(pattern));
      expect(offenders, `Pattern "${pattern}" should not appear in public copy`).toHaveLength(0);
    }
  });

  it("does not keep obvious legacy warm palette markers in public sections", () => {
    const files = readFiles();

    for (const pattern of bannedVisualPatterns) {
      const offenders = files.filter((file) => file.content.includes(pattern.toLowerCase()));
      expect(offenders, `Pattern "${pattern}" should not appear in public files`).toHaveLength(0);
    }
  });

  it("keeps legacy service hash redirects in static file routing rules", () => {
    const redirects = fs.readFileSync(path.join(projectRoot, "public/_redirects"), "utf8");

    expect(redirects).toContain("/servicos/seo-local/ /servicos#audiencia 301");
    expect(redirects).toContain("/servicos/seo-local /servicos#audiencia 301");
    expect(redirects).toContain("/suporte-wordpress/ /servicos#operacao 301");
    expect(redirects).toContain("/suporte-wordpress /servicos#operacao 301");
  });
});

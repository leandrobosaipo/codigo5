import { describe, expect, it } from "vitest";
import { parseStructuredPrompt } from "../../functions/_shared/bot/prompt-parser";

describe("prompt parser", () => {
  it("extracts structured fields from a telegram/admin briefing", () => {
    const parsed = parseStructuredPrompt(`
TITULO: Como transformar uma lista de contatos em operação comercial
SLUG: lista-de-contatos-em-operacao-comercial
META: Um site sozinho não resolve quando o atendimento continua solto.
CATEGORIAS: Marketing Digital, Automação e IA
TAGS: crm, vendas, automação
CAPA_PROMPT: Equipe analisando leads em dashboard comercial.
CONTEUDO:
## O problema
Lista de contatos sem processo vira ruído.

## O que organizar
- site
- crm
- automação
    `.trim());

    expect(parsed.title).toBe("Como transformar uma lista de contatos em operação comercial");
    expect(parsed.slug).toBe("lista-de-contatos-em-operacao-comercial");
    expect(parsed.seoDescription).toContain("site sozinho");
    expect(parsed.contentMarkdown).toContain("## O problema");
    expect(parsed.contentHtml).toContain("<h2");
    expect(parsed.categoriesJson).toContain("Marketing Digital");
    expect(parsed.tagsJson).toContain("crm");
    expect(parsed.imagePrompt).toContain("dashboard");
    expect(parsed.readingMinutes).toBeGreaterThan(0);
  });

  it("returns empty structured data for plain free text", () => {
    const parsed = parseStructuredPrompt("quero um post para bikes elétricas com ecommerce e SEO");
    expect(parsed).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { inferBikeSegment, inferServiceFocus, looksLikeUrl, slugify } from "../../functions/_shared/bot/utils";

describe("bot utils", () => {
  it("detects urls", () => {
    expect(looksLikeUrl("https://example.com")).toBe(true);
    expect(looksLikeUrl("quero um post para bikes")).toBe(false);
  });

  it("slugifies portuguese text", () => {
    expect(slugify("Bikes Elétricas em Cuiabá")).toBe("bikes-eletricas-em-cuiaba");
  });

  it("infers bike segment", () => {
    expect(inferBikeSegment("quero um post para bikes elétricas")).toBe("bicicletas e bikes elétricas");
  });

  it("infers service focus", () => {
    expect(inferServiceFocus("quero vender mais com ecommerce e catálogo")).toBe("lojas virtuais");
    expect(inferServiceFocus("quero melhorar SEO no Google")).toBe("seo e conteúdo");
    expect(inferServiceFocus("quero automação no WhatsApp")).toBe("automações e ia");
  });
});

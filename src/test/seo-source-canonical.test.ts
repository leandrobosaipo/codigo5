import { describe, expect, it } from "vitest";
import { cod5_replace_canonical_url } from "../../functions/_middleware";

describe("HTML source canonical", () => {
  it("replaces the home canonical and Open Graph URL with the requested route", () => {
    const html = `
      <link rel="canonical" href="https://codigo5.com.br/" />
      <meta property="og:url" content="https://codigo5.com.br/" />
    `;

    const result = cod5_replace_canonical_url(html, "/sobre");

    expect(result).toContain('rel="canonical" href="https://codigo5.com.br/sobre"');
    expect(result).toContain('property="og:url" content="https://codigo5.com.br/sobre"');
    expect(result).not.toContain('rel="canonical" href="https://codigo5.com.br/"');
  });

  it("keeps the root canonical at the site root", () => {
    const html = '<link rel="canonical" href="https://codigo5.com.br/" />';

    expect(cod5_replace_canonical_url(html, "/")).toContain(
      'href="https://codigo5.com.br/"',
    );
  });
});

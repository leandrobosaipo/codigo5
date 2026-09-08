import { excerptFromMarkdown, readingMinutesFromMarkdown, renderMarkdownToHtml } from "./markdown";
import { inferSegment, inferServiceFocus, slugify, trimText } from "./utils";

type BlogTerm = {
  id: number;
  name: string;
  slug: string;
};

export type ParsedPromptDraft = {
  sourceValue: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  contentMarkdown: string | null;
  contentHtml: string | null;
  categoriesJson: string | null;
  tagsJson: string | null;
  segment: string | null;
  serviceFocus: string | null;
  imagePrompt: string | null;
  imageUrl: string | null;
  readingMinutes: number | null;
  notes: string | null;
};

const hashId = (value: string) =>
  value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 1000);

const createTerm = (name: string): BlogTerm => ({
  id: hashId(name),
  name,
  slug: slugify(name),
});

const normalizeHeading = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const blockToList = (value: string) =>
  value
    .split("\n")
    .map((line) => line.replace(/^[-*+]\s+/, "").trim())
    .filter(Boolean);

const inlineListToArray = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseSectionBlocks = (sourceValue: string) => {
  const sections = new Map<string, string>();
  const matches = [...sourceValue.matchAll(/^##+\s+(.+?)\n([\s\S]*?)(?=^##+\s+.+|\s*$)/gm)];

  matches.forEach((match) => {
    const heading = normalizeHeading(match[1]);
    const content = match[2].trim();
    if (heading && content) {
      sections.set(heading, content);
    }
  });

  return sections;
};

const readSection = (sections: Map<string, string>, variants: string[]) => {
  for (const variant of variants) {
    const value = sections.get(normalizeHeading(variant));
    if (value) return value;
  }
  return null;
};

const parseExplicitField = (sourceValue: string, label: string) => {
  const regex = new RegExp(`^${label}:\\s*(.+)$`, "im");
  return sourceValue.match(regex)?.[1]?.trim() ?? null;
};

const parsePromptTerms = (sourceValue: string, sections: Map<string, string>, field: "categorias" | "tags") => {
  const explicit = parseExplicitField(sourceValue, field.toUpperCase());
  const sectionValue = readSection(sections, [field]);
  const values = explicit
    ? inlineListToArray(explicit)
    : sectionValue
      ? blockToList(sectionValue)
      : [];

  return values.map(createTerm);
};

const parsePromptContent = (sourceValue: string, sections: Map<string, string>) =>
  readSection(sections, [
    "conteudo",
    "conteúdo",
    "conteudo markdown",
    "conteudo markdown compativel com gutenberg",
    "conteúdo markdown compatível com gutenberg",
  ]) ?? parseExplicitField(sourceValue, "CONTEUDO");

export const parseStructuredPrompt = (sourceValue: string): ParsedPromptDraft | null => {
  const sections = parseSectionBlocks(sourceValue);
  const contentMarkdown = parsePromptContent(sourceValue, sections);
  const explicitTitle =
    parseExplicitField(sourceValue, "TITULO") ??
    readSection(sections, ["titulo", "titulo seo", "título", "título seo"]);
  const explicitSlug = parseExplicitField(sourceValue, "SLUG") ?? readSection(sections, ["slug"]);
  const explicitSeoDescription =
    parseExplicitField(sourceValue, "META") ??
    parseExplicitField(sourceValue, "META DESCRIPTION") ??
    readSection(sections, ["meta description", "meta description yoast", "descricao seo", "descrição seo"]);
  const imagePrompt =
    parseExplicitField(sourceValue, "CAPA_PROMPT") ??
    readSection(sections, ["prompt de imagem", "prompt de imagem capa 16 9", "capa prompt"]);
  const categories = parsePromptTerms(sourceValue, sections, "categorias");
  const tags = parsePromptTerms(sourceValue, sections, "tags");

  if (!contentMarkdown && !explicitTitle && !explicitSlug && !explicitSeoDescription && categories.length === 0 && tags.length === 0) {
    return null;
  }

  const title = explicitTitle ? trimText(explicitTitle, 120) : null;
  const slug = explicitSlug ? slugify(explicitSlug) : title ? slugify(title) : null;
  const excerpt = contentMarkdown ? excerptFromMarkdown(contentMarkdown) : null;
  const seoTitle = title ? trimText(title, 70) : null;
  const seoDescription = explicitSeoDescription
    ? trimText(explicitSeoDescription, 170)
    : contentMarkdown
      ? excerptFromMarkdown(contentMarkdown, 170)
      : null;
  const contentHtml = contentMarkdown ? renderMarkdownToHtml(contentMarkdown) : null;
  const contextText = [title, contentMarkdown ?? "", sourceValue].filter(Boolean).join("\n");

  return {
    sourceValue,
    title,
    slug,
    excerpt,
    seoTitle,
    seoDescription,
    contentMarkdown,
    contentHtml,
    categoriesJson: categories.length > 0 ? JSON.stringify(categories) : null,
    tagsJson: tags.length > 0 ? JSON.stringify(tags) : null,
    segment: inferSegment(contextText),
    serviceFocus: inferServiceFocus(contextText),
    imagePrompt: imagePrompt ?? null,
    imageUrl: null,
    readingMinutes: contentMarkdown ? readingMinutesFromMarkdown(contentMarkdown) : null,
    notes: "Prompt estruturado detectado e convertido automaticamente.",
  };
};

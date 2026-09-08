import { excerptFromMarkdown, readingMinutesFromMarkdown, renderMarkdownToHtml } from "./markdown";
import { parseStructuredPrompt } from "./prompt-parser";
import type { DraftRecord } from "./types";
import { slugify, trimText } from "./utils";

type BlogTerm = {
  id: number;
  name: string;
  slug: string;
};

export type GeneratedDraftPayload = {
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  contentMarkdown: string | null;
  contentHtml: string;
  categories: BlogTerm[];
  tags: BlogTerm[];
  imageUrl: string | null;
  readingMinutes: number;
};

const SITE_URL = "https://codigo5.com.br";

const hashId = (value: string) =>
  value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 1000);

const createTerm = (name: string): BlogTerm => ({
  id: hashId(name),
  name,
  slug: slugify(name),
});

const buildCategories = (serviceFocus: string | null): BlogTerm[] => {
  const categories = [createTerm("Blog e Notícias")];

  if (serviceFocus === "seo e conteúdo") categories.push(createTerm("Marketing Digital"));
  if (serviceFocus === "lojas virtuais") categories.push(createTerm("Serviços Digitais"));
  if (serviceFocus === "automações e ia") categories.push(createTerm("Automação e IA"));
  if (serviceFocus === "sites institucionais") categories.push(createTerm("Planejamento de Sites"));

  return categories;
};

const buildTags = (draft: DraftRecord): BlogTerm[] => {
  const tags = new Set<string>();

  if (draft.segment) tags.add(draft.segment);
  if (draft.serviceFocus) tags.add(draft.serviceFocus);

  const normalized = draft.sourceValue.toLowerCase();
  if (normalized.includes("mato grosso")) tags.add("Mato Grosso");
  if (normalized.includes("erp")) tags.add("integração com ERP");
  if (normalized.includes("crm")) tags.add("CRM");
  if (normalized.includes("autom")) tags.add("automação");
  if (normalized.includes("seo")) tags.add("SEO");

  return Array.from(tags).map(createTerm);
};

const parseTermsJson = (value?: string | null): BlogTerm[] | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Array<{ name?: string; slug?: string; id?: number }>;
    const terms = parsed
      .filter((item) => item?.name)
      .map((item) => ({
        id: typeof item.id === "number" ? item.id : hashId(String(item.name)),
        name: String(item.name),
        slug: item.slug ? String(item.slug) : slugify(String(item.name)),
      }));
    return terms.length ? terms : null;
  } catch {
    return null;
  }
};

const serviceBridge = (serviceFocus: string | null) => {
  if (serviceFocus === "lojas virtuais") {
    return "loja virtual integrada, catálogo técnico, automação comercial e estrutura de ecommerce";
  }
  if (serviceFocus === "seo e conteúdo") {
    return "SEO, conteúdo e páginas que expliquem melhor o serviço e capturem demanda qualificada";
  }
  if (serviceFocus === "automações e ia") {
    return "automações, IA aplicada, integrações e processos digitais mais previsíveis";
  }

  return "site profissional, estrutura comercial e operação digital conectada";
};

const sourceSummaryFromUrl = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "Codigo5Bot/1.0",
      },
    });

    if (!response.ok) return null;
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim() ?? "";
    const description =
      html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)?.[1]?.trim() ?? "";

    if (!title && !description) return null;
    return { title, description };
  } catch {
    return null;
  }
};

const buildFaq = (segmentLabel: string, serviceLabel: string) => `
<h2 class="wp-block-heading">FAQ: dúvidas rápidas</h2>

<h3 class="wp-block-heading">Esse tipo de empresa precisa mesmo de presença digital estruturada?</h3>
<p>Sim. Em ${segmentLabel}, a decisão de compra e contratação passa por pesquisa, comparação, prova técnica e confiança operacional. Um site simples demais costuma limitar a percepção de valor.</p>

<h3 class="wp-block-heading">Qual é o primeiro passo mais importante?</h3>
<p>Organizar a base: proposta clara, páginas certas, presença profissional e um fluxo conectado entre atendimento, operação e ${serviceLabel}.</p>

<h3 class="wp-block-heading">Só um site resolve?</h3>
<p>Nem sempre. Em mercados técnicos, site sem integração, automação e estrutura comercial vira vitrine. O ganho real vem quando o digital ajuda a vender, atender e operar melhor.</p>
`;

export const generateDraftContent = async (draft: DraftRecord): Promise<GeneratedDraftPayload> => {
  const parsedPrompt = parseStructuredPrompt(draft.sourceValue);
  const markdownSource = draft.contentMarkdown?.trim() || parsedPrompt?.contentMarkdown;
  const storedCategories = parseTermsJson(draft.categoriesJson);
  const storedTags = parseTermsJson(draft.tagsJson);

  if (markdownSource) {
    const title = trimText(draft.title?.trim() || parsedPrompt?.title || "Post da Código5", 120);
    const excerpt = trimText(
      draft.excerpt?.trim() || parsedPrompt?.excerpt || excerptFromMarkdown(markdownSource),
      180,
    );
    const seoTitle = trimText(
      draft.seoTitle?.trim() || parsedPrompt?.seoTitle || title,
      68,
    );
    const seoDescription = trimText(
      draft.seoDescription?.trim() || parsedPrompt?.seoDescription || excerpt,
      155,
    );

    return {
      title,
      excerpt,
      seoTitle,
      seoDescription,
      contentMarkdown: markdownSource,
      contentHtml: renderMarkdownToHtml(markdownSource),
      categories:
        storedCategories ??
        parseTermsJson(parsedPrompt?.categoriesJson) ??
        buildCategories(draft.serviceFocus ?? parsedPrompt?.serviceFocus ?? null),
      tags:
        storedTags ??
        parseTermsJson(parsedPrompt?.tagsJson) ??
        buildTags({
          ...draft,
          segment: draft.segment ?? parsedPrompt?.segment ?? null,
          serviceFocus: draft.serviceFocus ?? parsedPrompt?.serviceFocus ?? null,
        }),
      imageUrl: draft.imageUrl ?? parsedPrompt?.imageUrl ?? null,
      readingMinutes: Math.max(3, readingMinutesFromMarkdown(markdownSource)),
    };
  }

  const reference = draft.mode === "link" ? await sourceSummaryFromUrl(draft.sourceValue) : null;
  const segmentLabel = draft.segment ?? "operações técnicas e serviços especializados";
  const serviceLabel = draft.serviceFocus ?? "estrutura digital";
  const bridge = serviceBridge(draft.serviceFocus);
  const titleBase = reference?.title || trimText(draft.sourceValue.replace(/^https?:\/\/\S+$/i, segmentLabel), 110);
  const title = draft.segment
    ? `Como empresas de ${segmentLabel} podem crescer com ${serviceLabel}, integrações e operação digital conectada`
    : `Como transformar uma ideia de mercado em estrutura digital para vender melhor online`;

  const excerpt = reference?.description
    ? trimText(reference.description, 180)
    : trimText(
        `Empresas de ${segmentLabel} estão saindo do site institucional simples para uma operação digital mais madura, com ${bridge} e presença comercial mais clara.`,
        180,
      );

  const seoTitle = trimText(title, 68);
  const seoDescription = trimText(
    `Entenda como ${segmentLabel} podem vender melhor com ${bridge}, mantendo um tom comercial claro e uma operação digital mais previsível.`,
    155,
  );

  const contentHtml = `
<p>${reference?.description || `Em ${segmentLabel}, o problema raramente é apenas “ter um site”. O ponto real costuma ser outro: como transformar operação técnica, atendimento, recorrência e confiança comercial em uma presença digital que realmente ajuda a vender.`}</p>

<p>Quando a empresa depende de orçamento consultivo, suporte técnico, integração entre setores ou relacionamento contínuo com o cliente, o digital precisa deixar de ser vitrine isolada e passar a funcionar como parte da operação.</p>

<h2 class="wp-block-heading">O mercado está pedindo mais estrutura, não mais improviso</h2>
<p>${reference?.title ? `A referência enviada já aponta isso com clareza: ${reference.title}.` : `A oportunidade atual nesse segmento está menos em “estar online” e mais em construir uma base que ajude a captar demanda, explicar valor e reduzir atrito entre comercial, atendimento e execução.`}</p>

<ul class="wp-block-list">
  <li>mais pesquisa antes da compra ou contratação</li>
  <li>mais necessidade de conteúdo que explique processos técnicos</li>
  <li>mais pressão por resposta rápida e operação previsível</li>
  <li>mais valor em integrações entre site, CRM, ERP e atendimento</li>
</ul>

<h2 class="wp-block-heading">Onde a operação digital trava</h2>
<p>O gargalo mais comum aparece quando a empresa cresce, mas o digital continua artesanal. Aí surgem problemas como catálogo mal organizado, páginas sem contexto, lead sem fluxo, falta de integração e dependência de mensagens soltas para tocar processos importantes.</p>

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
  <p>Quando a jornada do cliente fica mais técnica, o digital precisa deixar de ser só presença e passar a ser infraestrutura de vendas e operação.</p>
</blockquote>

<h2 class="wp-block-heading">O que uma empresa desse segmento deveria priorizar</h2>
<ul class="wp-block-list">
  <li>site com proposta clara e linguagem para decisor não técnico</li>
  <li>páginas orientadas a serviço, solução e prova de autoridade</li>
  <li>${bridge}</li>
  <li>conteúdo e SEO para capturar demanda qualificada</li>
  <li>estrutura para reduzir ruído entre comercial, suporte e backoffice</li>
</ul>

<h2 class="wp-block-heading">Como a Código5 entra nesse cenário</h2>
<p>A Código5 atua justamente no ponto em que empresas de ${segmentLabel} precisam amadurecer a operação digital. Isso envolve site profissional, ecommerce quando faz sentido, automações, IA aplicada e integrações que conectam marketing, comercial e rotina operacional.</p>

<p>O ganho não está só em parecer melhor. Está em vender com mais clareza, operar com menos atrito e construir uma estrutura que acompanhe o crescimento sem virar improviso caro.</p>

${buildFaq(segmentLabel, serviceLabel)}

<h2 class="wp-block-heading">Conclusão</h2>
<p>${titleBase} é só o ponto de partida para uma leitura mais ampla: mercados técnicos e operações complexas já não combinam com presença digital rasa. Quem organiza o digital como parte do negócio tende a ganhar previsibilidade, confiança e espaço competitivo.</p>

<p>Se a sua empresa quer transformar isso em ${bridge}, vale conhecer as soluções da <a href="${SITE_URL}/servicos">Código5</a> ou iniciar a conversa em <a href="${SITE_URL}/contato">${SITE_URL}/contato</a>.</p>
`.trim();

  return {
    title,
    excerpt,
    seoTitle,
    seoDescription,
    contentMarkdown: null,
    contentHtml,
    categories: buildCategories(draft.serviceFocus),
    tags: buildTags(draft),
    imageUrl: null,
    readingMinutes: Math.max(3, Math.ceil(contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 220)),
  };
};

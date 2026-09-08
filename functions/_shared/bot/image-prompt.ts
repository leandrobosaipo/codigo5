import type { DraftRecord } from "./types";

const segmentScene = (segment: string | null) => {
  switch (segment) {
    case "energia solar":
      return "telhados com painéis solares, equipe técnica em campo, dashboard digital e atmosfera de eficiência energética";
    case "bicicletas e bikes elétricas":
      return "bicicletas elétricas premium, showroom moderno, mobilidade urbana e interface digital conectando catálogo e serviço";
    case "peças agrícolas e agronegócio":
      return "máquinas agrícolas, peças técnicas organizadas, operação no campo e interface de gestão de estoque";
    case "locação de equipamentos médicos":
      return "equipamentos hospitalares em ambiente home care, atendimento técnico humanizado e sistema digital de monitoramento";
    case "automação e tratamento de piscinas":
      return "piscina corporativa, sensores inteligentes, painel de monitoramento e estética limpa de manutenção técnica";
    case "automação industrial":
      return "ambiente industrial limpo, componentes hidráulicos, operadores técnicos e dashboards de controle";
    default:
      return "equipe técnica, operação digital madura, dashboards e ambiente corporativo premium";
  }
};

export const createImagePrompt = (draft: DraftRecord) => {
  const scene = segmentScene(draft.segment);
  const focus = draft.serviceFocus ?? "estrutura digital";
  const title = draft.title ?? draft.segment ?? "operação digital";

  return [
    "Imagem editorial horizontal 16:9 para capa de post de blog corporativo.",
    `Tema principal: ${title}.`,
    `Cena: ${scene}.`,
    `Enfatizar ${focus}, integração entre operação e presença digital, clima premium e confiável.`,
    "Estilo fotográfico realista, luz natural sofisticada, composição limpa, sem excesso de texto, sem mockup genérico de startup.",
    "Paleta quente e elegante, compatível com tons areia, dourado suave, grafite e branco.",
    "Transmitir clareza comercial, tecnologia aplicada e autoridade operacional.",
    "Evitar logos, marcas de terceiros, texto embutido, visual futurista exagerado ou estética cyberpunk.",
  ].join(" ");
};

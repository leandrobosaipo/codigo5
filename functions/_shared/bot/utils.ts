export const nowIso = () => new Date().toISOString();

const normalizeForMatching = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const looksLikeUrl = (value: string) => /^https?:\/\//i.test(value.trim());

export const trimText = (value: string, max = 180) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

export const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;

export const inferBikeSegment = (text: string) => {
  const normalized = normalizeForMatching(text);
  if (/(bikes? eletr|bicic|e-bike|cicl)/.test(normalized)) {
    return "bicicletas e bikes elétricas";
  }
  return null;
};

export const inferSegment = (text: string) => {
  const normalized = normalizeForMatching(text);

  if (/(bikes? eletr|bicic|e-bike|cicl)/.test(normalized)) return "bicicletas e bikes elétricas";
  if (/(energia solar|fotovoltaic|usina solar|painel solar|credito de energia|credito solar)/.test(normalized)) {
    return "energia solar";
  }
  if (/(agro|agronegocio|pecas agricolas|tratores?|maquinas agricolas|implementos)/.test(normalized)) {
    return "peças agrícolas e agronegócio";
  }
  if (/(home care|equipamentos? medicos|locacao hospitalar|hospitalar|oxigenio|ventilador pulmonar)/.test(normalized)) {
    return "locação de equipamentos médicos";
  }
  if (/(piscina|tratamento de agua|automacao de piscina|quimic[oa] de piscina)/.test(normalized)) {
    return "automação e tratamento de piscinas";
  }
  if (/(automacao industrial|hidraulica industrial|valvulas?|cilindros? hidraulicos)/.test(normalized)) {
    return "automação industrial";
  }

  return null;
};

export const inferServiceFocus = (text: string) => {
  const normalized = normalizeForMatching(text);
  if (/(ecommerce|loja virtual|catalogo|checkout)/.test(normalized)) return "lojas virtuais";
  if (/(seo|google|busca|conteudo)/.test(normalized)) return "seo e conteúdo";
  if (/(autom|ia|whatsapp|integrac)/.test(normalized)) return "automações e ia";
  return "sites institucionais";
};

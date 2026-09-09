type Client = {
  name: string;
  logo: string;
  segment?: string;
  site?: string;
  surface: string;
  logoClass?: string;
  frameClass?: string;
  invertOnDark?: boolean;
};

export const contact = {
  phone: "(65) 99982-2022",
  whatsappHref: "https://wa.me/5565999822022",
  email: "contato@codigo5.com.br",
  address: "R. Três, 2 - Morada do Ouro, Cuiabá - MT, CEP 78053-208",
};

export const clients: Client[] = [
  {
    name: "PraticLar",
    logo: "/assets/codigo5/clients-extended/praticlar.png",
    segment: "Indústria e varejo",
    site: "praticlar.com.br",
    surface: "light",
  },
  {
    name: "Sonata Musical",
    logo: "/assets/codigo5/client-catalog/sonata-opt.webp",
    segment: "Varejo especializado",
    site: "sonatamusical.com.br",
    surface: "light",
    logoClass: "max-h-10",
    frameClass: "bg-[linear-gradient(135deg,#fffdfa,#efe1c4)]",
  },
  {
    name: "Stilo Assessoria",
    logo: "/assets/codigo5/clients-extended/stiloassessoria.webp",
    segment: "Credito e consignado",
    site: "stiloassessoria.com.br",
    surface: "light",
  },
  {
    name: "CREF17/MT",
    logo: "/assets/codigo5/client-catalog/cref17-official-opt.webp",
    segment: "Institucional",
    site: "cref17.org.br",
    surface: "light",
    logoClass: "max-h-14",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f0f5fb)]",
  },
  {
    name: "Axis Construções",
    logo: "/assets/codigo5/client-catalog/axis-white.png",
    segment: "Construção civil",
    site: "axisconstrucoes.com.br",
    surface: "dark",
    logoClass: "max-h-11",
    invertOnDark: false,
  },
  {
    name: "Calcário Aliança",
    logo: "/assets/codigo5/clients-extended/calcario-alianca.svg",
    segment: "Indústria mineral",
    site: "calcarioalianca.com",
    surface: "sand",
  },
  {
    name: "Clínica Petterle",
    logo: "/assets/codigo5/client-catalog/clinicapetterle-2025.png",
    segment: "Saude",
    site: "clinicapetterle.com.br",
    surface: "light",
    logoClass: "max-h-16",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#eef7f8)]",
  },
  {
    name: "Portal 163",
    logo: "/assets/codigo5/client-catalog/portal163-inline-opt.webp",
    segment: "Mídia regional",
    site: "portal163.com.br",
    surface: "light",
    logoClass: "max-h-10",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f5f3ef)]",
  },
  {
    name: "Perrengue Mato Grosso",
    logo: "/assets/codigo5/client-catalog/perrengue-2026.png",
    segment: "Mídia e entretenimento",
    site: "perrenguematogrosso.com.br",
    surface: "light",
    logoClass: "max-h-12",
    frameClass: "bg-[linear-gradient(135deg,#fffaf3,#f3e3cc)]",
  },
  {
    name: "AlphaVille Buffet",
    logo: "/assets/codigo5/clients/alphaville-opt.webp",
    segment: "Eventos e buffet",
    site: "alphavillebuffet.com.br",
    surface: "dark",
  },
  {
    name: "Fundação Abrigo Bom Jesus",
    logo: "/assets/codigo5/clients/abrigo.png",
    segment: "Instituição social",
    site: "abrigobomjesus.com.br",
    surface: "light",
  },
  {
    name: "IFC",
    logo: "/assets/codigo5/client-catalog/ifc-2026-opt.webp",
    segment: "Igreja e comunidade",
    site: "igrejafamiliadacruz.com.br",
    surface: "dark",
    logoClass: "max-h-14",
    invertOnDark: false,
  },
  {
    name: "A Folha Livre",
    logo: "/assets/codigo5/client-catalog/afolhalivre.png",
    segment: "Mídia regional",
    site: "afolhalivre.com",
    surface: "light",
    logoClass: "max-h-12",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f8f2e8)]",
  },
  {
    name: "Portal Pantanal MT",
    logo: "/assets/codigo5/client-catalog/pantanal-oficial-20260909.webp",
    segment: "Jornalismo digital",
    site: "portalpantanalmt.com",
    surface: "light",
    logoClass: "max-h-12",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f2f7fb)]",
  },
  {
    name: "Portal Norte MT",
    logo: "/assets/codigo5/client-catalog/norte-oficial-20260909.webp",
    segment: "Portal editorial",
    site: "portalnortemt.com",
    surface: "light",
    logoClass: "max-h-12",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f6f4ef)]",
  },
];

export const portfolioClients: Client[] = [
{"name": "AG Consultoria", "segment": "Consultoria", "site": "agconsultoria.codigo5.com.br", "logo": "/assets/codigo5/client-catalog/ag-consultoria-logo-mark-opt.webp", "surface": "light"},
{"name": "Domazi Seguros", "segment": "Seguros", "site": "domaziseguros.com.br", "logo": "/assets/codigo5/client-catalog/domazi-logo.png", "surface": "light"},
{"name": "Glaucia Nadaf", "segment": "Arquitetura", "site": "glaucianadaf.com.br", "logo": "/assets/codigo5/client-catalog/glaucia-nadaf.png", "surface": "muted"},
{"name": "Energia Solidária MT", "segment": "Energia", "site": "energiasolidariamt.com.br", "logo": "/assets/codigo5/client-catalog/energia-solidaria-opt.webp", "surface": "dark"},
{"name": "Clique Sim Notícias", "segment": "Jornalismo digital", "site": "cliquesimnoticias.com.br", "logo": "/assets/codigo5/client-catalog/clique-sim-noticias-opt.webp", "surface": "dark"},
{"name": "Spatium", "segment": "Comunicação", "site": "spatium.top", "logo": "/assets/codigo5/client-catalog/spatium-logo-blue.png", "surface": "light"},
{"name": "Maurício Magalhães", "segment": "Advocacia", "site": "mauriciomagalhaes.adv.br", "logo": "/assets/codigo5/client-catalog/mauricio-magalhaes-logo.png", "surface": "light"},
{"name": "Plastibras", "segment": "Indústria", "site": "plastibras.ind.br", "logo": "/assets/codigo5/client-catalog/plastibras-opt.webp", "surface": "light"},
{"name": "Vini Ortega", "segment": "Esporte e patrocínio", "site": "viniortega.codigo5.com.br", "logo": "/assets/codigo5/client-catalog/vini-ortega-wordmark.svg", "surface": "dark"},
{"name": "Veloztrix", "segment": "Mudanças e transportes", "logo": "/assets/codigo5/client-catalog/veloztrix-logo.png", "surface": "light"},
  { name: "Shop10", segment: "Materiais para construção", site: "shop10mt.com.br", logo: "/assets/codigo5/clients/shop10-opt.webp", surface: "light" },
  { name: "Rbike Shop MT", segment: "Bicicletas e mobilidade elétrica", site: "rbikeshopmt.com.br", logo: "/assets/codigo5/client-catalog/rbike-oficial-20260909.webp", surface: "dark" },
  { name: "Titaniun Implantes", segment: "Tecnologia e produtos para saúde", site: "titaniunimplantes.com.br", logo: "/assets/codigo5/client-catalog/titaniun-opt.webp", surface: "dark" },
  clients.find((client) => client.name === "Perrengue Mato Grosso")!,
  {
    name: "PraticLar",
    segment: "Indústria e varejo de limpeza",
    site: "praticlar.com.br",
    logo: "/assets/codigo5/clients-extended/praticlar.png",
    surface: "light",
  },
  {
    name: "Sonata Musical",
    segment: "Instrumentos musicais",
    site: "sonatamusical.com.br",
    logo: "/assets/codigo5/client-catalog/sonata-opt.webp",
    surface: "light",
    logoClass: "max-h-11",
    frameClass: "bg-[linear-gradient(135deg,#fffdfa,#efe1c4)]",
  },
  {
    name: "Stilo Assessoria",
    segment: "Crédito consignado",
    site: "stiloassessoria.com.br",
    logo: "/assets/codigo5/clients-extended/stiloassessoria.webp",
    surface: "light",
  },
  {
    name: "CREF17/MT",
    segment: "Conselho profissional",
    site: "cref17.org.br",
    logo: "/assets/codigo5/client-catalog/cref17-official-opt.webp",
    surface: "light",
    logoClass: "max-h-14",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f0f5fb)]",
  },
  {
    name: "Axis Construções",
    segment: "Construção civil",
    site: "axisconstrucoes.com.br",
    logo: "/assets/codigo5/client-catalog/axis-white.png",
    surface: "dark",
    logoClass: "max-h-12",
    invertOnDark: false,
  },
  {
    name: "Calcário Aliança",
    segment: "Indústria mineral",
    site: "calcarioalianca.com",
    logo: "/assets/codigo5/clients-extended/calcario-alianca.svg",
    surface: "sand",
  },
  {
    name: "Franca & Moraes",
    segment: "Advocacia empresarial",
    site: "francaemoraes.com.br",
    logo: "/assets/codigo5/client-catalog/francaemoraes-topo.png",
    surface: "light",
    logoClass: "max-h-11",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f4efe7)]",
  },
  {
    name: "Nobres Rações",
    segment: "Nutrição animal",
    site: "nobresracoes.com.br",
    logo: "/assets/codigo5/client-catalog/nobres-racoes.png",
    surface: "light",
    logoClass: "max-h-14",
  },
  {
    name: "Usical",
    segment: "Indústria e concreto",
    site: "usicalnbs.com.br",
    logo: "/assets/codigo5/client-catalog/usical.png",
    surface: "dark",
    logoClass: "max-h-14",
  },
  {
    name: "FlechaTur",
    segment: "Turismo e fretamento",
    site: "flechaturmt.com.br",
    logo: "/assets/codigo5/client-catalog/flechatur-official-opt.webp",
    surface: "sand",
    logoClass: "max-h-10",
  },
  {
    name: "Instituto Mario Cardi",
    segment: "Saúde e instituto",
    site: "institutomariocardi.com.br",
    logo: "/assets/codigo5/client-catalog/mariocardi-blue.webp",
    surface: "light",
    logoClass: "max-h-11",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#eef5fb)]",
  },
  {
    name: "Clínica Petterle",
    segment: "Saúde vascular",
    site: "clinicapetterle.com.br",
    logo: "/assets/codigo5/client-catalog/clinicapetterle-2025.png",
    surface: "light",
    logoClass: "max-h-16",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#eef7f8)]",
  },
  {
    name: "Portal 163",
    segment: "Mídia regional",
    site: "portal163.com.br",
    logo: "/assets/codigo5/client-catalog/portal163-inline-opt.webp",
    surface: "light",
    logoClass: "max-h-10",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f5f3ef)]",
  },
  {
    name: "Regional MT News",
    segment: "Portal de notícias",
    site: "regionalmtnews.com.br",
    logo: "/assets/codigo5/client-catalog/regionalmtnews-opt.webp",
    surface: "dark",
    logoClass: "max-h-12",
  },
  {
    name: "Impacto Geral",
    segment: "Jornalismo digital",
    site: "impactogeral.com.br",
    logo: "/assets/codigo5/client-catalog/impactogeral-inline.png",
    surface: "light",
    logoClass: "max-h-10",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f4f0e8)]",
  },
  {
    name: "O Matogrossense",
    segment: "Portal editorial",
    site: "omatogrossense.com",
    logo: "/assets/codigo5/client-catalog/omatogrossense-oficial-20260909.webp",
    surface: "light",
    logoClass: "max-h-10",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f7f1e6)]",
  },
  {
    name: "Roo Notícias",
    segment: "Notícias locais",
    site: "roonoticias.com",
    logo: "/assets/codigo5/client-catalog/roonoticias-official.png",
    surface: "light",
    logoClass: "max-h-14",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f3f7fb)]",
  },
  {
    name: "AlphaVille Buffet",
    segment: "Eventos e buffet",
    site: "alphavillebuffet.com.br",
    logo: "/assets/codigo5/clients/alphaville-opt.webp",
    surface: "dark",
  },
  {
    name: "Fundação Abrigo Bom Jesus",
    segment: "Instituição social",
    site: "abrigobomjesus.com.br",
    logo: "/assets/codigo5/clients/abrigo.png",
    surface: "light",
  },
  {
    name: "Igreja Família da Cruz",
    segment: "Igreja e comunidade",
    site: "igrejafamiliadacruz.com.br",
    logo: "/assets/codigo5/client-catalog/ifc-2026-opt.webp",
    surface: "dark",
    logoClass: "max-h-14",
    invertOnDark: false,
  },
  {
    name: "A Folha Livre",
    segment: "Portal editorial",
    site: "afolhalivre.com",
    logo: "/assets/codigo5/client-catalog/afolhalivre.png",
    surface: "light",
    logoClass: "max-h-12",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f8f2e8)]",
  },
  {
    name: "Portal Pantanal MT",
    segment: "Jornalismo digital",
    site: "portalpantanalmt.com",
    logo: "/assets/codigo5/client-catalog/pantanal-oficial-20260909.webp",
    surface: "light",
    logoClass: "max-h-12",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f2f7fb)]",
  },
  {
    name: "Portal Norte MT",
    segment: "Portal editorial",
    site: "portalnortemt.com",
    logo: "/assets/codigo5/client-catalog/norte-oficial-20260909.webp",
    surface: "light",
    logoClass: "max-h-12",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#f6f4ef)]",
  },
];

const extraProofClients: Client[] = [
  {
    name: "Roo Notícias",
    logo: "/assets/codigo5/client-catalog/roonoticias-official.png",
    surface: "light",
    logoClass: "max-h-12",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#eef4ff)]",
  },
  {
    name: "Shop10",
    logo: "/assets/codigo5/clients/shop10-opt.webp",
    surface: "light",
    logoClass: "max-h-12",
    frameClass: "bg-[linear-gradient(135deg,#ffffff,#eef4ff)]",
  },
];

const proofClientCatalog = [...portfolioClients, ...clients, ...extraProofClients].filter(
  (client, index, array) => index === array.findIndex((item) => item.name === client.name),
);

export const homeAnchorClients = [
  "Perrengue Mato Grosso",
  "Roo Notícias",
  "Portal Pantanal MT",
  "Portal Norte MT",
  "Shop10",
  "AlphaVille Buffet",
].map((name) => proofClientCatalog.find((client) => client.name === name)).filter(Boolean);

export const supportingProofClients = proofClientCatalog.filter(
  (client) => !homeAnchorClients.some((anchorClient) => anchorClient.name === client.name),
);

export const services = [
  {
    name: "Sites institucionais",
    description: "Mais clareza, confiança e presença comercial melhor resolvida.",
    image: "/assets/codigo5/cases/clinicapetterle-home-opt.webp",
    items: ["Marca", "Clareza", "Contato"],
  },
  {
    name: "Lojas virtuais",
    description: "Loja virtual com estrutura para vender sem parecer improvisada.",
    image: "/assets/codigo5/cases/sonatamusical-home-opt.webp",
    items: ["Catalogo", "Checkout", "Campanha"],
  },
  {
    name: "SEO e conteudo",
    description: "Mais contexto, mais busca qualificada e mais autoridade.",
    image: "/assets/codigo5/cases/roonoticias-home-opt.webp",
    items: ["Busca", "Blog", "Autoridade"],
  },
  {
    name: "Automacoes e IA",
    description: "Atendimento, operação e rotina digital mais conectados.",
    image: "/assets/codigo5/generated/automation-operation-cover.svg",
    items: ["WhatsApp", "Fluxos", "IA"],
  },
];

export const methodologies = [
  {
    name: "Oferta clara",
    detail: "O cliente entende rapido o que a empresa entrega.",
    logos: ["/assets/codigo5/tools/googleanalytics.svg", "/assets/codigo5/tools/googlesearchconsole.svg"],
  },
  {
    name: "Estrutura certa",
    detail: "Site, paginas e blog com navegacao simples.",
    logos: ["/assets/codigo5/tools/wordpress.svg", "/assets/codigo5/tools/cloudflare.svg"],
  },
  {
    name: "Projeto no ar",
    detail: "Tudo entra online com visual forte e leitura leve.",
    logos: ["/assets/codigo5/tools/woocommerce.svg", "/assets/codigo5/tools/elementor.svg"],
  },
  {
    name: "Escala e automacao",
    detail: "Atendimento e rotina conectados quando a operacao pede.",
    logos: ["/assets/codigo5/tools/n8n.svg", "/assets/codigo5/tools/openai.svg"],
  },
];

export const toolLogos = [
  { name: "WordPress", logo: "/assets/codigo5/tools/wordpress.svg" },
  { name: "WooCommerce", logo: "/assets/codigo5/tools/woocommerce.svg" },
  { name: "Elementor", logo: "/assets/codigo5/tools/elementor.svg" },
  { name: "Cloudflare", logo: "/assets/codigo5/tools/cloudflare.svg" },
  { name: "n8n", logo: "/assets/codigo5/tools/n8n.svg" },
  { name: "OpenAI", logo: "/assets/codigo5/tools/openai.svg" },
  { name: "Analytics", logo: "/assets/codigo5/tools/googleanalytics.svg" },
  { name: "Search Console", logo: "/assets/codigo5/tools/googlesearchconsole.svg" },
];

export const useCases = [
  {
    title: "Midia e portais",
    summary: "Home forte, leitura rápida e publicação contínua para audiência regional.",
    image: "/assets/codigo5/cases/roonoticias-home-opt.webp",
    points: ["Portal", "Editorial", "Performance"],
  },
  {
    title: "Clinicas e saude",
    summary: "Mais confiança, mais contexto de serviço e menos ruído no atendimento.",
    image: "/assets/codigo5/cases/clinicapetterle-home-opt.webp",
    points: ["Agenda", "Google Maps", "SEO local"],
  },
  {
    title: "Varejo e catalogo",
    summary: "Catálogo, contato e jornada digital mais organizada para vender melhor.",
    image: "/assets/codigo5/cases/sonatamusical-home-opt.webp",
    points: ["Catalogo", "WhatsApp", "Campanhas"],
  },
];

export const trustNumbers = [
  { label: "Anos de mercado", value: "15+" },
  { label: "Marcas no portifolio", value: "40+" },
  { label: "Segmentos atendidos", value: "10+" },
  { label: "Base local", value: "Cuiaba" },
];

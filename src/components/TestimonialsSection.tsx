import { motion } from "framer-motion";
import { clients, portfolioClients } from "@/content/siteContent";

const TestimonialsSection = () => {
  const normalizeSegment = (segment: string) => {
    const label = segment.toLowerCase();

    if (/(midia|portal|noticias|jornal|editorial|entretenimento)/.test(label)) return "Midia e conteudo";
    if (/(saude|vascular|instituto)/.test(label)) return "Saude e bem-estar";
    if (/(industria|mineral|construcao|concreto)/.test(label)) return "Industria e construcao";
    if (/(varejo|instrumentos|limpeza|nutricao)/.test(label)) return "Varejo e distribuicao";
    if (/(instituicao|conselho|igreja|social)/.test(label)) return "Institucional";
    if (/(advocacia|credito)/.test(label)) return "Servicos profissionais";
    if (/(turismo|eventos|buffet)/.test(label)) return "Turismo e eventos";

    return "Outros segmentos";
  };

  const segmentCounts = portfolioClients.reduce<Record<string, number>>((acc, client) => {
    const group = normalizeSegment(client.segment);
    acc[group] = (acc[group] ?? 0) + 1;
    return acc;
  }, {});

  const highlightSegments = Object.entries(segmentCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <section id="clientes" className="py-24">
      <div className="container space-y-14">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Clientes e experiencia</span>
          <h2 className="mt-3 mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Experiencia visivel em mercados que exigem credibilidade
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            A prova nao esta em uma promessa. Esta nas marcas atendidas, nos segmentos
            recorrentes e no repertorio acumulado em projetos diferentes.
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-4">
          {highlightSegments.map(([segment, count]) => (
            <div
              key={segment}
              className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,243,235,0.88))] p-5 shadow-[0_24px_60px_-48px_rgba(30,25,20,0.38)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Segmento recorrente
              </p>
              <p className="mt-4 font-display text-2xl font-semibold leading-tight text-foreground">
                {segment}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {count} marcas no portifolio
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 rounded-[32px] border border-border bg-card p-8 md:grid-cols-2 xl:grid-cols-3">
          {portfolioClients.map((client, index) => (
            <motion.div
              key={client.name}
              className="rounded-[28px] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,243,234,0.88))] p-5 shadow-[0_24px_60px_-48px_rgba(30,25,20,0.45)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <div
                className={`flex min-h-[120px] items-center justify-center rounded-[24px] border px-6 py-5 shadow-sm ${
                  client.surface === "dark"
                    ? "border-slate-900/80 bg-[radial-gradient(circle_at_top,#2b3240,#09090b_62%)]"
                    : client.surface === "sand"
                      ? "border-amber-200 bg-[linear-gradient(135deg,#fff7e7,#f0dfba)]"
                      : "border-border/70 bg-white"
                }`}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  width="240"
                  height="80"
                  className={`${client.logoClass ?? "max-h-14"} w-auto object-contain ${
                    client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                  }`}
                />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{client.segment}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">{client.name}</h3>
              <p className="mt-2 break-words text-sm text-muted-foreground">{client.site}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-[32px] border border-border bg-card p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Recorte rapido
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-foreground">
                Algumas marcas que reforcam essa trajetoria
              </h3>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                className={`flex min-h-[108px] items-center justify-center rounded-3xl border px-5 py-4 ${
                  client.surface === "dark"
                    ? "border-slate-900/80 bg-slate-950"
                    : client.surface === "sand"
                      ? "border-amber-200 bg-[linear-gradient(135deg,#fff8eb,#f4e3bf)]"
                      : "border-border/70 bg-white"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  width="180"
                  height="56"
                  className={`${client.logoClass ?? "max-h-12"} w-auto object-contain ${
                    client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

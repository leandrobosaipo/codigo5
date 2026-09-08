import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { WorkList, ContactBand } from "@/components/CompanySections";
import { selectedWork } from "@/content/company";
import { portfolioClients } from "@/content/siteContent";
export default function PortfolioPage() {
  const [sector, setSector] = useState("Todos");
  const sectors = ["Todos", ...new Set(selectedWork.map((work) => work.sector))];
  const count = selectedWork.filter((work) => sector === "Todos" || work.sector === sector).length;
  const { hash } = useLocation();
  useEffect(() => {
    if (!["#clientes", "#automacoes"].includes(hash)) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  return (
    <div className="c5-site">
      <Seo
        title="Trabalhos e mercados | Portfólio Código5"
        description="Conheça marcas que fazem parte da trajetória da Código5 em saúde, mídia, comércio, indústria, serviços e instituições."
        path="/portfolio"
      />
      <Navbar />
      <main id="conteudo">
        <section className="c5-page-hero">
          <div className="c5-container">
            <span className="c5-label">Portfólio</span>
            <h1>
              Conheça os projetos da Código5
            </h1>
            <p>
              Automações para atender e produzir conteúdo, sites para apresentar serviços e catálogos para vender. Conheça as soluções atuais e os projetos que construíram nossa experiência.
            </p>
          </div>
        </section>
        <section className="c5-section c5-tinted" id="automacoes">
          <div className="c5-container">
            <div className="c5-section-heading"><span className="c5-label">Sistemas e automações</span><h2>Automações para atender, pesquisar e publicar</h2><p>Projetos próprios e soluções desenvolvidas para rotinas de empresas. Cada operação tem suas regras de revisão e acompanhamento.</p></div>
            <div className="c5-work-grid c5-automation-gallery">
              <article className="c5-work"><div className="c5-work-image"><img src="/assets/codigo5/automacoes/radar-fontes.png" alt="Painel de pesquisa de fontes com dados anonimizados" loading="lazy" width="1440" height="1100" /></div><h3>Radar de fontes e pautas</h3><p>Pesquisa e organização de referências para escolher o que merece apuração. Filtros, fontes e assuntos reunidos em uma tela.</p><small>Captura histórica editada para anonimizar dados.</small></article>
              <article className="c5-work"><div className="c5-work-image"><img src="/assets/codigo5/automacoes/producao-editorial.png" alt="Painel de preparação de rascunhos editoriais com nomes e notícias ocultos" loading="lazy" width="1718" height="918" /></div><h3>Produção e distribuição editorial</h3><p>Preparação de títulos, textos e informações para publicação. O painel acompanha fontes, rascunhos e os destinos de cada conteúdo.</p><small>Captura histórica de simulação; dados anonimizados.</small></article>
              <article className="c5-work"><div className="c5-work-image"><img src="/assets/codigo5/automacoes/atendimento-humanizado.png" alt="Ilustração de atendimento em uma barbearia" loading="lazy" width="1536" height="1024" /></div><h3>JP Prótese Capilar · agenda e atendimento</h3><p>Projeto de acompanhamento de agenda e retornos, com análise de oportunidades e revisão humana. Base para ampliar o atendimento assistido por IA.</p><small>Imagem ilustrativa criada com IA; não retrata o cliente.</small></article>
            </div>
            <p style={{marginBlock:32}}><Link className="c5-button" to="/automacao-com-ia">Conheça as soluções de automação</Link></p>
            <div className="c5-markets">
              {[
                ["Curadoria de vídeos e memes", "Pesquisa e seleção de referências das redes sociais, organização de materiais e revisão antes do aproveitamento editorial."],
                ["Campanhas e comprovantes de anúncios", "O AdOps organiza campanhas dos portais, acompanha a veiculação e reúne evidências para os anunciantes."],
                ["Pautas e distribuição de notícias", "Curadoria, RadarCred e Distribuidor ajudam a acompanhar fontes, preparar pautas e levar chamadas aos canais dos portais."],
                ["Catálogo e atendimento da loja", "Na Rbike, a integração mantém produtos, preços e estoque do catálogo alinhados ao sistema de gestão e apoia o atendimento."],
                ["Áudio e vídeo para publicação", "Ferramentas para transcrever áudios, preparar vídeos e reduzir etapas repetitivas da produção editorial."],
                ["Rotina administrativa", "Sistemas para acompanhar informações financeiras e conectar cadastros e tarefas às ferramentas já usadas pela equipe."],
                ["Acompanhamento dos sites", "Monitoramento, cópias de segurança e alertas para identificar problemas e apoiar a manutenção dos projetos."],
              ].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>
        <section className="c5-section">
          <div className="c5-container">
            <div className="c5-section-heading"><span className="c5-label">Sites, lojas e instituições</span><h2>Projetos publicados e trabalhos do nosso acervo</h2></div>
            <div className="c5-portfolio-filters" role="group" aria-label="Filtrar projetos por mercado">
              {sectors.map((name) => <button key={name} type="button" aria-pressed={sector === name} aria-controls="projetos" onClick={() => setSector(name)}>{name}</button>)}
            </div>
            <p className="c5-result-count" aria-live="polite">{count} projetos · sites, desenvolvimento e suporte</p>
            <div id="projetos"><WorkList sector={sector} /></div>
          </div>
        </section>
        <section className="c5-section" id="clientes">
          <div className="c5-container">
            <div className="c5-section-heading">
              <span className="c5-label">Clientes e marcas da nossa história</span>
              <h2>Empresas e instituições atendidas</h2>
              <p>
                Marcas que fazem parte da nossa trajetória em criação de sites, sistemas e suporte. Os projetos e contratos mudam ao longo do tempo.
              </p>
            </div>
            <div className="c5-client-directory">
              {portfolioClients.map((client) => (
                <article
                  key={client.name}
                  className={client.surface === "dark" ? "is-dark" : client.surface === "muted" ? "is-muted" : ""}
                >
                  {client.logo && (
                    <img
                      src={client.logo}
                      alt=""
                      loading="lazy"
                      width="140"
                      height="65"
                    />
                  )}
                  <strong>{client.name}</strong>
                  <span>{client.segment}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}

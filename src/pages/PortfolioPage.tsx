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
    if (hash !== "#clientes") return;
    const frame = requestAnimationFrame(() => document.getElementById("clientes")?.scrollIntoView());
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
              Sites para apresentar serviços, catálogos para vender, portais para informar. Encontre um projeto próximo do que a sua empresa precisa.
            </p>
          </div>
        </section>
        <section className="c5-section">
          <div className="c5-container">
            <div className="c5-portfolio-filters" role="group" aria-label="Filtrar projetos por mercado">
              {sectors.map((name) => <button key={name} type="button" aria-pressed={sector === name} aria-controls="projetos" onClick={() => setSector(name)}>{name}</button>)}
            </div>
            <p className="c5-result-count" aria-live="polite">{count} projetos · sites, desenvolvimento e suporte</p>
            <div id="projetos"><WorkList sector={sector} /></div>
          </div>
        </section>
        <section className="c5-section c5-tinted">
          <div className="c5-container">
            <div className="c5-section-heading"><span className="c5-label">Sistemas e automações</span><h2>Também cuidamos do trabalho que acontece por trás do site</h2><p>Ferramentas desenvolvidas e usadas nas operações que acompanhamos.</p></div>
            <div className="c5-markets">
              {[
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
                  className={client.surface === "dark" ? "is-dark" : ""}
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

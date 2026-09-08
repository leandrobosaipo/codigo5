import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { WorkList, ContactBand } from "@/components/CompanySections";
import { portfolioClients } from "@/content/siteContent";
export default function PortfolioPage() {
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
              Trabalho real.
              <br />
              Negócios de muitos jeitos.
            </h1>
            <p>
              Uma seleção de projetos e marcas que fazem parte da nossa
              trajetória. Diferentes desafios, públicos e momentos de negócio.
            </p>
          </div>
        </section>
        <section className="c5-section">
          <div className="c5-container">
            <WorkList />
          </div>
        </section>
        <section className="c5-section c5-tinted" id="clientes">
          <div className="c5-container">
            <div className="c5-section-heading">
              <span className="c5-label">Clientes e marcas da nossa história</span>
              <h2>Experiência que atravessa setores.</h2>
              <p>
                Projetos realizados ao longo do tempo. Os sites podem evoluir
                após a entrega original.
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

import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { ServiceList, Method, ContactBand } from "@/components/CompanySections";
export default function ServicesPage() {
  return (
    <div className="c5-site">
      <Seo
        title="Serviços | Sites, sistemas, SEO e automações — Código5"
        description="Desenvolvimento de sites, lojas virtuais, portais, SEO, sistemas, automações e infraestrutura. Conheça as frentes de trabalho da Código5."
        path="/servicos"
      />
      <Navbar />
      <main id="conteudo">
        <section className="c5-page-hero">
          <div className="c5-container">
            <span className="c5-label">Serviços</span>
            <h1>
              Como podemos ajudar sua empresa
            </h1>
            <p>
              Você pode precisar apresentar melhor um serviço, receber pedidos pela internet ou organizar o trabalho da equipe. Veja o que fazemos em cada uma dessas situações.
            </p>
          </div>
        </section>
        <section className="c5-section">
          <div className="c5-container c5-services-expanded">
            <div className="c5-automation-callout"><h2>Atendimento, agenda e conteúdo com IA</h2><p>Conheça as automações para responder clientes, organizar horários, pesquisar fontes e preparar conteúdo para publicação.</p><Link className="c5-button" to="/automacao-com-ia">Conhecer as automações</Link></div>
            <ServiceList expanded />
          </div>
        </section>
        <Method />
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}

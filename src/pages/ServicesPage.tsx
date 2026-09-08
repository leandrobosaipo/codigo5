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

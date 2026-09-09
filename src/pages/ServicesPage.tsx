import { capabilities } from "@/content/company";
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
        schema={capabilities.map(service => ({"@context":"https://schema.org","@type":"Service",name:service.title,description:service.detail,provider:{"@id":"https://codigo5.com.br/#organization"},areaServed:"Brasil"}))}
      />
      <Navbar />
      <main id="conteudo">
        <section className="c5-page-hero">
          <div className="c5-container c5-visual-hero"><div>
            <span className="c5-label">Serviços</span>
            <h1>
              Como podemos ajudar sua empresa
            </h1>
            <p>
              Você pode precisar apresentar melhor um serviço, receber pedidos pela internet ou organizar o trabalho da equipe. Veja o que fazemos em cada uma dessas situações.
            </p>
          </div><figure className="c5-story-photo"><img src="/assets/codigo5/visual/loja-pedidos.webp" alt="Lojista organiza pedidos recebidos pela internet" width="1536" height="1024" fetchPriority="high" /><figcaption>Cena ilustrativa criada com IA.</figcaption></figure></div>
        </section>
        <section className="c5-section">
          <div className="c5-container c5-services-expanded">
            <div className="c5-automation-callout c5-callout-visual"><img src="/assets/codigo5/automacoes/atendimento-humanizado-opt.webp" alt="Atendimento em barbearia, cena ilustrativa criada com IA" width="1536" height="1024" loading="lazy" /><div><h2>Atendimento, agenda e conteúdo com IA</h2><p>Conheça as automações para responder clientes, organizar horários, pesquisar fontes e preparar conteúdo para publicação.</p><Link className="c5-button" to="/automacao-com-ia">Conhecer as automações</Link><small>Cena ilustrativa criada com IA.</small></div></div>
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

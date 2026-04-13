import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProcessSection from "@/components/ProcessSection";
import Seo from "@/components/Seo";
import SolutionsSection from "@/components/SolutionsSection";
import TechStackSection from "@/components/TechStackSection";
import { SITE_URL } from "@/lib/site";

const ServicesPage = () => {
  return (
    <>
      <Seo
        title="Servicos Código5 Web | Sites, ecommerce, SEO e automacoes"
        description="Conheca os servicos da Código5 Web em criacao de sites, ecommerce, SEO, conteudo, integracoes e automacoes."
        path="/servicos"
        keywords="servicos codigo5, criacao de sites cuiaba, ecommerce, seo, automacao"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Desenvolvimento web, SEO, ecommerce e automacoes",
          provider: {
            "@type": "Organization",
            name: "Código5 Web",
          },
          areaServed: "Brasil",
          url: `${SITE_URL}/servicos`,
        }}
      />
      <Navbar />
      <main className="pt-24">
        <section className="border-b border-border bg-background-alt py-20">
          <div className="container max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Servicos</p>
            <h1 className="mt-4 text-balance font-display text-5xl font-bold leading-tight text-foreground">
              Estrutura digital para vender melhor, aparecer mais e automatizar rotinas
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Reunimos site, loja virtual, SEO, conteudo, integracoes e IA aplicada em uma
              estrutura pensada para negocios que precisam resultado e clareza.
            </p>
          </div>
        </section>
        <SolutionsSection />
        <TechStackSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default ServicesPage;

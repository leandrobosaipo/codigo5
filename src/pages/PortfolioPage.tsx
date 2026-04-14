import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import TestimonialsSection from "@/components/TestimonialsSection";
import UseCasesSection from "@/components/UseCasesSection";
import { SITE_URL } from "@/lib/site";

const PortfolioPage = () => {
  return (
    <>
      <Seo
        title="Portfolio Código5 Web | Clientes, segmentos e projetos digitais"
        description="Veja clientes, segmentos atendidos e o tipo de projeto que a Código5 entrega em sites, ecommerce, SEO e automacoes."
        path="/portfolio"
        keywords="portfolio codigo5, clientes codigo5, projetos digitais cuiaba"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Portfolio Código5 Web",
          url: `${SITE_URL}/portfolio`,
          description:
            "Portfolio com clientes, segmentos atendidos e experiencia da Código5 Web em projetos digitais.",
        }}
      />
      <Navbar />
      <main id="conteudo" className="pt-24">
        <section className="border-b border-border bg-background-alt py-20">
          <div className="container max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Portfolio</p>
            <h1 className="mt-4 text-balance font-display text-5xl font-bold leading-tight text-foreground">
              Marcas, segmentos e projetos que ajudam a provar nossa experiencia
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              A Código5 atende negocios de setores diferentes, com foco em estrutura digital,
              presenca de marca e ganho de resultado.
            </p>
          </div>
        </section>
        <TestimonialsSection />
        <UseCasesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default PortfolioPage;

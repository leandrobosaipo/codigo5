import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProcessSection from "@/components/ProcessSection";
import Seo from "@/components/Seo";
import TrustBar from "@/components/TrustBar";
import { SITE_URL } from "@/lib/site";

const AboutPage = () => {
  return (
    <>
      <Seo
        title="Sobre a Código5 Web | Estrategia digital, sites e automacoes em Cuiaba"
        description="Conheca a Código5 Web, nossa forma de trabalhar e como unimos sites, SEO e automacoes para empresas que querem vender melhor online."
        path="/sobre"
        keywords="sobre a codigo5, agencia digital cuiaba, sites em cuiaba, automacao, seo"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Sobre a Código5 Web",
          url: `${SITE_URL}/sobre`,
          description:
            "Pagina institucional da Código5 Web com apresentacao da empresa, metodologia e formas de atendimento.",
        }}
      />
      <Navbar />
      <main className="pt-24">
        <section className="border-b border-border bg-background-alt py-20">
          <div className="container max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Sobre a Código5</p>
            <h1 className="mt-4 text-balance font-display text-5xl font-bold leading-tight text-foreground">
              Estrategia, tecnologia e atendimento direto para tirar projetos do papel
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              A Código5 atende empresas que precisam vender melhor online com um site claro,
              uma estrutura pronta para crescer no Google e automacoes que diminuem retrabalho.
            </p>
          </div>
        </section>
        <TrustBar />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;

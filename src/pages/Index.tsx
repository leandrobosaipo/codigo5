import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import SolutionsSection from "@/components/SolutionsSection";
import TechStackSection from "@/components/TechStackSection";
import UseCasesSection from "@/components/UseCasesSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import EditorialSection from "@/components/EditorialSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const Index = () => {
  return (
    <>
      <Seo
        title="Codigo5 Web | Sites, SEO, IA, Integracoes e Automacoes em Cuiaba"
        description="Site institucional, loja virtual, SEO, blog, integracoes e automacoes para empresas que querem vender melhor online."
        path="/"
        keywords="criacao de sites em cuiaba, seo cuiaba, automacao whatsapp, loja virtual, codigo5"
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Código5 Web",
          url: "https://novo.codigo5.com.br/",
          image: "https://novo.codigo5.com.br/assets/codigo5/logos/logo-dark.webp",
          telephone: "+55-65-99982-2022",
          email: "contato@codigo5.com.br",
          address: {
            "@type": "PostalAddress",
            streetAddress: "R. Três, 2 - Morada do Ouro",
            addressLocality: "Cuiabá",
            addressRegion: "MT",
            postalCode: "78053-208",
            addressCountry: "BR",
          },
        }}
      />
      <Navbar />
      <HeroSection />
      <TrustBar />
      <SolutionsSection />
      <TechStackSection />
      <UseCasesSection />
      <ProcessSection />
      <TestimonialsSection />
      <EditorialSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default Index;

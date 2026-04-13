import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { SITE_URL } from "@/lib/site";

const ContactPage = () => {
  return (
    <>
      <Seo
        title="Contato Código5 Web | WhatsApp, email e atendimento em Cuiaba"
        description="Entre em contato com a Código5 Web para conversar sobre site, ecommerce, SEO, integracoes e automacoes para sua empresa."
        path="/contato"
        keywords="contato codigo5, whatsapp codigo5, agencia digital cuiaba"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contato Código5 Web",
          url: `${SITE_URL}/contato`,
          description:
            "Pagina de contato da Código5 Web com telefone, WhatsApp, email e endereco em Cuiaba.",
        }}
      />
      <Navbar />
      <main className="pt-24">
        <section className="border-b border-border bg-background-alt py-20">
          <div className="container max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Contato</p>
            <h1 className="mt-4 text-balance font-display text-5xl font-bold leading-tight text-foreground">
              Vamos conversar sobre o proximo passo do seu projeto
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              Se voce precisa de um site melhor, uma loja virtual mais forte ou automacoes para
              vender com menos retrabalho, fale direto com a equipe da Código5.
            </p>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;

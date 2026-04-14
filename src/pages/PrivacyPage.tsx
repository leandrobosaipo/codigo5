import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { SITE_URL } from "@/lib/site";

const PrivacyPage = () => {
  return (
    <>
      <Seo
        title="Politica de Privacidade | Código5 Web"
        description="Politica de privacidade da Código5 Web sobre coleta, uso e protecao de dados pessoais."
        path="/politica-de-privacidade"
        keywords="politica de privacidade codigo5, privacidade site"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Politica de Privacidade",
          url: `${SITE_URL}/politica-de-privacidade`,
          description: "Politica de privacidade da Código5 Web.",
        }}
      />
      <Navbar />
      <main id="conteudo" className="pt-24">
        <section className="border-b border-border bg-background-alt py-20">
          <div className="container max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Politica de privacidade
            </p>
            <h1 className="mt-4 text-balance font-display text-5xl font-bold leading-tight text-foreground">
              Como tratamos os dados enviados para a Código5 Web
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Esta pagina resume como usamos informacoes enviadas em formularios, contatos por
              WhatsApp, email e interacoes de navegacao no site.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container max-w-4xl space-y-10 rounded-[32px] border border-border bg-card p-8 sm:p-10">
            <section className="space-y-4">
              <h2 className="font-display text-3xl font-semibold text-foreground">Dados coletados</h2>
              <p className="leading-8 text-muted-foreground">
                Podemos receber nome, telefone, email, empresa e dados enviados voluntariamente em
                pedidos de contato, alem de informacoes tecnicas basicas de navegacao e medicao.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="font-display text-3xl font-semibold text-foreground">Como usamos</h2>
              <p className="leading-8 text-muted-foreground">
                Usamos essas informacoes para responder contatos, apresentar propostas, melhorar o
                conteudo do site e medir acessos com ferramentas de analytics.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="font-display text-3xl font-semibold text-foreground">Compartilhamento</h2>
              <p className="leading-8 text-muted-foreground">
                Os dados nao sao vendidos. Podem ser tratados por plataformas de hospedagem,
                analytics, formulários, email e atendimento, sempre dentro da finalidade de operar
                o site e o relacionamento comercial.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="font-display text-3xl font-semibold text-foreground">Solicitacoes</h2>
              <p className="leading-8 text-muted-foreground">
                Para revisar, corrigir ou pedir exclusao de dados, entre em contato pelo email
                <a href="mailto:contato@codigo5.com.br" className="ml-1 text-primary underline-offset-4 hover:underline">
                  contato@codigo5.com.br
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPage;

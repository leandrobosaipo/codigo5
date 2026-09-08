import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import SectionFrame from "@/components/SectionFrame";
import { SITE_URL } from "@/lib/site";

const PrivacyPage = () => {
  return (
    <div className="c5-site">
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
      <main id="conteudo" >
        <section className="c5-page-hero"><div className="c5-container"><span className="c5-label">Privacidade</span><h1>Como tratamos seus dados.</h1><p>Informações compartilhadas no contato com a Código5 e na navegação pelo site.</p></div></section>
        <section className="pb-16">
          <div className="container">
            <SectionFrame className="max-w-5xl px-6 py-8 sm:px-10 sm:py-10">
              <div className="grid gap-5 md:grid-cols-2">
                <section className="panel-soft px-6 py-6">
                  <h2 className="font-display text-2xl font-semibold text-foreground">Dados coletados</h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    Podemos receber nome, telefone, email, empresa e dados enviados
                    voluntariamente em pedidos de contato, além de informações técnicas básicas de
                    navegação e medição.
                  </p>
                </section>
                <section className="panel-soft px-6 py-6">
                  <h2 className="font-display text-2xl font-semibold text-foreground">Como usamos</h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    Usamos essas informações para responder contatos, apresentar propostas,
                    melhorar o conteúdo do site e medir acessos com ferramentas de analytics.
                  </p>
                </section>
                <section className="panel-soft px-6 py-6">
                  <h2 className="font-display text-2xl font-semibold text-foreground">Compartilhamento</h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    Os dados não são vendidos. Podem ser tratados por plataformas de hospedagem,
                    analytics, formulários, email e atendimento, sempre dentro da finalidade de
                    operar o site e o relacionamento comercial.
                  </p>
                </section>
                <section className="panel-soft px-6 py-6">
                  <h2 className="font-display text-2xl font-semibold text-foreground">Solicitações</h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    Para revisar, corrigir ou pedir exclusão de dados, entre em contato pelo email
                    <a href="mailto:contato@codigo5.com.br" className="ml-1 font-semibold text-primary underline-offset-4 hover:underline">
                      contato@codigo5.com.br
                    </a>
                    .
                  </p>
                </section>
              </div>
            </SectionFrame>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;

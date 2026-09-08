import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { contact } from "@/content/siteContent";
import { ArrowUpRight } from "lucide-react";
export default function ContactPage() {
  return (
    <div className="c5-site">
      <Seo
        title="Contato | Converse com a Código5"
        description="Fale com a Código5 em Cuiabá sobre sites, sistemas, conteúdo e automações. Atendimento pelo WhatsApp e e-mail."
        path="/contato"
      />
      <Navbar />
      <main id="conteudo">
        <section className="c5-page-hero">
          <div className="c5-container">
            <span className="c5-label">Contato</span>
            <h1>
              Vamos conversar sobre o seu projeto
            </h1>
            <p>
              Envie o nome da empresa e conte o que precisa: criar um site, melhorar o atual, montar uma loja ou organizar uma tarefa da equipe.
            </p>
          </div>
        </section>
        <section className="c5-section">
          <div className="c5-container c5-contact-page">
            <div>
              <h2>Conversa direta.</h2>
              <p>Fale pelo WhatsApp para iniciar o atendimento.</p>
              <a
                className="c5-button"
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contact.phone} <ArrowUpRight size={18} />
              </a>
            </div>
            <div>
              <h2>Prefere escrever?</h2>
              <p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
              <p>{contact.address}</p>
              <p>
                Para começar, envie o nome da empresa, o endereço do site, se
                houver, e o que você quer resolver.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

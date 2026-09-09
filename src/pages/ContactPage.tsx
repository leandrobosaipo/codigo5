import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { contact } from "@/content/siteContent";
import { ArrowUpRight, Mail, MapPin, MessageCircle } from "lucide-react";
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
          <div className="c5-container c5-visual-hero"><div>
            <span className="c5-label">Contato</span>
            <h1>
              Vamos conversar sobre o seu projeto
            </h1>
            <p>
              Envie o nome da empresa e conte o que precisa: criar um site, melhorar o atual, montar uma loja ou organizar uma tarefa da equipe.
            </p>
          </div><figure className="c5-story-photo"><img src="/assets/codigo5/visual/conversa-projeto.webp" alt="Conversa sobre as necessidades e páginas de um projeto" width="1200" height="800" fetchPriority="high" /><figcaption>Cena ilustrativa criada com IA; não retrata a equipe.</figcaption></figure></div>
        </section>
        <section className="c5-section">
          <div className="c5-container c5-contact-page">
            <div>
              <h2><MessageCircle aria-hidden="true" /> Conversa direta.</h2>
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
              <h2><Mail aria-hidden="true" /> Prefere escrever?</h2>
              <p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
              <p><MapPin aria-hidden="true" /> {contact.address}</p>
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

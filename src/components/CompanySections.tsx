import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { capabilities, markets, selectedWork } from "@/content/company";
import { contact } from "@/content/siteContent";

export function ServiceList({ expanded = false }: { expanded?: boolean }) {
  const { hash } = useLocation();
  useEffect(() => {
    if (!expanded || !hash) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(hash.slice(1))?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [expanded, hash]);
  return (
    <div className="c5-services">
      {capabilities.map((item) => (
        <article key={item.id} id={item.id} className="c5-service">
          <div>
            <h3>{item.title}</h3>
            <p>{expanded ? item.detail : item.summary}</p>
            {expanded && <ul>{item.items.map((text) => <li key={text}>{text}</li>)}</ul>}
          </div>
          {expanded ? (
            <figure className="c5-service-figure">
              <img src={item.image} alt={`Exemplo de projeto: ${item.caption}`} loading="lazy" width="720" height="480" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ) : (
            <Link
              to={`/servicos#${item.id}`}
              aria-label={`Conhecer ${item.title}`}
            >
              <ArrowUpRight size={25} />
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
export function WorkList({ limit }: { limit?: number }) {
  return (
    <div className="c5-work-grid">
      {selectedWork.slice(0, limit).map((work) => (
        <a
          className="c5-work"
          href={work.url}
          key={work.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="c5-work-image">
            <img
              src={work.image}
              alt={`Página do site ${work.name}`}
              loading="lazy"
              width="720"
              height="480"
            />
          </div>
          <div className="c5-work-caption">
            <div>
              <span className="c5-label">{work.market}</span>
              <h3>{work.name}</h3>
            </div>
            <ArrowUpRight size={23} />
          </div>
          <p>{work.description}</p>
        </a>
      ))}
    </div>
  );
}
export function MarketList() {
  return (
    <div className="c5-markets">
      {markets.map((market) => (
        <article key={market.title}>
          <h3>{market.title}</h3>
          <p>{market.examples}</p>
        </article>
      ))}
    </div>
  );
}
export function Method() {
  return (
    <section className="c5-section c5-method">
      <div className="c5-container">
        <div className="c5-section-heading">
          <span className="c5-label">Como trabalhamos</span>
          <h2>
            Entender primeiro.
            <br />
            Construir com propósito.
          </h2>
        </div>
        <ol>
          {[
            [
              "Conversa e diagnóstico",
              "Entendemos o negócio, a rotina e o que precisa mudar. O ponto de partida pode ser um projeto novo ou uma estrutura que já existe.",
            ],
            [
              "Escopo e execução",
              "Definimos prioridades, entregas e o caminho técnico. Design, conteúdo e desenvolvimento seguem a mesma direção.",
            ],
            [
              "Publicação e evolução",
              "Testamos, colocamos no ar e acompanhamos o funcionamento. Suporte e melhorias entram conforme o escopo combinado.",
            ],
          ].map(([title, text]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
export function ContactBand() {
  return (
    <section className="c5-contact" id="contato">
      <div className="c5-container">
        <div>
          <span className="c5-label">Vamos conversar</span>
          <h2>
            O que o seu negócio
            <br />
            precisa resolver agora?
          </h2>
          <p>
            Conte o momento da empresa. A gente ajuda a definir por onde
            começar.
          </p>
        </div>
        <div className="c5-contact-actions">
          <a
            className="c5-button c5-button-white"
            href={contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conversar no WhatsApp <ArrowUpRight size={18} />
          </a>
          <a href={`mailto:${contact.email}`}>
            {contact.email} <ArrowRight size={16} />
          </a>
          <span>Cuiabá, Mato Grosso · {contact.phone}</span>
        </div>
      </div>
    </section>
  );
}

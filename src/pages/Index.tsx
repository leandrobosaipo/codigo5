import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import {
  ServiceList,
  WorkList,
  MarketList,
  Method,
  ContactBand,
} from "@/components/CompanySections";
import { portfolioClients as clients } from "@/content/siteContent";
import { useRuntimeBlog } from "@/hooks/use-runtime-blog";
import { SITE_URL } from "@/lib/site";
export default function Index() {
  const { featuredPosts } = useRuntimeBlog();
  return (
    <div className="c5-site">
      <Seo
        title="Código5 | Sites, sistemas e operação digital em Cuiabá"
        description="Mais de 15 anos conectando design, desenvolvimento e operação. Sites, e-commerce, SEO, portais, sistemas e automações com IA. Conheça a Código5."
        path="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Código5 Web",
          url: SITE_URL,
          logo: `${SITE_URL}/assets/codigo5/logos/logo-dark.webp`,
        }}
      />
      <Navbar />
      <main id="conteudo">
        <section className="c5-hero" id="hero">
          <div className="c5-container c5-hero-grid">
            <div className="c5-hero-copy">
              <span className="c5-label">
                <i /> De Cuiabá, há mais de 15 anos
              </span>
              <h1>
                Seu negócio.
                <br />
                Nossa experiência.
                <br />
                <span>O próximo passo.</span>
              </h1>
              <p>
                Sites, sistemas e operação digital. Conectamos design, conteúdo
                e tecnologia para a sua empresa se apresentar melhor e trabalhar
                melhor.
              </p>
              <div className="c5-hero-actions">
                <Link className="c5-button" to="/servicos">
                  Conheça o que fazemos <ArrowRight size={18} />
                </Link>
                <Link className="c5-text-link" to="/portfolio">
                  Veja os trabalhos <ArrowUpRight size={17} />
                </Link>
              </div>
              <div className="c5-hero-note">
                Da presença na web à automação do dia a dia.
              </div>
            </div>
            <div
              className="c5-showcase"
              aria-label="Seleção de sites do portfólio Código5"
            >
              <div className="c5-showcase-top">
                <span>Trabalho que já está no mundo</span>
                <span aria-hidden="true">↗</span>
              </div>
              <div className="c5-browser c5-browser-main">
                <div className="c5-browser-bar">
                  <span />
                  <span />
                  <span />
                  <small>clinicapetterle.com.br</small>
                </div>
                <img
                  src="/assets/codigo5/cases/clinicapetterle-2026-09.jpg"
                  alt="Site da Clínica Petterle, projeto do portfólio Código5"
                  width="720"
                  height="480"
                  fetchPriority="high"
                />
              </div>
              <div className="c5-browser c5-browser-secondary">
                <div className="c5-browser-bar">
                  <span />
                  <span />
                  <span />
                  <small>cref17.org.br</small>
                </div>
                <img
                  src="/assets/codigo5/cases/cref17-2026-09.jpg"
                  alt="Site do CREF17/MT, projeto do portfólio Código5"
                  width="720"
                  height="480"
                />
              </div>
              <div className="c5-showcase-bottom">
                <span>Design. Desenvolvimento. Continuidade.</span>
                <Link to="/portfolio" aria-label="Ver portfólio completo">
                  <ArrowUpRight size={24} />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="c5-proof" id="clientes">
          <div className="c5-container">
            <p>
              Parte de uma história construída com empresas de diferentes
              mercados.
            </p>
            <div className="c5-logo-row">
              {[
                "CREF17/MT",
                "Clínica Petterle",
                "Sonata Musical",
                "PraticLar",
                "Portal 163",
                "Stilo Assessoria",
                "Shop10",
                "Rbike Shop MT",
                "FlechaTur",
                "Titaniun Implantes",
                "Perrengue Mato Grosso",
                "Nobres Rações",
              ].map((name) => {
                const client = clients.find((item) => item.name === name)!;
                return (
                  <span key={name} className={client.surface === "dark" ? "c5-logo-dark" : ""}><img
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    width="140"
                    height="58"
                  /></span>
                );
              })}
            </div>
            <Link className="c5-text-link c5-all-clients" to="/portfolio#clientes">Conheça os clientes e seus mercados <ArrowRight size={17} /></Link>
          </div>
        </section>
        <section className="c5-section" id="solucoes">
          <div className="c5-container c5-split">
            <div className="c5-section-heading">
              <span className="c5-label">O que fazemos</span>
              <h2>
                Uma boa presença.
                <br />
                Uma operação
                <br />
                bem resolvida.
              </h2>
              <p>
                O site pode ser o começo. Conteúdo, vendas, atendimento e gestão
                precisam conversar com ele.
              </p>
              <Link className="c5-text-link" to="/servicos">
                Explore os serviços <ArrowRight size={17} />
              </Link>
            </div>
            <ServiceList />
          </div>
        </section>
        <section className="c5-section c5-tinted">
          <div className="c5-container">
            <div className="c5-section-heading c5-heading-row">
              <div>
                <span className="c5-label">Trabalhos selecionados</span>
                <h2>
                  Contextos diferentes.
                  <br />O mesmo cuidado.
                </h2>
              </div>
              <Link className="c5-text-link" to="/portfolio">
                Conheça o portfólio <ArrowRight size={17} />
              </Link>
            </div>
            <WorkList limit={3} />
          </div>
        </section>
        <section className="c5-section" id="casos">
          <div className="c5-container">
            <div className="c5-section-heading c5-heading-row">
              <div>
                <span className="c5-label">Experiência de mercado</span>
                <h2>
                  Conhecer o negócio
                  <br />
                  muda a entrega.
                </h2>
              </div>
              <p>
                Da rotina de uma redação à apresentação de uma clínica. Cada
                mercado tem sua linguagem, suas prioridades e seu jeito de
                atender.
              </p>
            </div>
            <MarketList />
          </div>
        </section>
        <section className="c5-evolution">
          <div className="c5-container c5-split">
            <div>
              <span className="c5-label">A Código5, hoje e adiante</span>
              <h2>
                A experiência da web.
                <br />
                As possibilidades
                <br />
                do que vem agora.
              </h2>
            </div>
            <div>
              <p>
                São mais de 15 anos em projetos digitais. Nesse caminho, a
                criação de sites passou a se conectar com conteúdo, comércio,
                infraestrutura e operação diária.
              </p>
              <p>
                Hoje, avançamos em sistemas próprios, integrações e IA aplicada:
                organizar pautas, transcrever áudio, preparar conteúdo e
                acompanhar tarefas. Tecnologia para resolver trabalho de
                verdade, com revisão e responsabilidade.
              </p>
              <Link className="c5-text-link" to="/sobre">
                Conheça nossa trajetória <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
        <Method />
        <section className="c5-section c5-journal">
          <div className="c5-container">
            <div className="c5-section-heading c5-heading-row">
              <div>
                <span className="c5-label">Do nosso blog</span>
                <h2>Ideias para o seu próximo passo.</h2>
              </div>
              <Link className="c5-text-link" to="/blog">
                Todos os artigos <ArrowRight size={17} />
              </Link>
            </div>
            <div className="c5-articles">
              {featuredPosts.slice(0, 3).map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id}>
                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      width="500"
                      height="280"
                    />
                  )}
                  <span className="c5-label">
                    {post.categories.find(
                      (category) => category.slug !== "blog",
                    )?.name || "Digital e negócios"}
                  </span>
                  <h3>{post.title}</h3>
                  <span className="c5-text-link">
                    Ler artigo <ArrowUpRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}

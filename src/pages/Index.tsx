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
        title="Código5 | Automação com IA e criação de sites em Cuiabá"
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
                <i /> De Cuiabá · experiência de mais de 15 anos
              </span>
              <h1>
                Sites que apresentam. <span>Automações que ajudam a atender.</span>
              </h1>
              <p>
                Criamos sites, lojas e automações com IA para empresas. Do primeiro contato à agenda, da pesquisa à publicação: conectamos as ferramentas para reduzir o trabalho repetido e cuidar melhor de cada cliente.
              </p>
              <div className="c5-hero-actions">
                <Link className="c5-button" to="/automacao-com-ia">
                  Conheça as automações <ArrowRight size={18} />
                </Link>
                <Link className="c5-text-link" to="/portfolio">
                  Conheça os clientes <ArrowUpRight size={17} />
                </Link>
              </div>
              <div className="c5-hero-note">
                Sites, conteúdo e suporte com atendimento direto.
              </div>
            </div>
            <div
              className="c5-showcase"
              aria-label="Seleção de sites do portfólio Código5"
            >
              <div className="c5-showcase-top">
                <span>Projetos para empresas da região</span>
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
                <span>Conheça quem já trabalha com a Código5.</span>
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
        <section className="c5-section c5-tinted"><div className="c5-container c5-automation-hero"><div className="c5-section-heading"><span className="c5-label">A próxima etapa do seu negócio</span><h2>O cliente não precisa esperar você terminar o atendimento</h2><p>Enquanto você trabalha, a automação pode responder dúvidas, organizar pedidos e ajudar a encontrar um horário. Para barbearias, oficinas, clínicas e empresas que precisam dar atenção a cada contato.</p><Link className="c5-button" to="/automacao-com-ia">Ver como funciona</Link></div><figure><img src="/assets/codigo5/automacoes/atendimento-humanizado.png" alt="Atendimento próximo e natural em uma barbearia" loading="lazy" width="1536" height="1024" /><figcaption>Imagem ilustrativa criada com IA.</figcaption></figure></div></section>
        <section className="c5-section" id="solucoes">
          <div className="c5-container c5-split">
            <div className="c5-section-heading">
              <span className="c5-label">O que fazemos</span>
              <h2>
                O que você precisa melhorar na sua empresa?
              </h2>
              <p>
                Um cliente que não encontra informação, um catálogo desatualizado, uma tarefa repetida todos os dias. É a partir dessas necessidades que o projeto começa.
              </p>
              <Link className="c5-text-link" to="/servicos">
                Veja os serviços <ArrowRight size={17} />
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
                  Alguns dos nossos projetos
                </h2>
              </div>
              <Link className="c5-text-link" to="/portfolio">
                Conheça o portfólio <ArrowRight size={17} />
              </Link>
            </div>
            <WorkList limit={6} />
          </div>
        </section>
        <section className="c5-section" id="casos">
          <div className="c5-container">
            <div className="c5-section-heading c5-heading-row">
              <div>
                <span className="c5-label">Experiência de mercado</span>
                <h2>
                  Experiência com empresas como a sua
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
                Quem cuida do site também conhece a sua rotina.
              </h2>
            </div>
            <div>
              <p>
                A Código5 é liderada por Leandro Bosaipo, desenvolvedor web com mais de 15 anos de experiência. O trabalho com empresas de Cuiabá e de outras regiões reúne criação de sites, conteúdo e acompanhamento depois da publicação.
              </p>
              <p>
                Hoje também conectamos os pedidos ao sistema da loja, ajudamos portais a publicar e distribuímos melhor as informações que a equipe precisa. A tecnologia muda, mas a necessidade é concreta: fazer o trabalho andar.
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
                <h2>Dúvidas sobre sites e negócios na internet</h2>
              </div>
              <Link className="c5-text-link" to="/blog">
                Todos os artigos <ArrowRight size={17} />
              </Link>
            </div>
            <div className="c5-articles">
              {featuredPosts.slice(0, 3).map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.slug}>
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

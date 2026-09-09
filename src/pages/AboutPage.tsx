import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { MarketList, ContactBand } from "@/components/CompanySections";
export default function AboutPage() {
  return (
    <div className="c5-site">
      <Seo title="Nossa história | Código5, com Leandro Bosaipo" description="Conheça a Código5, liderada por Leandro Bosaipo. Mais de 15 anos de experiência em sites, lojas e ferramentas para empresas de Cuiabá e de outras regiões." path="/sobre" />
      <Navbar />
      <main id="conteudo">
        <section className="c5-page-hero">
          <div className="c5-container c5-visual-hero"><div>
            <span className="c5-label">Sobre a Código5</span>
            <h1>Um trabalho que continua depois que o site fica pronto.</h1>
            <p>A Código5 é liderada por Leandro Bosaipo, desenvolvedor web com mais de 15 anos de experiência. De Cuiabá, atendemos empresas que precisam se apresentar, vender e cuidar melhor da rotina pela internet.</p>
          </div><figure className="c5-story-photo"><img src="/assets/codigo5/visual/conversa-projeto.webp" alt="Conversa sobre as necessidades e páginas de um projeto" width="1200" height="800" fetchPriority="high" /><figcaption>Cena ilustrativa criada com IA; não retrata a equipe.</figcaption></figure></div>
        </section>
        <section className="c5-section">
          <div className="c5-container c5-split">
            <div className="c5-section-heading">
              <span className="c5-label">De onde vem a nossa experiência</span>
              <h2>Acompanhando o dia a dia de quem empreende</h2>
            </div>
            <div className="c5-prose">
              <p>Sites personalizados e lojas virtuais estão na base da história da Código5. Junto deles vieram a hospedagem, os e-mails profissionais, as atualizações e o suporte: tudo aquilo de que uma empresa precisa para manter seu endereço na internet.</p>
              <p>O trabalho ganhou outras frentes à medida que as necessidades dos clientes apareceram. A loja precisava atualizar os produtos. A clínica queria explicar seus atendimentos. O jornal tinha notícias para publicar e anunciantes para atender. Fazer o site participar dessas rotinas passou a ser parte da entrega.</p>

              <Link className="c5-text-link" to="/portfolio">Conheça esses projetos →</Link>
            </div>
          </div>
          <div className="c5-container c5-story-gallery">
            <figure className="c5-story-photo"><img src="/assets/codigo5/cases/rbike-site-20260909.webp" alt="Catálogo digital da Rbike Shop MT" loading="lazy" width="1536" height="1024" /><figcaption>Rbike Shop MT · catálogo digital ligado à operação da loja.</figcaption></figure>
            <figure className="c5-story-photo"><img src="/assets/codigo5/cases/cref17-2026-09-opt.webp" alt="Site institucional do CREF17/MT" loading="lazy" width="1536" height="1024" /><figcaption>CREF17/MT · informação e serviços para profissionais.</figcaption></figure>
            <figure className="c5-story-photo"><img src="/assets/codigo5/cases/portal163-2026-09-opt.webp" alt="Portal de notícias Portal 163" loading="lazy" width="1536" height="1024" /><figcaption>Portal 163 · publicação e mídia regional.</figcaption></figure>
          </div>
        </section>
        <section className="c5-section c5-tinted">
          <div className="c5-container c5-split">
            <div className="c5-section-heading">
              <span className="c5-label">O que orienta a Código5</span>
              <h2>Ajudar a empresa a atender melhor quem precisa dela</h2><figure className="c5-story-photo"><img src="/assets/codigo5/visual/loja-pedidos.webp" alt="Rotina de pedidos de uma pequena loja" width="1200" height="800" loading="lazy" /><figcaption>Cena ilustrativa criada com IA.</figcaption></figure>
            </div>
            <div className="c5-prose">
              <p>Um site tem utilidade quando alguém consegue encontrar um serviço, entender um produto ou fazer um pedido. Um sistema faz diferença quando a equipe encontra a informação certa e deixa de repetir trabalho. São essas situações que dão sentido ao que construímos.</p>
              <p>Por isso, a conversa começa pela sua empresa: o que vende, como atende, quem precisa alcançar e onde o trabalho está difícil. A partir daí, definimos o que será feito e quais ferramentas fazem sentido.</p>
              <p>O contato é direto e o acompanhamento é combinado desde o início. Você sabe o que está contratando, o que precisa fornecer e a quem recorrer quando surgir uma dúvida.</p>
            </div>
          </div>
        </section>
        <section className="c5-section">
          <div className="c5-container">
            <div className="c5-section-heading"><span className="c5-label">Com quem trabalhamos</span><h2>Empresas, profissionais e instituições</h2></div>
            <div style={{marginTop:40}}><MarketList /></div>
          </div>
        </section>
        <section className="c5-evolution">
          <div className="c5-container c5-split">
            <div><span className="c5-label">O trabalho que estamos ampliando</span><h2>Dos sites às automações que acompanham o trabalho</h2></div>
            <div>
              <figure className="c5-story-photo"><img src="/assets/codigo5/automacoes/radar-fontes-opt.webp" alt="Painel de pesquisa de fontes com dados anonimizados" loading="lazy" width="1440" height="1100" /><figcaption>Radar de fontes · captura histórica com dados anonimizados.</figcaption></figure>
              <p>Sites, lojas e aplicativos construíram a nossa experiência. A frente que estamos ampliando agora é a automação com IA: responder contatos, acompanhar agendas, pesquisar fontes e preparar conteúdo. O conhecimento da rotina dos clientes orienta o que precisa ser conectado.</p>
              <p>A inteligência artificial já participa de tarefas de conteúdo e transcrição. O critério é ter uma função definida, conferir a saída e acompanhar o uso. A experiência com os sites continua sendo a base para escolher o que vale a pena construir.</p>
              <Link className="c5-text-link" to="/automacao-com-ia">Veja como isso pode ajudar sua empresa →</Link>
            </div>
          </div>
        </section>
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}

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
          <div className="c5-container">
            <span className="c5-label">Sobre a Código5</span>
            <h1>Um trabalho que continua depois que o site fica pronto.</h1>
            <p>A Código5 é liderada por Leandro Bosaipo, desenvolvedor web com mais de 15 anos de experiência. De Cuiabá, atendemos empresas que precisam se apresentar, vender e cuidar melhor da rotina pela internet.</p>
          </div>
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
              <p>É uma experiência construída com negócios de portes e setores diferentes. Na Rbike, o catálogo acompanha os produtos e o estoque da loja. No CREF17/MT, o site reúne informações e serviços para profissionais. Nos portais, o trabalho inclui publicação, distribuição de notícias e acompanhamento da publicidade.</p>
              <Link className="c5-text-link" to="/portfolio">Conheça esses projetos →</Link>
            </div>
          </div>
        </section>
        <section className="c5-section c5-tinted">
          <div className="c5-container c5-split">
            <div className="c5-section-heading">
              <span className="c5-label">O que orienta a Código5</span>
              <h2>Ajudar a empresa a atender melhor quem precisa dela</h2>
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
            <div><span className="c5-label">O trabalho que estamos ampliando</span><h2>Conectar o site ao que acontece dentro da empresa</h2></div>
            <div>
              <p>Estamos ampliando os sistemas e as automações que aproximam vendas, atendimento, conteúdo e gestão. Um cadastro pode alimentar mais de uma ferramenta. Um pedido pode chegar organizado à equipe. Um áudio pode virar texto para revisão.</p>
              <p>A inteligência artificial já participa de tarefas de conteúdo e transcrição. O critério é ter uma função definida, conferir a saída e acompanhar o uso. A experiência com os sites continua sendo a base para escolher o que vale a pena construir.</p>
              <Link className="c5-text-link" to="/servicos">Veja como isso pode ajudar sua empresa →</Link>
            </div>
          </div>
        </section>
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}

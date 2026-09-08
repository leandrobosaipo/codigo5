import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { MarketList, Method, ContactBand } from "@/components/CompanySections";
export default function AboutPage() {
  return (
    <div className="c5-site">
      <Seo
        title="A Código5 | Mais de 15 anos em projetos digitais"
        description="De Cuiabá, a Código5 conecta design, desenvolvimento, conteúdo e operação. Conheça nossa experiência e o caminho para sistemas e IA aplicada."
        path="/sobre"
      />
      <Navbar />
      <main id="conteudo">
        <section className="c5-page-hero">
          <div className="c5-container">
            <span className="c5-label">A Código5</span>
            <h1>
              A tecnologia muda.
              <br />O compromisso com
              <br />o trabalho continua.
            </h1>
            <p>
              Mais de 15 anos em projetos digitais, com base em Cuiabá e
              experiência em negócios que vendem, informam, atendem e movimentam
              a região.
            </p>
          </div>
        </section>
        <section className="c5-section">
          <div className="c5-container c5-split">
            <div className="c5-section-heading">
              <span className="c5-label">Nossa trajetória</span>
              <h2>
                Começamos pela web.
                <br />
                Seguimos com
                <br />o negócio.
              </h2>
            </div>
            <div className="c5-prose">
              <p>
                A Código5 reúne criação e trabalho técnico. Sites
                institucionais, lojas e portais fazem parte dessa história,
                construída com empresas de saúde, varejo, indústria, serviços e
                comunicação.
              </p>
              <p>
                Ao acompanhar esses projetos, o trabalho se ampliou: conteúdo,
                busca, infraestrutura, manutenção e integração entre
                ferramentas. Porque publicar um site é uma etapa; fazer ele
                participar da rotina da empresa é um trabalho contínuo.
              </p>
              <p>
                O atendimento é direto. Entendemos o contexto, definimos um
                escopo viável e acompanhamos a entrega. Reaproveitamos o que
                funciona e desenvolvemos o que o projeto realmente precisa.
              </p>
            </div>
          </div>
        </section>
        <section className="c5-section c5-tinted">
          <div className="c5-container">
            <div className="c5-section-heading">
              <span className="c5-label">Repertório</span>
              <h2>Experiência em diferentes mercados.</h2>
            </div>
            <div style={{ marginTop: 40 }}>
              <MarketList />
            </div>
          </div>
        </section>
        <section className="c5-evolution">
          <div className="c5-container c5-split">
            <div>
              <span className="c5-label">Para onde seguimos</span>
              <h2>
                Mais conexão entre
                <br />
                presença e operação.
              </h2>
            </div>
            <div>
              <p>
                Estamos ampliando o trabalho com sistemas sob medida, automações
                e IA aplicada. A direção é conectar informação, atendimento,
                conteúdo e gestão, reduzindo tarefas repetitivas.
              </p>
              <p>
                Esse caminho já aparece nas rotinas editoriais, nos painéis de
                acompanhamento, na transcrição de áudio e na organização de
                campanhas. Novas soluções são desenvolvidas a partir de
                problemas concretos, com testes e revisão humana.
              </p>
              <p>
                Cada projeto recebe a tecnologia adequada ao momento. Nem toda
                necessidade pede um sistema novo, e nem toda tarefa precisa de
                IA.
              </p>
            </div>
          </div>
        </section>
        <Method />
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}

import { Scissors, Wrench, HeartPulse, Smile, ShoppingBag, Newspaper, CircleHelp } from "lucide-react";
import { automationVisuals } from "@/content/visuals";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { ContactBand } from "@/components/CompanySections";
import content from "@/content/automations.json";
import { contact } from "@/content/siteContent";

export default function AutomationPage() {
  return <div className="c5-site">
    <Seo title={content.seoTitle} description={content.description} path="/automacao-com-ia" schema={{"@context":"https://schema.org","@type":"Service",name:content.title,description:content.description,provider:{"@type":"Organization",name:"Código5",url:"https://codigo5.com.br"},areaServed:"Brasil"}} />
    <Navbar />
    <main id="conteudo">
      <section className="c5-page-hero"><div className="c5-container c5-automation-hero">
        <div><span className="c5-label">Automação com inteligência artificial</span><h1>{content.title}</h1><p>{content.intro}</p><a className="c5-button" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">Conversar sobre minha operação</a></div>
        <figure><img src={content.image} alt="Profissional atendendo um cliente enquanto a rotina de agendamento pode ser apoiada pela automação" width="1536" height="1024" /><figcaption>Cena ilustrativa criada com IA.</figcaption></figure>
      </div></section>
      <section className="c5-section"><div className="c5-container"><div className="c5-section-heading"><span className="c5-label">O que podemos automatizar</span><h2>Menos tarefas repetidas. Mais tempo para atender.</h2><p>Começamos por uma rotina definida, conectamos as ferramentas e acompanhamos o funcionamento com a sua equipe.</p></div>
        <div className="c5-automation-solutions">{content.solutions.map(item => {
          const visual = automationVisuals.find(visual => visual.id === item.id)!;
          return <article id={item.id} key={item.id}>
            <figure className="c5-solution-image"><img src={visual.image} alt={visual.alt} width="1200" height="800" loading="lazy" /><figcaption>{visual.caption}</figcaption></figure>
            <div className="c5-solution-copy"><span className="c5-service-audience">{visual.audience}</span><h3>{item.title}</h3>
              <ol className="c5-flow" aria-label="Como funciona">{visual.steps.map(step => <li key={step}>{step}</li>)}</ol>
              <details className="c5-solution-details"><summary>O que entra no projeto</summary><p>{item.text}</p><ul>{item.items.map(text=><li key={text}>{text}</li>)}</ul></details>
            </div>
          </article>;
        })}</div>
      </div></section>
      <section className="c5-section c5-tinted"><div className="c5-container"><div className="c5-section-heading"><span className="c5-label">Para o seu tipo de negócio</span><h2>O atendimento muda de uma empresa para outra</h2><p>As respostas, os horários e as regras precisam acompanhar a forma como você trabalha.</p></div><div className="c5-market-cards c5-business-cards">{content.markets.map((item,index) => {
          const Icon = [Scissors, Wrench, HeartPulse, Smile, ShoppingBag, Newspaper][index];
          return <article key={item.title}><span className="c5-market-icon"><Icon size={30} strokeWidth={1.6} aria-hidden="true" /></span><h3>{item.title}</h3><p>{item.text}</p></article>;
        })}</div></div></section>
      <section className="c5-section"><div className="c5-container c5-visual-hero"><div><div className="c5-section-heading"><span className="c5-label">Experiência em projetos</span><h2>Ferramentas que fazem parte do nosso trabalho</h2><p>Pesquisa de fontes, curadoria de redes sociais, distribuição editorial, campanhas, integrações de catálogo e acompanhamento de agenda.</p></div><Link className="c5-button" to="/portfolio#automacoes">Ver projetos de automação</Link></div><figure className="c5-story-photo"><img src="/assets/codigo5/automacoes/radar-fontes-opt.webp" alt="Painel do Radar de fontes" width="1440" height="1100" loading="lazy" /><figcaption>Captura histórica com dados anonimizados.</figcaption></figure></div></section>
      <section className="c5-section c5-tinted"><div className="c5-container"><div className="c5-section-heading"><CircleHelp className="c5-section-icon" size={40} aria-hidden="true" /><h2>Antes de começar</h2></div><div className="c5-faq">{content.faq.map(item=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section>
      <ContactBand />
    </main><Footer />
  </div>;
}

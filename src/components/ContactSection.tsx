import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import { contact } from "@/content/siteContent";

const ContactSection = () => {
  const demandCards = [
    {
      title: "Site institucional",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      text: "Para empresa que precisa se apresentar melhor.",
    },
    {
      title: "Loja virtual",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      text: "Para vender catalogo, pedido e campanha no mesmo fluxo.",
    },
    {
      title: "SEO e conteudo",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      text: "Para aparecer melhor e parecer referencia no mercado.",
    },
    {
      title: "WhatsApp e automacao",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      text: "Para responder mais rapido e organizar a rotina comercial.",
    },
  ];

  return (
    <section
      id="contato"
      className="border-t border-border bg-[linear-gradient(180deg,#f5efe5_0%,#fbf8f3_52%,#fffdf9_100%)] py-24"
    >
      <div className="container">
        <Reveal
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="section-kicker">Contato</span>
          <h2 className="section-heading">
            Quando o projeto pede resposta, a conversa pode começar agora
          </h2>
          <p className="section-lead">
            O caminho mais rápido é pelo WhatsApp. O restante fica pronto para quem prefere outro formato.
          </p>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal
            className="space-y-8"
          >
            <div className="panel-dark p-6 text-slate-50">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">Caminho mais rapido</p>
              <h3 className="mt-3 font-display text-3xl font-semibold text-white">
                Fale pelo WhatsApp e descubra o melhor formato para o seu projeto.
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                Site, loja virtual, SEO, conteúdo, automação ou integração. A conversa pode começar pelo ponto que hoje mais trava sua operação.
              </p>
              <Button asChild className="mt-5">
                <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                  Falar no WhatsApp
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-4 rounded-[24px] border border-border/70 bg-white/88 p-5 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.16)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">Endereco</h3>
                <p className="text-sm font-medium text-foreground/72">{contact.address}</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-[24px] border border-border/70 bg-white/88 p-5 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.16)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">Telefone / WhatsApp</h3>
                <p className="text-sm font-medium text-foreground/72">{contact.phone}</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-[24px] border border-border/70 bg-white/88 p-5 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.16)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">E-mail</h3>
                <p className="text-sm font-medium text-foreground/72">{contact.email}</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-[24px] border border-border/70 bg-white/88 p-5 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.16)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">Horario</h3>
                <p className="text-sm font-medium text-foreground/72">Segunda a Sexta: 09:00 – 18:00</p>
              </div>
            </div>
            </div>

            <div className="h-48 overflow-hidden rounded-[24px] border border-border shadow-[0_24px_70px_-54px_rgba(30,25,20,0.16)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3842.0!2d-56.07!3d-15.57!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDM0JzEyLjAiUyA1NsKwMDQnMTIuMCJX!5e0!3m2!1spt-BR!2sbr!4v1!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localizacao Codigo5 Web"
              />
            </div>
          </Reveal>

          <Reveal
            className="grid gap-6 sm:grid-cols-2"
            delay={80}
          >
            {demandCards.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[30px] border border-border/80 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.2)]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full min-h-[240px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,12,0.12),rgba(20,16,12,0.82))]" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-white">{item.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/88">{item.text}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

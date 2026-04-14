import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact } from "@/content/siteContent";

const ContactSection = () => {
  const demandCards = [
    {
      title: "Site institucional",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Loja virtual",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "SEO e conteudo",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "WhatsApp e automacao",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <section
      id="contato"
      className="border-t border-border bg-[linear-gradient(180deg,#f5efe5_0%,#fbf8f3_52%,#fffdf9_100%)] py-24"
    >
      <div className="container">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Contato</span>
          <h2 className="mt-3 mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Se a ideia faz sentido, a conversa pode comecar agora
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            O caminho mais rapido e pelo WhatsApp. Se preferir, tambem tem e-mail e mapa.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-4 rounded-[24px] border border-border/70 bg-white/78 p-5 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.16)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">Endereco</h3>
                <p className="text-sm text-muted-foreground">{contact.address}</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-[24px] border border-border/70 bg-white/78 p-5 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.16)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">Telefone / WhatsApp</h3>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-[24px] border border-border/70 bg-white/78 p-5 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.16)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">E-mail</h3>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-[24px] border border-border/70 bg-white/78 p-5 shadow-[0_24px_70px_-54px_rgba(30,25,20,0.16)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">Horario</h3>
                <p className="text-sm text-muted-foreground">Segunda a Sexta: 09:00 – 18:00</p>
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-900/85 bg-[radial-gradient(circle_at_top,#2b3240,#09090b_62%)] p-6 text-slate-50 shadow-[0_30px_90px_-58px_rgba(15,15,15,0.6)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">Caminho mais rapido</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Se a ideia ja esta clara, vale abrir a conversa agora e entender o melhor formato.
              </p>
              <Button asChild className="mt-5">
                <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                  Falar no WhatsApp
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
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
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
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
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,12,0.08),rgba(20,16,12,0.76))]" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                    Demanda
                  </span>
                  <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

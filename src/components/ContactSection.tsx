import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact } from "@/content/siteContent";

const ContactSection = () => {
  return (
    <section id="contato" className="py-24">
      <div className="container">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Contato</span>
          <h2 className="mt-3 mb-4 text-3xl font-bold text-foreground sm:text-4xl">Quer tirar isso do papel?</h2>
          <p className="text-lg text-muted-foreground">
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
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">Endereco</h3>
                <p className="text-sm text-muted-foreground">{contact.address}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">Telefone / WhatsApp</h3>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">E-mail</h3>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-display font-semibold text-foreground">Horario</h3>
                <p className="text-sm text-muted-foreground">Segunda a Sexta: 09:00 – 18:00</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-primary/20 bg-primary/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Caminho mais rapido</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Se a ideia ja esta clara, a conversa pode comecar por aqui.
              </p>
              <Button asChild className="mt-5">
                <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                  Falar no WhatsApp
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="h-48 overflow-hidden rounded-lg border border-border">
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
            {[
              "Novo site institucional",
              "Loja virtual",
              "SEO local e blog",
              "WhatsApp e automacao",
            ].map((item) => (
              <div key={item} className="rounded-[28px] border border-border bg-card p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Demanda</p>
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">{item}</h3>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Clock, Send, Mail, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contact } from "@/content/siteContent";

const ContactSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Contato registrado!", description: "Use o WhatsApp para acelerar a conversa com a Codigo5." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="contato" className="py-24">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Contato</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Vamos transformar a presenca digital da sua empresa em ativo comercial
          </h2>
          <p className="text-muted-foreground text-lg">
            O melhor proximo passo e alinhar oferta, site, conteudo e automacoes em uma estrategia unica.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Endereço</h3>
                <p className="text-sm text-muted-foreground">{contact.address}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Telefone / WhatsApp</h3>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">E-mail</h3>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Horário</h3>
                <p className="text-sm text-muted-foreground">Segunda a Sexta: 09:00 – 18:00</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-primary/20 bg-primary/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Canal mais rapido
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Para orcamento, diagnostico ou ideia de automacao, o WhatsApp tende a
                gerar resposta mais rapida e contexto comercial mais completo.
              </p>
              <Button asChild className="mt-5">
                <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                  Abrir conversa
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden border border-border h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3842.0!2d-56.07!3d-15.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDM0JzEyLjAiUyA1NsKwMDQnMTIuMCJX!5e0!3m2!1spt-BR!2sbr!4v1!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Código5 Web"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5 p-8 rounded-lg bg-card border border-border"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label>
                <Input placeholder="Seu nome" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Empresa</label>
                <Input placeholder="Sua empresa" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">E-mail</label>
              <Input type="email" placeholder="seu@email.com" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Telefone</label>
              <Input placeholder="(00) 00000-0000" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">O que voce quer vender ou automatizar?</label>
              <Textarea placeholder="Ex.: novo site institucional, loja virtual, SEO local, atendimento no WhatsApp, integracao com CRM..." rows={4} required />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Enviando..." : (
                <>
                  Solicitar Diagnóstico Gratuito
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import { contact, homeAnchorClients } from "@/content/siteContent";

const ContactSection = () => {
  return (
    <section
      id="contato"
      className="border-t border-white/8 bg-[linear-gradient(180deg,#091322_0%,#0d1930_100%)] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="container space-y-8 sm:space-y-10">
        <Reveal>
          <SectionHeader
            kicker="Pronto para começar"
            title="Se a operação digital atual já não acompanha a empresa, a conversa pode começar agora."
            lead="O foco é entender o que hoje trava venda, presença ou operação e transformar isso em uma direção clara."
            invert
            aside="O WhatsApp costuma ser o caminho mais rápido, mas a conversa também pode começar por site, ecommerce, conteúdo ou SEO."
          />
        </Reveal>

        <SectionFrame dark className="overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-stretch sm:gap-8">
            <Reveal className="panel-dark overflow-hidden text-white">
              <div className="grid gap-0 lg:grid-cols-[1.04fr_0.96fr]">
                <div className="flex flex-col justify-between p-5 sm:p-7">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                      Briefing rápido
                    </p>
                    <h3 className="mt-4 max-w-lg font-display text-3xl font-semibold leading-tight sm:text-4xl">
                      Conte o que hoje trava venda, presença ou operação.
                    </h3>
                    <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
                      Pode ser site antigo, conteúdo que não gera contato, ecommerce travado ou rotina comercial desorganizada.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      "Site institucional e reposicionamento",
                      "Loja virtual e operação comercial",
                      "SEO, blog e conteúdo por segmento",
                      "Automação e integrações",
                    ].map((item) => (
                      <div key={item} className="rounded-[18px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-200 sm:rounded-[20px]">
                        {item}
                      </div>
                    ))}
                  </div>

                  <Button asChild className="mt-8 w-fit">
                    <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                      Falar no WhatsApp
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="grid min-h-[280px] gap-3 bg-[linear-gradient(180deg,#0a1322,#111f39)] p-5 sm:grid-cols-2 sm:p-6">
                  {homeAnchorClients.slice(0, 4).map((client) => (
                    <div
                      key={client.name}
                      className={`flex min-h-[112px] items-center justify-center rounded-[22px] border px-4 py-4 ${
                        client.surface === "dark" ? "border-white/10 bg-slate-950" : client.frameClass ?? "border-white/10 bg-white/92"
                      }`}
                    >
                      <img
                        src={client.logo}
                        alt={client.name}
                        loading="lazy"
                        className={`${client.logoClass ?? "max-h-10"} max-w-full w-auto object-contain ${
                          client.surface === "dark" && client.invertOnDark !== false ? "brightness-0 invert" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: MapPin, title: "Base local", text: contact.address },
                  { icon: Phone, title: "WhatsApp", text: contact.phone },
                  { icon: Mail, title: "E-mail", text: contact.email },
                  { icon: ArrowUpRight, title: "Formato", text: "Projetos sob medida para site, ecommerce, SEO e automação." },
                ].map((item) => (
                  <Reveal
                    key={item.title}
                    className="rounded-[22px] border border-white/10 bg-white/6 p-4 shadow-[0_22px_70px_-54px_rgba(2,8,18,0.4)] backdrop-blur sm:rounded-[26px] sm:p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10">
                      <item.icon className="h-5 w-5 text-cyan-200" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-white sm:mt-5 sm:text-2xl">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                  </Reveal>
                ))}
              </div>

              <Reveal className="overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 shadow-[0_24px_70px_-56px_rgba(2,8,18,0.45)] sm:rounded-[28px] sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                  O que acontece depois
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {[
                    { step: "01", title: "Entendimento", text: "Ler o momento da empresa e o objetivo real do projeto." },
                    { step: "02", title: "Direção", text: "Apontar o melhor formato entre site, loja, SEO e automação." },
                    { step: "03", title: "Escopo", text: "Transformar a conversa em plano claro de execução." },
                  ].map((item) => (
                    <div key={item.step} className="rounded-[22px] border border-white/10 bg-black/12 px-4 py-4">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/84">
                        Etapa {item.step}
                      </span>
                      <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </SectionFrame>
      </div>
    </section>
  );
};

export default ContactSection;

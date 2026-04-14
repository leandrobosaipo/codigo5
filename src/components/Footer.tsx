import { contact } from "@/content/siteContent";

const Footer = () => {
  return (
    <footer className="bg-ink py-14 text-ink-foreground">
      <div className="container">
        <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-flex rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] px-5 py-4 shadow-[0_24px_70px_-50px_rgba(0,0,0,0.55)] backdrop-blur">
              <img src="/assets/codigo5/logos/logo-invertida.png" alt="Codigo5 Web" className="h-11 w-auto" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-foreground/70">
              Sites, ecommerce, SEO, conteudo, integracoes e automacoes para empresas
              que querem vender melhor online.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-display font-semibold">Solucoes</h4>
            <ul className="space-y-2 text-sm text-ink-foreground/70">
              <li>Sites e landing pages</li>
              <li>Lojas virtuais</li>
              <li>SEO e conteudo</li>
              <li>Automacoes e IA</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display font-semibold">Links</h4>
            <ul className="space-y-2 text-sm text-ink-foreground/70">
              <li><a href="/#solucoes" className="transition-colors hover:text-ink-foreground">Servicos</a></li>
              <li><a href="/#clientes" className="transition-colors hover:text-ink-foreground">Clientes</a></li>
              <li><a href="/blog" className="transition-colors hover:text-ink-foreground">Blog</a></li>
              <li><a href="/#contato" className="transition-colors hover:text-ink-foreground">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display font-semibold">Contato</h4>
            <ul className="space-y-2 text-sm text-ink-foreground/70">
              <li>{contact.phone}</li>
              <li>{contact.email}</li>
              <li>Cuiaba - MT</li>
              <li>
                <a href="https://codigo5.com.br" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink-foreground">
                  codigo5.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-foreground/10 pt-8 text-center text-sm text-ink-foreground/50">
          © {new Date().getFullYear()} Codigo5 Web. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

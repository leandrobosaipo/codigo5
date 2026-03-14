const Footer = () => {
  return (
    <footer className="py-12 bg-navy text-navy-foreground">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-4">
              Código<span className="text-primary">5</span> Web
            </h3>
            <p className="text-sm text-navy-foreground/70 leading-relaxed">
              Soluções em desenvolvimento de software, consultoria tecnológica e transformação digital.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm text-navy-foreground/70">
              <li>Consultoria de TI</li>
              <li>Desenvolvimento de Software</li>
              <li>Manutenção de Software</li>
              <li>Soluções com IA</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-navy-foreground/70">
              <li><a href="#sobre" className="hover:text-navy-foreground transition-colors">Sobre</a></li>
              <li><a href="#servicos" className="hover:text-navy-foreground transition-colors">Serviços</a></li>
              <li><a href="#portfolio" className="hover:text-navy-foreground transition-colors">Portfólio</a></li>
              <li><a href="#contato" className="hover:text-navy-foreground transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-navy-foreground/70">
              <li>(65) 99982-2022</li>
              <li>Cuiabá – MT</li>
              <li>
                <a href="https://codigo5.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-navy-foreground transition-colors">
                  codigo5.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-foreground/10 pt-8 text-center text-sm text-navy-foreground/50">
          © {new Date().getFullYear()} Código5 Web. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

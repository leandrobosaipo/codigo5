import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { contact } from "@/content/siteContent";
const links = [
  ["Automação com IA", "/automacao-com-ia"],
  ["Serviços", "/servicos"],
  ["Trabalhos", "/portfolio"],
  ["A Código5", "/sobre"],
  ["Blog", "/blog"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="c5-header">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <nav className="c5-container c5-nav" aria-label="Navegação principal">
        <Link to="/" className="c5-logo" aria-label="Código5 — início">
          <img
            src="/assets/codigo5/logos/logo-invertida-opt.webp"
            alt="Código5"
            width="132"
            height="44"
          />
        </Link>
        <div className="c5-desktop-nav">
          {links.map(([label, href]) => (
            <Link
              key={href}
              to={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <a
            className="c5-button"
            href={contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vamos conversar <ArrowUpRight size={16} />
          </a>
        </div>
        <button
          className="c5-menu-button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="c5-mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <nav
          id="c5-mobile-nav"
          className="c5-mobile-nav"
          aria-label="Navegação móvel"
        >
          {links.map(([label, href]) => (
            <Link key={href} to={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link to="/contato">Contato</Link>
        </nav>
      )}
    </header>
  );
}

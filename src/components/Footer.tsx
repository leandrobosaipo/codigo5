import { Link } from "react-router-dom";
import { contact } from "@/content/siteContent";
export default function Footer() {
  return (
    <footer className="c5-footer">
      <div className="c5-container">
        <div className="c5-footer-top">
          <Link to="/" className="c5-logo">
            <img
              src="/assets/codigo5/logos/logo-invertida.png"
              alt="Código5"
              width="132"
              height="44"
            />
          </Link>
          <p>
            Sites, sistemas e suporte
            <br />para a sua empresa.
          </p>
          <nav aria-label="Navegação do rodapé">
            <Link to="/servicos">Serviços</Link>
            <Link to="/portfolio">Trabalhos</Link>
            <Link to="/sobre">A Código5</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contato">Contato</Link>
          </nav>
        </div>
        <div className="c5-footer-bottom">
          <span>© {new Date().getFullYear()} Código5 Web · Cuiabá, MT</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <Link to="/politica-de-privacidade">Política de privacidade</Link>
        </div>
      </div>
    </footer>
  );
}

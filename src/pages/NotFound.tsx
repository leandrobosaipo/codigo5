import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="c5-site">
      <Seo
        title="Página não encontrada | Código5"
        description="Esta página não foi encontrada. Volte ao início ou consulte o blog da Código5."
        path={pathname}
        robots="noindex,follow"
      />
      <Navbar />
      <main id="conteudo">
        <section className="c5-page-hero">
          <div className="c5-container">
            <span className="c5-label">Erro 404</span>
            <h1>Página não encontrada.</h1>
            <p>
              O endereço pode ter mudado. Encontre nossos serviços e trabalhos
              na página inicial.
            </p>
            <Link className="c5-button" to="/" style={{ marginTop: 25 }}>
              Voltar ao início
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

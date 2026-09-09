import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { useRuntimeBlog } from "@/hooks/use-runtime-blog";
export default function BlogIndex() {
  const { categories, posts } = useRuntimeBlog();
  return (
    <div className="c5-site">
      <Seo
        title="Blog Código5 | Tecnologia, comunicação e negócios"
        description="Artigos sobre sites, SEO, comércio digital, automação e mercados. Ideias e conhecimento da Código5 para sua empresa."
        path="/blog"
      />
      <Navbar />
      <main id="conteudo">
        <section className="c5-page-hero">
          <div className="c5-container c5-visual-hero"><div>
            <span className="c5-label">Blog da Código5</span>
            <h1>
              Tecnologia e negócios.
              <br />
              Assuntos que se conectam.
            </h1>
            <p>
              Mercado, comunicação e trabalho digital. Leituras para pensar as
              próximas decisões da sua empresa.
            </p>
          </div>{posts[0]?.image && <figure className="c5-story-photo"><img src={posts[0].image} alt="" width="1200" height="800" fetchPriority="high" /><figcaption>{posts[0].title}</figcaption></figure>}</div>
        </section>
        <section className="c5-section">
          <div className="c5-container">
            <nav className="c5-category-links" aria-label="Categorias do blog">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/blog/categoria/${category.slug}`}
                >
                  {category.name} <span>{category.count}</span>
                </Link>
              ))}
            </nav>
            <div className="c5-articles">
              {posts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id}>
                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      width="500"
                      height="280"
                      loading="lazy"
                    />
                  )}
                  <time className="c5-label" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <h2>{post.title}</h2>
                  <span className="c5-text-link">
                    Ler artigo <ArrowUpRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

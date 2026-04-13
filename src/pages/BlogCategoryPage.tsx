import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { getCategoryBySlug, getPostsByCategory } from "@/content/blog";
import NotFound from "./NotFound";

const BlogCategoryPage = () => {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);

  if (!category) {
    return <NotFound />;
  }

  const posts = getPostsByCategory(slug);

  return (
    <>
      <Seo
        title={`${category.name} | Blog Código5 Web`}
        description={`Noticias e artigos da Código5 na categoria ${category.name}.`}
        path={`/blog/categoria/${category.slug}`}
      />
      <Navbar />
      <main className="pt-24">
        <section className="border-b border-border bg-background-alt py-20">
          <div className="container">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Categoria</p>
            <h1 className="mt-4 font-display text-5xl font-bold text-foreground">{category.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{posts.length} publicacoes importadas do site antigo.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container grid gap-8 lg:grid-cols-2">
            {posts.map((post) => (
              <article key={post.slug} className="overflow-hidden rounded-[32px] border border-border bg-card">
                <Link to={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden">
                  <img src={post.image ?? "/assets/codigo5/blog/metodologia.webp"} alt={post.title} className="h-full w-full object-cover" />
                </Link>
                <div className="p-8">
                  <h2 className="font-display text-3xl font-semibold text-foreground">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="mt-4 text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogCategoryPage;

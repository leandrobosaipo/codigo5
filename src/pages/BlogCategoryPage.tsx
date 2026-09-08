import { useParams } from "react-router-dom";
import BlogArchiveCard from "@/components/BlogArchiveCard";
import BlogCollectionHero from "@/components/BlogCollectionHero";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { getCategoryBySlug, getPostsByCategory } from "@/content/blog";
import { useRuntimeBlog } from "@/hooks/use-runtime-blog";
import { SITE_URL } from "@/lib/site";
import NotFound from "./NotFound";

const BlogCategoryPage = () => {
  const { slug } = useParams();
  const { categories, posts: allPosts, recentPosts, tags, ready } = useRuntimeBlog();
  const category = getCategoryBySlug(slug, categories);
  const categoryName = category?.name ?? "Categoria";
  const categorySlug = category?.slug ?? slug ?? "";

  if (ready && !category) {
    return <NotFound />;
  }

  const posts = getPostsByCategory(slug, allPosts);

  return (
    <div className="c5-site c5-blog-collection">
      <Seo
        title={`${categoryName} | Blog Código5 Web`}
        description={`Noticias e artigos da Código5 sobre ${categoryName}.`}
        path={`/blog/categoria/${categorySlug}`}
        type="website"
        keywords={`${categoryName}, blog codigo5, ${categoryName} cuiaba, seo de conteudo`}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${categoryName} | Blog Código5 Web`,
          description: `Publicacoes da categoria ${categoryName} no blog da Código5.`,
          url: `${SITE_URL}/blog/categoria/${categorySlug}`,
        }}
      />
      <Navbar />
      <main id="conteudo" >
        <BlogCollectionHero
          kicker="Categoria"
          title={categoryName}
          lead={`${posts.length} artigos sobre este assunto.`}
          crumb={categoryName}
          stats={[
            { value: String(posts.length), label: "artigos nesta coleção" },
            { value: "Categoria", label: "recorte editorial ativo" },
            { value: "Blog", label: "navegação conectada ao acervo" },
          ]}
          visual={posts[0]?.image ? (
            <div className="overflow-hidden rounded-[20px] border border-white/10">
              <img src={posts[0].image} alt="" aria-hidden="true" className="h-[180px] w-full object-cover sm:h-[220px]" />
            </div>
          ) : undefined}
          aside={(
            <p>
              Esta coleção organiza <strong>{categoryName}</strong> como trilha editorial curta e direta.
            </p>
          )}
        />

        <section className="bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_100%)] py-16">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="blog-archive-grid">
              {posts.map((post) => (
                <BlogArchiveCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                  date={post.date}
                  readingMinutes={post.readingMinutes}
                  categories={post.categories}
                />
              ))}
            </div>

            <BlogSidebar
              currentCategorySlug={categorySlug}
              categories={categories}
              tags={tags}
              recentPosts={recentPosts}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogCategoryPage;

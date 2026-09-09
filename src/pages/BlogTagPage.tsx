import { useParams } from "react-router-dom";
import BlogArchiveCard from "@/components/BlogArchiveCard";
import BlogCollectionHero from "@/components/BlogCollectionHero";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { getPostsByTag, getTagBySlug } from "@/content/blog";
import { useRuntimeBlog } from "@/hooks/use-runtime-blog";
import NotFound from "./NotFound";

const BlogTagPage = () => {
  const { slug } = useParams();
  const { posts: allPosts, categories, tags, recentPosts, ready } = useRuntimeBlog();
  const tag = getTagBySlug(slug, tags);
  const tagName = tag?.name ?? "Tag";
  const tagSlug = tag?.slug ?? slug ?? "";

  if (ready && !tag) {
    return <NotFound />;
  }

  const posts = getPostsByTag(slug, allPosts);

  return (
    <div className="c5-site c5-blog-collection">
      <Seo
        title={`#${tagName} | Blog Código5 Web`}
        description={`Conteudos da Código5 marcados com a tag ${tagName}.`}
        path={`/blog/tag/${tagSlug}`}
        robots="noindex,follow,max-image-preview:large"
        type="website"
      />
      <Navbar />
      <main id="conteudo" >
        <BlogCollectionHero
          kicker="Tag"
          title={`#${tagName}`}
          lead={`${posts.length} artigos sobre este assunto.`}
          crumb={`#${tagName}`}
          stats={[
            { value: String(posts.length), label: "artigos marcados" },
            { value: "Tag", label: "ligação por tema" },
            { value: "Navegação", label: "continuidade por interesse" },
          ]}
          visual={posts[0]?.image ? (
            <div className="overflow-hidden rounded-[20px] border border-white/10">
              <img src={posts[0].image} alt="" aria-hidden="true" className="h-[180px] w-full object-cover sm:h-[220px]" />
            </div>
          ) : undefined}
          aside={(
            <p>
              As tags cruzam assuntos entre categorias sem transformar a navegação em arquivo pesado.
            </p>
          )}
        />

        <section className="bg-[linear-gradient(180deg,#eef4ff_0%,#f8fbff_100%)] py-16">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="grid gap-6">
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
                  compact
                />
              ))}
            </div>

            <BlogSidebar
              currentTagSlug={tagSlug}
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

export default BlogTagPage;

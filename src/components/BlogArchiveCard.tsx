import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

type BlogArchiveTerm = {
  slug: string;
  name: string;
};

type BlogArchiveCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  date: string;
  readingMinutes: number;
  categories: BlogArchiveTerm[];
  compact?: boolean;
};

const BlogArchiveCard = ({
  slug,
  title,
  excerpt,
  image,
  date,
  readingMinutes,
  categories,
  compact = false,
}: BlogArchiveCardProps) => {
  return (
    <article className={`blog-archive-card group ${compact ? "blog-archive-card-compact" : ""}`}>
      <Link to={`/blog/${slug}`} className={`blog-archive-media ${compact ? "aspect-[4/3]" : ""}`}>
        <img
          src={image ?? "/assets/codigo5/generated/blog-editorial-collage.png"}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
        />
      </Link>

      <div className="blog-archive-body">
        <div className="blog-feature-chip-row">
          {categories.slice(0, compact ? 2 : 3).map((category) => (
            <Link
              key={category.slug}
              to={`/blog/categoria/${category.slug}`}
              className="blog-feature-chip"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <p className="blog-feature-meta">
          {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(date))} •{" "}
          {readingMinutes} min de leitura
        </p>
        <h2 className={compact ? "blog-archive-title-compact" : "blog-archive-title"}>
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h2>
        <p className={compact ? "line-clamp-2 text-sm leading-7 text-muted-foreground" : "blog-feature-excerpt"}>
          {excerpt}
        </p>
        <Link to={`/blog/${slug}`} className="blog-feature-link">
          Ler artigo
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};

export default BlogArchiveCard;

import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

type BlogFeatureTerm = {
  slug: string;
  name: string;
};

type BlogFeatureCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  date: string;
  readingMinutes: number;
  categories: BlogFeatureTerm[];
  showLink?: boolean;
};

const BlogFeatureCard = ({
  slug,
  title,
  excerpt,
  image,
  date,
  readingMinutes,
  categories,
  showLink = false,
}: BlogFeatureCardProps) => {
  return (
    <article className="blog-feature-card group">
      <Link to={`/blog/${slug}`} className="blog-feature-media">
        <img
          src={image ?? "/assets/codigo5/generated/blog-editorial-collage.png"}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="blog-feature-body">
        <div className="blog-feature-chip-row">
          {categories.map((category) => (
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
        <h3 className="blog-feature-title">
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h3>
        <p className="blog-feature-excerpt">{excerpt}</p>
        {showLink ? (
          <Link to={`/blog/${slug}`} className="blog-feature-link">
            Ler materia
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
};

export default BlogFeatureCard;

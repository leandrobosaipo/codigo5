import type { ReactNode } from "react";
import { Link } from "react-router-dom";
type BlogCollectionHeroProps = {
  kicker: string;
  title: string;
  lead: string;
  breadcrumbLabel?: string;
  breadcrumbHref?: string;
  crumb?: string;
  stats?: Array<{ value: string; label: string }>;
  aside?: ReactNode;
  visual?: ReactNode;
};
export default function BlogCollectionHero({
  kicker,
  title,
  lead,
  breadcrumbLabel = "Blog",
  breadcrumbHref = "/blog",
  visual,
}: BlogCollectionHeroProps) {
  return (
    <section className="c5-page-hero">
      <div className={`c5-container${visual ? " c5-visual-hero" : ""}`}>
        <div>
        <Link className="c5-text-link" to={breadcrumbHref}>
          ← {breadcrumbLabel}
        </Link>
        <span className="c5-label" style={{ marginTop: 25 }}>
          {kicker}
        </span>
        <h1>{title}</h1>
        <p>{lead}</p>
        </div>
        {visual && <figure className="c5-story-photo">{visual}</figure>}
      </div>
    </section>
  );
}

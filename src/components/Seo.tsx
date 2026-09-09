import { createContext, useContext, useEffect } from "react";
import { trackPageView } from "./Analytics";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

export type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string;
  robots?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export const SeoContext = createContext<SeoProps[] | null>(null);

const upsertMeta = (selector: string, attribute: "content" | "href", value: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;

  if (!element) {
    if (attribute === "href") {
      element = document.createElement("link");
      (element as HTMLLinkElement).rel = "canonical";
    } else {
      element = document.createElement("meta");
      const propertyName = selector.match(/\[(name|property)="([^"]+)"\]/);
      if (propertyName) {
        element.setAttribute(propertyName[1], propertyName[2]);
      }
    }
    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
};

const Seo = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  keywords,
  robots = "index,follow,max-image-preview:large",
  schema,
}: SeoProps) => {
  const normalizedPath = path === "/" ? "/" : path.replace(/\/+$/, "");
  const covers: Record<string, string> = {"/":"inicio", "/sobre":"sobre", "/servicos":"servicos", "/portfolio":"portfolio", "/contato":"contato", "/blog":"blog", "/automacao-com-ia":"automacao", "/politica-de-privacidade":"privacidade"};
  image = new URL(image || (covers[normalizedPath] ? `/assets/codigo5/social/${covers[normalizedPath]}.jpg` : DEFAULT_OG_IMAGE), SITE_URL).toString();
  const url = new URL(normalizedPath, SITE_URL).toString();
  const pageType = normalizedPath === "/sobre" ? "AboutPage" : normalizedPath === "/contato" ? "ContactPage" : normalizedPath === "/portfolio" || normalizedPath === "/blog" ? "CollectionPage" : "WebPage";
  const graph: Record<string, unknown>[] = [
    {"@context":"https://schema.org", "@type":"Organization", "@id":`${SITE_URL}/#organization`, name:"Código5", url:SITE_URL, logo:`${SITE_URL}/assets/codigo5/logos/logo-dark.webp`},
    {"@context":"https://schema.org", "@type":"WebSite", "@id":`${SITE_URL}/#website`, name:"Código5", url:SITE_URL, inLanguage:"pt-BR", publisher:{"@id":`${SITE_URL}/#organization`}},
    {"@context":"https://schema.org", "@type":pageType, "@id":`${url}#webpage`, url, name:title, description, inLanguage:"pt-BR", isPartOf:{"@id":`${SITE_URL}/#website`}, primaryImageOfPage:{"@type":"ImageObject",url:image}},
  ];
  if(normalizedPath !== "/" && type !== "article") graph.push({"@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[{"@type":"ListItem",position:1,name:"Código5",item:`${SITE_URL}/`},{"@type":"ListItem",position:2,name:title.split("|")[0].trim(),item:url}]});
  const allSchema = [...graph, ...(schema ? Array.isArray(schema) ? schema : [schema] : [])];
  const collector = useContext(SeoContext);
  if (collector) collector.push({title,description,path:normalizedPath,image,type,keywords,robots,schema:allSchema});
  useEffect(() => {


    document.title = title;
    if (!robots.includes("noindex")) trackPageView(title, normalizedPath);
    upsertMeta('meta[name="description"]', "content", description);
    upsertMeta('meta[name="keywords"]', "content", keywords ?? "codigo5 web, sites em cuiaba, seo, automacao, ia aplicada");
    upsertMeta('meta[name="robots"]', "content", robots);
    upsertMeta('link[rel="canonical"]', "href", url);

    upsertMeta('meta[property="og:title"]', "content", title);
    upsertMeta('meta[property="og:description"]', "content", description);
    upsertMeta('meta[property="og:url"]', "content", url);
    upsertMeta('meta[property="og:type"]', "content", type);
    upsertMeta('meta[property="og:image"]', "content", image);
    upsertMeta('meta[property="og:site_name"]', "content", SITE_NAME);

    upsertMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "content", title);
    upsertMeta('meta[name="twitter:description"]', "content", description);
    upsertMeta('meta[name="twitter:image"]', "content", image);

    upsertMeta('meta[property="og:locale"]', "content", "pt_BR");
    upsertMeta('meta[property="og:image:alt"]', "content", title);
    upsertMeta('meta[name="twitter:image:alt"]', "content", title);
    // Dimensions apply only to our generated social covers, never guessed for article photos.
    for (const [key, value] of [["og:image:width", "1200"], ["og:image:height", "630"], ["og:image:type", "image/jpeg"]]) {
      if (image.includes("/social/")) upsertMeta(`meta[property="${key}"]`, "content", value);
      else document.head.querySelector(`meta[property="${key}"]`)?.remove();
    }
    document.getElementById("codigo5-static-post-schema")?.remove();
    const schemaId = "codigo5-schema";
    const previous = document.getElementById(schemaId);
    if (previous) {
      previous.remove();
    }

    if (allSchema.length) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = schemaId;
      script.textContent = JSON.stringify(allSchema);
      document.head.appendChild(script);
    }

    return () => {
      const active = document.getElementById(schemaId);
      if (active) {
        active.remove();
      }
    };
  });

  return null;
};

export default Seo;

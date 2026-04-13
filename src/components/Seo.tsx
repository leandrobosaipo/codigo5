import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string;
  robots?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const siteName = "Código5 Web";
const defaultUrl = "https://novo.codigo5.com.br";
const defaultImage = `${defaultUrl}/assets/codigo5/logos/hero-ai.webp`;

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
  image = defaultImage,
  type = "website",
  keywords,
  robots = "index,follow,max-image-preview:large",
  schema,
}: SeoProps) => {
  useEffect(() => {
    const url = new URL(path, defaultUrl).toString();

    document.title = title;
    upsertMeta('meta[name="description"]', "content", description);
    upsertMeta('meta[name="keywords"]', "content", keywords ?? "codigo5 web, sites em cuiaba, seo, automacao, ia aplicada");
    upsertMeta('meta[name="robots"]', "content", robots);
    upsertMeta('link[rel="canonical"]', "href", url);

    upsertMeta('meta[property="og:title"]', "content", title);
    upsertMeta('meta[property="og:description"]', "content", description);
    upsertMeta('meta[property="og:url"]', "content", url);
    upsertMeta('meta[property="og:type"]', "content", type);
    upsertMeta('meta[property="og:image"]', "content", image);
    upsertMeta('meta[property="og:site_name"]', "content", siteName);

    upsertMeta('meta[name="twitter:title"]', "content", title);
    upsertMeta('meta[name="twitter:description"]', "content", description);
    upsertMeta('meta[name="twitter:image"]', "content", image);

    const schemaId = "codigo5-schema";
    const previous = document.getElementById(schemaId);
    if (previous) {
      previous.remove();
    }

    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = schemaId;
      script.textContent = JSON.stringify(Array.isArray(schema) ? schema : [schema]);
      document.head.appendChild(script);
    }

    return () => {
      const active = document.getElementById(schemaId);
      if (active) {
        active.remove();
      }
    };
  }, [description, image, keywords, path, robots, schema, title, type]);

  return null;
};

export default Seo;

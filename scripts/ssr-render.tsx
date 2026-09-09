import { JSDOM } from "jsdom";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Route, Routes } from "react-router-dom";
import { SeoContext, type SeoProps } from "../src/components/Seo.tsx";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

type RenderResult = {
  html: string;
  schema: unknown;
  seo: {
    title?: string;
    description?: string;
    path?: string;
    image?: string;
    type?: "website" | "article";
    keywords?: string;
    robots?: string;
    schema?: unknown;
  };
};

const ensureBrowserGlobals = () => {
  if (typeof document !== "undefined") return;

  const jsdom = new JSDOM(`<!doctype html><html><body></body></html>`, {
    url: SITE_URL,
  });
  const { window } = jsdom;

  Object.defineProperty(globalThis, "window", {value:window, configurable:true});
  Object.defineProperty(globalThis, "document", {value:window.document, configurable:true});
};

ensureBrowserGlobals();

const modules = await Promise.all([
  import("../src/pages/Index.tsx"),
  import("../src/pages/AboutPage.tsx"),
  import("../src/pages/ServicesPage.tsx"),
  import("../src/pages/AutomationPage.tsx"),
  import("../src/pages/PortfolioPage.tsx"),
  import("../src/pages/ContactPage.tsx"),
  import("../src/pages/PrivacyPage.tsx"),
  import("../src/pages/BlogIndex.tsx"),
  import("../src/pages/BlogPostPage.tsx"),
  import("../src/pages/BlogCategoryPage.tsx"),
  import("../src/pages/BlogTagPage.tsx"),
  import("../src/pages/NotFound.tsx"),
]);

const [
  Index,
  AboutPage,
  ServicesPage,
  AutomationPage,
  PortfolioPage,
  ContactPage,
  PrivacyPage,
  BlogIndex,
  BlogPostPage,
  BlogCategoryPage,
  BlogTagPage,
  NotFound,
] = modules.map(({ default: page }) => page);

const RoutesApp = ({
  location,
  collector,
}: {
  location: string;
  collector: SeoProps[];
}): ReactElement =>
  createElement(
    SeoContext.Provider,
    { value: collector },
    createElement(
      StaticRouter,
      { location },
      createElement(
        Routes,
        null,
        createElement(Route, { path: "/", element: createElement(Index) }),
        createElement(Route, { path: "/sobre", element: createElement(AboutPage) }),
        createElement(Route, { path: "/servicos", element: createElement(ServicesPage) }),
        createElement(Route, { path: "/automacao-com-ia", element: createElement(AutomationPage) }),
        createElement(Route, { path: "/portfolio", element: createElement(PortfolioPage) }),
        createElement(Route, { path: "/contato", element: createElement(ContactPage) }),
        createElement(Route, {
          path: "/politica-de-privacidade",
          element: createElement(PrivacyPage),
        }),
        createElement(Route, { path: "/blog", element: createElement(BlogIndex) }),
        createElement(Route, {
          path: "/blog/:slug",
          element: createElement(BlogPostPage),
        }),
        createElement(Route, {
          path: "/blog/categoria/:slug",
          element: createElement(BlogCategoryPage),
        }),
        createElement(Route, {
          path: "/blog/tag/:slug",
          element: createElement(BlogTagPage),
        }),
        createElement(Route, { path: "*", element: createElement(NotFound) }),
      ),
    ),
  );

export const renderStaticRoute = async (location: string): Promise<RenderResult> => {
  const seoCollector: SeoProps[] = [];

  const html = renderToStaticMarkup(
    createElement(RoutesApp, {
      location,
      collector: seoCollector,
    }),
  );

  const payload = seoCollector.at(-1);

  return {
    html,
    schema: payload?.schema,
    seo: {
      title: payload?.title,
      description: payload?.description,
      path: payload?.path ?? location,
      image: payload?.image ?? DEFAULT_OG_IMAGE,
      type: payload?.type ?? "website",
      keywords: payload?.keywords,
      robots: payload?.robots,
      schema: payload?.schema,
    },
  };
};

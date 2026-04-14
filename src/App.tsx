import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analytics from "./components/Analytics.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Index from "./pages/Index.tsx";
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.tsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.tsx"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.tsx"));
const BlogIndex = lazy(() => import("./pages/BlogIndex.tsx"));
const BlogCategoryPage = lazy(() => import("./pages/BlogCategoryPage.tsx"));
const BlogTagPage = lazy(() => import("./pages/BlogTagPage.tsx"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const RouteFallback = () => (
  <div className="min-h-screen bg-background pt-24">
    <div className="container flex min-h-[50vh] items-center justify-center">
      <div className="rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-muted-foreground shadow-sm">
        Carregando página...
      </div>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Analytics />
    <ScrollToTop />
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/politica-de-privacidade" element={<PrivacyPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/categoria/:slug" element={<BlogCategoryPage />} />
        <Route path="/blog/tag/:slug" element={<BlogTagPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;

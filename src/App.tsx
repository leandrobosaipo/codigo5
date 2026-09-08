import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analytics from "./components/Analytics.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Index from "./pages/Index.tsx";
import BlogCategoryPage from "./pages/BlogCategoryPage.tsx";
import BlogIndex from "./pages/BlogIndex.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";
import BlogTagPage from "./pages/BlogTagPage.tsx";
const AutomationPage = lazy(() => import("./pages/AutomationPage.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage.tsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.tsx"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const TelegramMiniAppPage = lazy(() => import("./pages/TelegramMiniAppPage.tsx"));
const AdminEditorialPage = lazy(() => import("./pages/AdminEditorialPage.tsx"));

const RouteFallback = () => <div role="status" className="c5-container" style={{paddingBlock:80}}>Carregando…</div>;

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
        <Route path="/automacao-com-ia" element={<AutomationPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/categoria/:slug" element={<BlogCategoryPage />} />
        <Route path="/blog/tag/:slug" element={<BlogTagPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/telegram-mini-app" element={<TelegramMiniAppPage />} />
        <Route path="/admin/editorial" element={<AdminEditorialPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;

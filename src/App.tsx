import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Analytics from "./components/Analytics.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Index from "./pages/Index.tsx";
import BlogCategoryPage from "./pages/BlogCategoryPage.tsx";
import BlogIndex from "./pages/BlogIndex.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";
import BlogTagPage from "./pages/BlogTagPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import PortfolioPage from "./pages/PortfolioPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Analytics />
        <ScrollToTop />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

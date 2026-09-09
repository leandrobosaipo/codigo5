import { useEffect } from "react";
import { GOOGLE_MEASUREMENT_ID } from "@/lib/site";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let previousPage = "";
const isPublicProductionPage = () =>
  ["codigo5.com.br", "www.codigo5.com.br"].includes(window.location.hostname) &&
  !/^\/(admin|telegram-mini-app)(\/|$)/.test(window.location.pathname);

// Called after Seo has set the actual page title, including lazy-loaded routes.
export const trackPageView = (title: string, path: string) => {
  if (!isPublicProductionPage() || !window.gtag || previousPage === path) return;
  previousPage = path;
  window.gtag("event", "page_view", {
    page_title: title,
    page_location: `${window.location.origin}${path}`,
    page_path: path,
    send_to: GOOGLE_MEASUREMENT_ID,
  });
};

const Analytics = () => {
  useEffect(() => {
    const onContact = (event: MouseEvent) => {
      if (!isPublicProductionPage() || !(event.target instanceof Element)) return;
      const href = event.target.closest("a")?.getAttribute("href") || "";
      const method = /^https:\/\/wa\.me\//.test(href) ? "whatsapp" : href.startsWith("mailto:") ? "email" : href.startsWith("tel:") ? "phone" : null;
      if (method) window.gtag?.("event", "contact_click", {contact_method:method, page_path:window.location.pathname, send_to:GOOGLE_MEASUREMENT_ID});
    };
    document.addEventListener("click", onContact);
    return () => document.removeEventListener("click", onContact);
  }, []);
  return null;
};

export default Analytics;

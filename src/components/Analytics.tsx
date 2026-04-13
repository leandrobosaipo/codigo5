import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GOOGLE_TAG_ID } from "@/lib/site";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };
    }

    window.gtag("js", new Date());
    window.gtag("config", GOOGLE_TAG_ID, { send_page_view: false });
  }, []);

  useEffect(() => {
    if (!window.gtag) {
      return;
    }

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}${location.hash}`,
      send_to: GOOGLE_TAG_ID,
    });
  }, [location]);

  return null;
};

export default Analytics;

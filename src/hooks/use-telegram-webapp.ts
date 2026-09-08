import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        themeParams?: Record<string, string>;
        MainButton: {
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: () => void;
          hideProgress: () => void;
          onClick: (handler: () => void) => void;
          offClick: (handler: () => void) => void;
        };
        HapticFeedback?: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
        };
      };
    };
  }
}

const TELEGRAM_SCRIPT_URL = "https://telegram.org/js/telegram-web-app.js";

const applyTheme = (themeParams?: Record<string, string>) => {
  if (!themeParams) return;

  const root = document.documentElement;
  const mapping: Array<[string, string]> = [
    ["--tg-bg-color", themeParams.bg_color ?? ""],
    ["--tg-text-color", themeParams.text_color ?? ""],
    ["--tg-hint-color", themeParams.hint_color ?? ""],
    ["--tg-button-color", themeParams.button_color ?? ""],
    ["--tg-button-text-color", themeParams.button_text_color ?? ""],
    ["--tg-secondary-bg-color", themeParams.secondary_bg_color ?? ""],
  ];

  mapping.forEach(([name, value]) => {
    if (value) {
      root.style.setProperty(name, value);
    }
  });
};

export const useTelegramWebApp = () => {
  const [isLoaded, setIsLoaded] = useState(Boolean(window.Telegram?.WebApp));

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      applyTheme(window.Telegram.WebApp.themeParams);
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      setIsLoaded(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TELEGRAM_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => setIsLoaded(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = TELEGRAM_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      applyTheme(window.Telegram?.WebApp?.themeParams);
      window.Telegram?.WebApp?.ready();
      window.Telegram?.WebApp?.expand();
      setIsLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  const webApp = window.Telegram?.WebApp;
  const user = webApp?.initDataUnsafe?.user;
  const initData = webApp?.initData ?? "";

  return useMemo(
    () => ({
      isLoaded,
      isTelegram: Boolean(webApp),
      webApp,
      user,
      initData,
    }),
    [initData, isLoaded, user, webApp],
  );
};

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "sk" | "cs" | "en" | "de" | "pl" | "es";

const supported: Lang[] = ["sk", "cs", "en", "de", "pl", "es"];

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue>({ lang: "sk", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sk");

  useEffect(() => {
    const saved = window.localStorage.getItem("tutka-language") as Lang | null;
    if (saved && supported.includes(saved)) {
      setLangState(saved);
      return;
    }
    const browser = navigator.language.toLowerCase();
    const detected: Lang = browser.startsWith("cs") ? "cs" : browser.startsWith("de") ? "de" : browser.startsWith("pl") ? "pl" : browser.startsWith("es") ? "es" : browser.startsWith("en") ? "en" : "sk";
    setLangState(detected);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    window.localStorage.setItem("tutka-language", next);
    document.documentElement.lang = next === "cs" ? "cs" : next;
  };

  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

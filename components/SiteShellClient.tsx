"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { CookieConsentProvider } from "./legal/CookieConsent";
import { normalizeLegalLang, paths, type LegalLang } from "./legal/legal-shared";
import Footer from "./Footer";

export default function SiteShellClient({ children }: { children: ReactNode }) {
  const languageContext = useLanguage();
  const { lang } = languageContext;
  const pathname = usePathname();
  const isLegal = Object.values(paths).some(path => path === pathname?.replace(/\/$/, ""));
  const [routeLang, setRouteLang] = useState<LegalLang>("sk");
  useEffect(() => {
    if (!isLegal) return;
    const sync = () => setRouteLang(normalizeLegalLang(new URLSearchParams(window.location.search).get("lang") ?? undefined));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [isLegal, pathname]);
  const activeLang = isLegal ? routeLang : normalizeLegalLang(lang);
  useEffect(() => {
    document.documentElement.lang = activeLang === "cz" ? "cs" : activeLang;
  }, [activeLang]);
  return (
      <CookieConsentProvider lang={activeLang}>
        {children}
        <Footer lang={activeLang} />
      </CookieConsentProvider>
  );
}

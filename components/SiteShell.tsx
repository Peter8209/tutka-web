"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { CookieConsentProvider } from "./legal/CookieConsent";
import { normalizeLegalLang, paths, type LegalLang } from "./legal/legal-shared";
import Footer from "./Footer";
import LeadGateway from "./leads/LeadGateway";

export default function SiteShell({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const isLegal = Object.values(paths).some(path => path === pathname);
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
      <LeadGateway lang={activeLang} exempt={isLegal || !!pathname?.startsWith("/api/")} />
    </CookieConsentProvider>
  );
}

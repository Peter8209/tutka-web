"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { CookieConsentProvider } from "./legal/CookieConsent";
import { normalizeLegalLang, paths, type LegalLang } from "./legal/legal-shared";
import Footer from "./Footer";
import LeadGateway from "./leads/LeadGateway";
import { toWebsiteLanguage } from "./leads/lead-copy";

export default function SiteShell({ children }: { children: ReactNode }) {
  const languageContext = useLanguage();
  const { lang } = languageContext;
  // Existing home uses cs; legal modules and API use cz. Support the two common provider setter names.
  // The fallback keeps the entry form usable if the existing provider has a different interface.
  const provider = languageContext as unknown as { setLang?: (lang: ReturnType<typeof toWebsiteLanguage>) => void; setLanguage?: (lang: ReturnType<typeof toWebsiteLanguage>) => void };
  const [gateChoice, setGateChoice] = useState<LegalLang | null>(null);
  function changeGateLanguage(next: LegalLang) {
    setGateChoice(next);
    const mapped = toWebsiteLanguage(next);
    if (typeof provider.setLang === "function") provider.setLang(mapped);
    else if (typeof provider.setLanguage === "function") provider.setLanguage(mapped);
  }
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
  const gateLang = isLegal ? routeLang : (gateChoice ?? activeLang);
  useEffect(() => {
    document.documentElement.lang = activeLang === "cz" ? "cs" : activeLang;
  }, [activeLang]);
  return (
    <LeadGateway lang={gateLang} onLanguageChange={changeGateLanguage} exempt={isLegal || !!pathname?.startsWith("/api/")}>
      <CookieConsentProvider lang={activeLang}>
        {children}
        <Footer lang={activeLang} />
      </CookieConsentProvider>
    </LeadGateway>
  );
}

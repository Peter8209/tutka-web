"use client";

import { company as c } from "@/lib/company";
import { legalHref, legalTitle, type LegalKind, type LegalLang } from "./legal/legal-shared";
import { CookieSettingsButton } from "./legal/CookieConsent";

const copy = {
  "sk": [
    "Digitálne produkty. Premyslené riešenia.",
    "Kontakt",
    "Právne informácie",
    "Prevádzkovateľ",
    "Všetky práva vyhradené.",
    "Domov",
    "Kontaktovať",
    "IČO",
    "DIČ",
    "Register"
  ],
  "cz": [
    "Digitální produkty. Promyšlená řešení.",
    "Kontakt",
    "Právní informace",
    "Provozovatel",
    "Všechna práva vyhrazena.",
    "Domů",
    "Kontaktovat",
    "IČO",
    "DIČ",
    "Rejstřík"
  ],
  "en": [
    "Digital products. Thoughtful solutions.",
    "Contact",
    "Legal information",
    "Service provider",
    "All rights reserved.",
    "Home",
    "Get in touch",
    "Company ID",
    "Tax ID",
    "Register"
  ],
  "de": [
    "Digitale Produkte. Durchdachte Lösungen.",
    "Kontakt",
    "Rechtliche Informationen",
    "Anbieter",
    "Alle Rechte vorbehalten.",
    "Startseite",
    "Kontakt aufnehmen",
    "Unternehmens-ID",
    "Steuernummer",
    "Register"
  ],
  "pl": [
    "Produkty cyfrowe. Przemyślane rozwiązania.",
    "Kontakt",
    "Informacje prawne",
    "Usługodawca",
    "Wszelkie prawa zastrzeżone.",
    "Strona główna",
    "Skontaktuj się",
    "Numer identyfikacyjny",
    "Numer podatkowy",
    "Rejestr"
  ],
  "es": [
    "Productos digitales. Soluciones bien pensadas.",
    "Contacto",
    "Información legal",
    "Prestador del servicio",
    "Todos los derechos reservados.",
    "Inicio",
    "Contactar",
    "Identificación",
    "Número fiscal",
    "Registro"
  ]
} as const;
const items: LegalKind[] = ["identity", "terms", "privacy", "cookies"];

export default function Footer({ lang }: { lang: LegalLang }) {
  const t = copy[lang];
  return (
    <footer className="tutka-footer" lang={lang === "cz" ? "cs" : lang}>
      <div className="wrap">
        <div className="tutka-footer-grid">
          <div className="tutka-footer-brand">
            <a href="/" className="brand brand-footer" aria-label={`TUTKA – ${t[5]}`}>
              <span className="brand-mark" aria-hidden="true">T</span>
              <span className="brand-copy"><strong>TUTKA</strong><small>DATA &amp; APPS</small></span>
            </a>
            <p className="tutka-footer-tagline">{t[0]}</p>
            <p className="tutka-footer-services">WEB · AI · DATA · AUTOMATION</p>
            <a className="tutka-footer-cta" href="/#kontakt">{t[6]} <span aria-hidden="true">↗</span></a>
          </div>
          <div>
            <h2>{t[3]}</h2>
            <address><strong>{c.legalName}</strong><br/>{c.address}<br/>{t[7]}: {c.companyId}<br/>{t[8]}: {c.taxId}{c.vatId && <><br/>VAT: {c.vatId}</>}{c.registration && <><br/>{t[9]}: {c.registration}</>}</address>
          </div>
          <div>
            <h2>{t[2]}</h2>
            <nav className="tutka-footer-links" aria-label={t[2]}>
              {items.map(kind => <a key={kind} href={legalHref(kind,lang)}>{legalTitle(kind,lang)}</a>)}
              <CookieSettingsButton lang={lang}/>
            </nav>
          </div>
          <div>
            <h2>{t[1]}</h2>
            <a className="tutka-footer-email" href={`mailto:${c.email}`}>{c.email}</a>
            {c.phone && <p><a href={`tel:${c.phone}`}>{c.phone}</a></p>}
            <p>www.tutka.sk</p>
          </div>
        </div>
        <div className="tutka-footer-bottom"><span>© {new Date().getFullYear()} TUTKA. {t[4]}</span><a href="/">{t[5]} <span aria-hidden="true">↑</span></a></div>
      </div>
    </footer>
  );
}

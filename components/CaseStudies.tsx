"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

// The selected locale controls EVERY textual field, including open case studies.
const LOCALES = ["sk", "cs", "en", "de", "pl", "es"] as const;
type Locale = (typeof LOCALES)[number];
const STUDY_IDS = ["frost", "hollen", "vedos", "betonoveploty", "tvojbyt", "heko", "dobrotka", "ql", "arbopark"] as const;
type StudyId = (typeof STUDY_IDS)[number];

type StudyMeta = { name: string; domain: string; website: string; linkKind: "profile" | "web" };
type StudyCopy = { title: string; summary: string; challenge: string; solution: string[]; outcome: string; tag: string; technologies: string[] };
type Labels = Record<"k" | "h" | "p" | "study" | "web" | "close" | "challenge" | "solution" | "tech" | "outcome" | "private" | "profile", string>;

const PROJECTS = {
  "frost": {
    "name": "FROST a.s.",
    "domain": "frost.sk",
    "website": "https://www.frost.sk/sk",
    "linkKind": "web"
  },
  "hollen": {
    "name": "HOLLEN s.r.o.",
    "domain": "hollen.sk",
    "website": "https://www.hollen.sk/",
    "linkKind": "web"
  },
  "vedos": {
    "name": "VEDOS",
    "domain": "vedos.sk",
    "website": "https://www.vedos.sk/",
    "linkKind": "web"
  },
  "betonoveploty": {
    "name": "BETONOVEPLOTY.eu",
    "domain": "betonoveploty.eu",
    "website": "https://betonoveploty.eu/",
    "linkKind": "web"
  },
  "tvojbyt": {
    "name": "TVOJBYT.sk",
    "domain": "tvojbyt.sk",
    "website": "https://tvojbyt.sk/",
    "linkKind": "web"
  },
  "heko": {
    "name": "H + EKO",
    "domain": "",
    "website": "https://www.isoh.gov.sk/uvod/registre/register-spracovatelov.html",
    "linkKind": "profile"
  },
  "dobrotka": {
    "name": "DOBROTKA.online",
    "domain": "dobrotka.site",
    "website": "https://www.dobrotka.site/",
    "linkKind": "web"
  },
  "ql": {
    "name": "QL INDUSTRIAL SERVICES",
    "domain": "",
    "website": "",
    "linkKind": "web"
  },
  "arbopark": {
    "name": "ARBOPARK",
    "domain": "",
    "website": "",
    "linkKind": "web"
  }
} satisfies Record<StudyId, StudyMeta>;

const LABELS = {
  "sk": {
    "k": "REFERENCIE & PRÍPADOVÉ ŠTÚDIE",
    "h": "Riešenia postavené na reálnych procesoch.",
    "p": "Vybrané realizácie naprieč výrobou, logistikou, BI, webom a mobilnými aplikáciami.",
    "study": "Prípadová štúdia",
    "web": "Web stránka",
    "close": "Zavrieť",
    "challenge": "Výzva",
    "solution": "Riešenie",
    "tech": "Technológie",
    "outcome": "Výsledok",
    "private": "Interné riešenie",
    "profile": "Firemný profil"
  },
  "cs": {
    "k": "REFERENCE & PŘÍPADOVÉ STUDIE",
    "h": "Řešení postavená na reálných procesech.",
    "p": "Vybrané realizace napříč výrobou, logistikou, BI, webem a mobilními aplikacemi.",
    "study": "Případová studie",
    "web": "Web",
    "close": "Zavřít",
    "challenge": "Výzva",
    "solution": "Řešení",
    "tech": "Technologie",
    "outcome": "Výsledek",
    "private": "Interní řešení",
    "profile": "Firemní profil"
  },
  "en": {
    "k": "REFERENCES & CASE STUDIES",
    "h": "Solutions built around real processes.",
    "p": "Selected work across manufacturing, logistics, BI, web and mobile applications.",
    "study": "Case study",
    "web": "Website",
    "close": "Close",
    "challenge": "Challenge",
    "solution": "Solution",
    "tech": "Technologies",
    "outcome": "Outcome",
    "private": "Internal solution",
    "profile": "Company profile"
  },
  "de": {
    "k": "REFERENZEN & FALLSTUDIEN",
    "h": "Lösungen auf Basis realer Prozesse.",
    "p": "Ausgewählte Projekte aus Produktion, Logistik, BI, Web und mobilen Anwendungen.",
    "study": "Fallstudie",
    "web": "Website",
    "close": "Schließen",
    "challenge": "Herausforderung",
    "solution": "Lösung",
    "tech": "Technologien",
    "outcome": "Ergebnis",
    "private": "Interne Lösung",
    "profile": "Unternehmensprofil"
  },
  "pl": {
    "k": "REFERENCJE I STUDIA PRZYPADKÓW",
    "h": "Rozwiązania oparte na realnych procesach.",
    "p": "Wybrane realizacje z produkcji, logistyki, BI, webu i aplikacji mobilnych.",
    "study": "Studium przypadku",
    "web": "Strona internetowa",
    "close": "Zamknij",
    "challenge": "Wyzwanie",
    "solution": "Rozwiązanie",
    "tech": "Technologie",
    "outcome": "Rezultat",
    "private": "Rozwiązanie wewnętrzne",
    "profile": "Profil firmy"
  },
  "es": {
    "k": "REFERENCIAS & CASOS DE ESTUDIO",
    "h": "Soluciones basadas en procesos reales.",
    "p": "Proyectos seleccionados en fabricación, logística, BI, web y aplicaciones móviles.",
    "study": "Caso de estudio",
    "web": "Sitio web",
    "close": "Cerrar",
    "challenge": "Reto",
    "solution": "Solución",
    "tech": "Tecnologías",
    "outcome": "Resultado",
    "private": "Solución interna",
    "profile": "Perfil de empresa"
  }
} satisfies Record<Locale, Labels>;

const COPY = {
  "sk": {
    "frost": {
      "title": "Plánovanie, výrobný reporting a automatizované dátové toky",
      "summary": "Power BI plánovanie, shell automatizácie, evidencia kamerových bodov a API výpočty spotreby múky.",
      "challenge": "Zjednotiť plánovanie, kontrolné dáta a prevádzkové výpočty do jedného použiteľného systému pre každodenné rozhodovanie.",
      "solution": [
        "Nastavenie plánovania a manažérskych pohľadov v Power BI.",
        "Automatizované dopĺňanie dát cez shell skripty.",
        "Evidencia a zakresľovanie kamerových bodov v rámci objektu.",
        "Kontrolný Power BI reporting pre prevádzkové kontroly.",
        "Výpočty spotreby múky prepojené cez API."
      ],
      "outcome": "Výsledkom je prepojený reporting a plánovanie postavené na reálnych prevádzkových dátach, s menšou závislosťou od manuálneho spracovania.",
      "tag": "Power BI · API · Automatizácia",
      "technologies": [
        "Power BI",
        "DAX",
        "API",
        "Shell",
        "Automatizácia"
      ]
    },
    "hollen": {
      "title": "Operatívne plánovanie výroby do 24 hodín",
      "summary": "Kompletný plánovací nástroj podľa spotreby liniek, sledovanie obalov a Power BI implementácia.",
      "challenge": "Dostať plánovanie z manuálneho režimu do rýchleho nástroja, ktorý vie pracovať so spotrebou liniek a zásobami obalového materiálu.",
      "solution": [
        "Návrh plánovacieho modelu na základe spotreby výrobných liniek.",
        "Sledovanie obalového materiálu a jeho potreby.",
        "Power BI vrstva pre operatívny a manažérsky pohľad.",
        "Rýchly prototyp a nasadenie použiteľného plánovacieho nástroja."
      ],
      "outcome": "Plánovanie bolo prenesené do nástroja, ktorý umožňuje rýchlejšie reagovať na aktuálnu spotrebu liniek a dostupnosť obalov.",
      "tag": "Plánovanie · Power BI · Prevádzka",
      "technologies": [
        "Power BI",
        "Excel",
        "Power Query",
        "Plánovanie",
        "Prevádzka"
      ]
    },
    "vedos": {
      "title": "Logistika navážania paliet a plánovanie prebaľovacej linky",
      "summary": "Plánovanie logistického toku paliet, kapacity a prevádzky prebaľovacej linky.",
      "challenge": "Zvýšiť prehľad nad logistickým tokom a plánovaním linky tak, aby prevádzka mala jasný pohľad na potrebu paliet a kapacitu.",
      "solution": [
        "Model logistického toku navážania paliet.",
        "Plánovanie kapacity a vyťaženia prebaľovacej linky.",
        "Prehľad prevádzkových údajov pre operatívne rozhodovanie."
      ],
      "outcome": "Vznikol ucelený pohľad na logistiku a plánovanie linky, ktorý podporuje operatívne rozhodovanie.",
      "tag": "Logistika · Plánovanie · Pracovné postupy",
      "technologies": [
        "Logistika",
        "Plánovanie",
        "Dáta",
        "Pracovné postupy"
      ]
    },
    "betonoveploty": {
      "title": "Kompletné webové riešenie a produkčné nasadenie",
      "summary": "Kompletná webová prezentácia, štruktúra produktov, UX, formuláre a technické nasadenie.",
      "challenge": "Vytvoriť moderný web, ktorý prehľadne prezentuje široký sortiment a zároveň podporuje získavanie dopytov.",
      "solution": [
        "Návrh informačnej architektúry a používateľského rozhrania.",
        "Produktové kategórie a prezentačné stránky.",
        "Kontaktné a dopytové formuláre.",
        "Technické nastavenie a produkčné nasadenie."
      ],
      "outcome": "Výsledkom je moderná webová prezentácia pripravená na obchodné dopyty a ďalší rozvoj.",
      "tag": "Web · UX · Nasadenie",
      "technologies": [
        "Web",
        "UX/UI",
        "Next.js",
        "SEO",
        "Nasadenie"
      ]
    },
    "tvojbyt": {
      "title": "Flutter aplikácia na mieru",
      "summary": "Mobilná aplikácia navrhnutá ako multiplatformové riešenie s priestorom pre ďalšie API integrácie.",
      "challenge": "Pripraviť mobilný produkt, ktorý dokáže rozšíriť existujúci online predaj o samostatný aplikačný kanál.",
      "solution": [
        "Návrh používateľských tokov aplikácie.",
        "Multiplatformový vývoj vo Flutteri.",
        "Pripravenosť na napojenie API a dátových zdrojov.",
        "Architektúra vhodná pre ďalší rozvoj Android/iOS."
      ],
      "outcome": "Vznikol základ aplikácie na mieru s multiplatformovou architektúrou a možnosťou ďalšieho rozšírenia.",
      "tag": "Flutter · Mobilné aplikácie · Aplikácia na mieru",
      "technologies": [
        "Flutter",
        "Dart",
        "Android",
        "iOS",
        "API"
      ]
    },
    "heko": {
      "title": "Prepojenie starého systému Ecoray s automatickým dátovým tokom",
      "summary": "Napojenie na existujúci systém Ecoray, databázu a automatizované Power Query spracovanie.",
      "challenge": "Sprístupniť dáta zo staršieho systému bez potreby ručného exportovania a prepisovania údajov.",
      "solution": [
        "Analýza existujúceho systému Ecoray a databázy.",
        "Napojenie na dostupné dátové zdroje.",
        "Automatické načítanie a transformácia cez Power Query.",
        "Príprava dát pre ďalší reporting a analytiku."
      ],
      "outcome": "Starší systém bol zapojený do automatizovaného dátového toku, čím sa znížil podiel manuálnej práce pri príprave dát.",
      "tag": "Ecoray · Power Query · Integrácia starších systémov",
      "technologies": [
        "Ecoray",
        "MS Access",
        "Power Query",
        "Excel",
        "Integrácia starších systémov"
      ]
    },
    "dobrotka": {
      "title": "Kompletné nastavenie webovej stránky",
      "summary": "Webové riešenie od štruktúry a dizajnu cez technickú konfiguráciu až po nasadenie.",
      "challenge": "Pripraviť jednoduchú, zrozumiteľnú a prevádzkovo použiteľnú online prezentáciu pre gastro prevádzku.",
      "solution": [
        "Štruktúra obsahu a používateľský tok.",
        "Responzívny webový dizajn.",
        "Technická konfigurácia a publikovanie.",
        "Príprava obsahu na každodenné používanie."
      ],
      "outcome": "Vznikla kompaktná webová prezentácia pripravená na bežnú prevádzku a komunikáciu so zákazníkmi.",
      "tag": "Web · Nasadenie · Digitalizácia",
      "technologies": [
        "Web",
        "Responzívne rozhranie",
        "Nasadenie",
        "Obsah"
      ]
    },
    "ql": {
      "title": "Kumulatívne plánovanie potreby pracovníkov a KPI monitoring",
      "summary": "Sledovanie potreby pracovníkov, KPI v Maďarsku a reporting pre hlavného partnera.",
      "challenge": "Vytvoriť jasný pohľad na aktuálnu a budúcu potrebu pracovníkov naprieč prevádzkou a súčasne sledovať KPI voči hlavnému partnerovi.",
      "solution": [
        "Kumulatívny model potreby pracovníkov.",
        "KPI monitoring pre prevádzku v Maďarsku.",
        "Prehľad kapacity, plnenia a operatívnych požiadaviek.",
        "Reporting pripravený pre komunikáciu s hlavným partnerom."
      ],
      "outcome": "Riešenie poskytuje spoločný pohľad na personálnu kapacitu a výkonové ukazovatele pre operatívne riadenie.",
      "tag": "Pracovná sila · KPI · Maďarsko",
      "technologies": [
        "Power BI",
        "KPI",
        "Plánovanie pracovníkov",
        "Prevádzka"
      ]
    },
    "arbopark": {
      "title": "Power BI reporting priamo nad Microsoft SQL Server",
      "summary": "Priame prepojenie Power BI s MSSQL, dátový model a analytické výstupy.",
      "challenge": "Nahradiť fragmentované dátové pohľady jedným reportovacím riešením priamo nad databázou.",
      "solution": [
        "Napojenie Power BI na Microsoft SQL Server.",
        "Príprava dátových zdrojov a modelu.",
        "Návrh analytických pohľadov a KPI.",
        "Nastavenie obnovovania a ďalšej rozšíriteľnosti reportingu."
      ],
      "outcome": "Vznikla dátová vrstva a reporting priamo nad databázou, pripravený na ďalšie rozširovanie.",
      "tag": "Power BI · MSSQL · Dátová integrácia",
      "technologies": [
        "Power BI",
        "Microsoft SQL Server",
        "SQL",
        "Dátové modelovanie"
      ]
    }
  },
  "cs": {
    "frost": {
      "title": "Plánování, výrobní reporting a automatizované datové toky",
      "summary": "Plánování v Power BI, automatizace pomocí shell skriptů, evidence kamerových bodů a výpočty spotřeby mouky přes API.",
      "challenge": "Sjednotit plánování, kontrolní data a provozní výpočty do jednoho použitelného systému pro každodenní rozhodování.",
      "solution": [
        "Nastavení plánování a manažerských pohledů v Power BI.",
        "Automatizované doplňování dat pomocí shell skriptů.",
        "Evidence a zakreslování kamerových bodů v objektu.",
        "Kontrolní reporting v Power BI pro provozní kontroly.",
        "Výpočty spotřeby mouky propojené přes API."
      ],
      "outcome": "Výsledkem je propojený reporting a plánování založené na reálných provozních datech s menší závislostí na ručním zpracování.",
      "tag": "Power BI · API · Automatizace",
      "technologies": [
        "Power BI",
        "DAX",
        "API",
        "Shell",
        "Automatizace"
      ]
    },
    "hollen": {
      "title": "Operativní plánování výroby do 24 hodin",
      "summary": "Kompletní plánovací nástroj podle spotřeby linek, sledování obalů a implementace Power BI.",
      "challenge": "Převést ruční plánování do rychlého nástroje, který pracuje se spotřebou linek a zásobami obalového materiálu.",
      "solution": [
        "Návrh plánovacího modelu podle spotřeby výrobních linek.",
        "Sledování obalového materiálu a jeho potřeby.",
        "Vrstva Power BI pro operativní a manažerské pohledy.",
        "Rychlý prototyp a nasazení použitelného plánovacího nástroje."
      ],
      "outcome": "Plánování bylo převedeno do nástroje, který umožňuje rychleji reagovat na aktuální spotřebu linek a dostupnost obalů.",
      "tag": "Plánování · Power BI · Provoz",
      "technologies": [
        "Power BI",
        "Excel",
        "Power Query",
        "Plánování",
        "Provoz"
      ]
    },
    "vedos": {
      "title": "Logistika navážení palet a plánování přebalovací linky",
      "summary": "Plánování logistického toku palet, kapacity a provozu přebalovací linky.",
      "challenge": "Zlepšit přehled o logistickém toku a plánování linky, aby provoz měl jasný pohled na potřebu palet a kapacitu.",
      "solution": [
        "Model logistického toku navážení palet.",
        "Plánování kapacity a vytížení přebalovací linky.",
        "Přehled provozních údajů pro operativní rozhodování."
      ],
      "outcome": "Vznikl ucelený pohled na logistiku a plánování linky, který podporuje operativní rozhodování.",
      "tag": "Logistika · Plánování · Pracovní postupy",
      "technologies": [
        "Logistika",
        "Plánování",
        "Data",
        "Pracovní postupy"
      ]
    },
    "betonoveploty": {
      "title": "Kompletní webové řešení a produkční nasazení",
      "summary": "Kompletní webová prezentace, struktura produktů, UX, formuláře a technické nasazení.",
      "challenge": "Vytvořit moderní web, který přehledně prezentuje široký sortiment a podporuje získávání poptávek.",
      "solution": [
        "Návrh informační architektury a uživatelského rozhraní.",
        "Produktové kategorie a prezentační stránky.",
        "Kontaktní a poptávkové formuláře.",
        "Technické nastavení a produkční nasazení."
      ],
      "outcome": "Výsledkem je moderní webová prezentace připravená na obchodní poptávky a další rozvoj.",
      "tag": "Web · UX · Nasazení",
      "technologies": [
        "Web",
        "UX/UI",
        "Next.js",
        "SEO",
        "Nasazení"
      ]
    },
    "tvojbyt": {
      "title": "Flutter aplikace na míru",
      "summary": "Mobilní aplikace navržená jako multiplatformní řešení s prostorem pro další integrace API.",
      "challenge": "Připravit mobilní produkt, který rozšíří stávající online prodej o samostatný aplikační kanál.",
      "solution": [
        "Návrh uživatelských toků aplikace.",
        "Multiplatformní vývoj ve Flutteru.",
        "Připravenost na napojení API a datových zdrojů.",
        "Architektura vhodná pro další rozvoj Android/iOS."
      ],
      "outcome": "Vznikl základ aplikace na míru s multiplatformní architekturou a možností dalšího rozšíření.",
      "tag": "Flutter · Mobilní aplikace · Aplikace na míru",
      "technologies": [
        "Flutter",
        "Dart",
        "Android",
        "iOS",
        "API"
      ]
    },
    "heko": {
      "title": "Propojení staršího systému Ecoray s automatizovaným datovým tokem",
      "summary": "Napojení na stávající Ecoray, databázi a automatizované zpracování v Power Query.",
      "challenge": "Zpřístupnit data ze staršího systému bez nutnosti ručních exportů a přepisování údajů.",
      "solution": [
        "Analýza stávajícího systému Ecoray a databáze.",
        "Napojení na dostupné datové zdroje.",
        "Automatické načítání a transformace pomocí Power Query.",
        "Příprava dat pro další reporting a analytiku."
      ],
      "outcome": "Starší systém byl zapojen do automatizovaného datového toku, čímž se snížil podíl ruční práce při přípravě dat.",
      "tag": "Ecoray · Power Query · Integrace starších systémů",
      "technologies": [
        "Ecoray",
        "MS Access",
        "Power Query",
        "Excel",
        "Integrace starších systémů"
      ]
    },
    "dobrotka": {
      "title": "Kompletní nastavení webové stránky",
      "summary": "Webové řešení od struktury a designu přes technickou konfiguraci až po nasazení.",
      "challenge": "Připravit jednoduchou, srozumitelnou a provozně použitelnou online prezentaci pro gastronomický provoz.",
      "solution": [
        "Struktura obsahu a uživatelský tok.",
        "Responzivní webový design.",
        "Technická konfigurace a publikování.",
        "Příprava obsahu pro každodenní použití."
      ],
      "outcome": "Vznikla kompaktní webová prezentace připravená na běžný provoz a komunikaci se zákazníky.",
      "tag": "Web · Nasazení · Digitalizace",
      "technologies": [
        "Web",
        "Responzivní rozhraní",
        "Nasazení",
        "Obsah"
      ]
    },
    "ql": {
      "title": "Kumulativní plánování potřeby pracovníků a monitoring KPI",
      "summary": "Sledování potřeby pracovníků, KPI v Maďarsku a reporting pro hlavního partnera.",
      "challenge": "Vytvořit jasný pohled na aktuální a budoucí potřebu pracovníků napříč provozem a současně sledovat KPI vůči hlavnímu partnerovi.",
      "solution": [
        "Kumulativní model potřeby pracovníků.",
        "Monitoring KPI pro provoz v Maďarsku.",
        "Přehled kapacity, plnění a operativních požadavků.",
        "Reporting připravený pro komunikaci s hlavním partnerem."
      ],
      "outcome": "Řešení poskytuje společný pohled na personální kapacitu a výkonnostní ukazatele pro operativní řízení.",
      "tag": "Pracovní síla · KPI · Maďarsko",
      "technologies": [
        "Power BI",
        "KPI",
        "Plánování pracovníků",
        "Provoz"
      ]
    },
    "arbopark": {
      "title": "Power BI reporting přímo nad Microsoft SQL Server",
      "summary": "Přímé propojení Power BI s MSSQL, datový model a analytické výstupy.",
      "challenge": "Nahradit fragmentované datové pohledy jedním reportovacím řešením přímo nad databází.",
      "solution": [
        "Napojení Power BI na Microsoft SQL Server.",
        "Příprava datových zdrojů a modelu.",
        "Návrh analytických pohledů a KPI.",
        "Nastavení obnovování dat a rozšiřitelnosti reportingu."
      ],
      "outcome": "Vznikla datová vrstva a reporting přímo nad databází, připravené na další rozšiřování.",
      "tag": "Power BI · MSSQL · Datová integrace",
      "technologies": [
        "Power BI",
        "Microsoft SQL Server",
        "SQL",
        "Datové modelování"
      ]
    }
  },
  "en": {
    "frost": {
      "title": "Production planning, reporting and automated data flows",
      "summary": "Power BI planning, shell-script automation, camera-point tracking and API-based flour consumption calculations.",
      "challenge": "Unify planning, control data and operational calculations in one usable system for day-to-day decisions.",
      "solution": [
        "Configure planning and management views in Power BI.",
        "Automate data updates using shell scripts.",
        "Record and map camera points throughout the facility.",
        "Develop Power BI control reports for operational checks.",
        "Integrate flour consumption calculations through an API."
      ],
      "outcome": "The result is integrated reporting and planning based on actual operational data, with less reliance on manual processing.",
      "tag": "Power BI · API · Automation",
      "technologies": [
        "Power BI",
        "DAX",
        "API",
        "Shell",
        "Automation"
      ]
    },
    "hollen": {
      "title": "Operational production planning within 24 hours",
      "summary": "A comprehensive planning tool based on production-line consumption, packaging tracking and Power BI implementation.",
      "challenge": "Move planning from manual processes to a fast tool that uses line consumption and packaging-material inventory.",
      "solution": [
        "Design a planning model based on production-line consumption.",
        "Track packaging materials and requirements.",
        "Implement a Power BI layer for operational and management views.",
        "Rapidly prototype and deploy a usable planning tool."
      ],
      "outcome": "Planning was moved into a tool that enables faster responses to current line consumption and packaging availability.",
      "tag": "Planning · Power BI · Operations",
      "technologies": [
        "Power BI",
        "Excel",
        "Power Query",
        "Planning",
        "Operations"
      ]
    },
    "vedos": {
      "title": "Pallet supply logistics and repacking-line planning",
      "summary": "Planning pallet flows, capacity and operations of the repacking line.",
      "challenge": "Improve visibility into logistics flows and line planning so operations have a clear view of pallet requirements and capacity.",
      "solution": [
        "Model pallet supply logistics.",
        "Plan capacity and utilisation of the repacking line.",
        "Provide an overview of operational data for day-to-day decisions."
      ],
      "outcome": "The solution provides a unified view of logistics and line planning to support operational decisions.",
      "tag": "Logistics · Planning · Workflow",
      "technologies": [
        "Logistics",
        "Planning",
        "Data",
        "Workflow"
      ]
    },
    "betonoveploty": {
      "title": "Complete web solution and production deployment",
      "summary": "A complete website, product structure, UX, forms and technical deployment.",
      "challenge": "Create a modern website that clearly presents a broad product range and helps generate enquiries.",
      "solution": [
        "Design the information architecture and user interface.",
        "Create product categories and presentation pages.",
        "Implement contact and enquiry forms.",
        "Configure and deploy the website to production."
      ],
      "outcome": "The result is a modern website ready to receive business enquiries and support further development.",
      "tag": "Web · UX · Deployment",
      "technologies": [
        "Web",
        "UX/UI",
        "Next.js",
        "SEO",
        "Deployment"
      ]
    },
    "tvojbyt": {
      "title": "Custom Flutter application",
      "summary": "A cross-platform mobile application designed to support further API integrations.",
      "challenge": "Prepare a mobile product that can extend existing online sales through a dedicated application channel.",
      "solution": [
        "Design the application's user flows.",
        "Develop a cross-platform application in Flutter.",
        "Prepare for integration with APIs and data sources.",
        "Establish an architecture suitable for further Android/iOS development."
      ],
      "outcome": "The project established the foundation for a tailored application with a cross-platform architecture and room for future expansion.",
      "tag": "Flutter · Mobile · Custom App",
      "technologies": [
        "Flutter",
        "Dart",
        "Android",
        "iOS",
        "API"
      ]
    },
    "heko": {
      "title": "Legacy Ecoray integration with automated data flows",
      "summary": "Integration with the existing Ecoray system and database, with automated processing in Power Query.",
      "challenge": "Make data from a legacy system accessible without manual exports and re-entry.",
      "solution": [
        "Analyse the existing Ecoray system and database.",
        "Connect available data sources.",
        "Automate data loading and transformation using Power Query.",
        "Prepare data for further reporting and analysis."
      ],
      "outcome": "The legacy system was integrated into an automated data flow, reducing manual work in data preparation.",
      "tag": "Ecoray · Power Query · Legacy Integration",
      "technologies": [
        "Ecoray",
        "MS Access",
        "Power Query",
        "Excel",
        "Legacy Integration"
      ]
    },
    "dobrotka": {
      "title": "Complete website configuration",
      "summary": "A web solution covering structure, design, technical configuration and deployment.",
      "challenge": "Prepare a simple, clear and operationally usable online presence for a food-service business.",
      "solution": [
        "Design the content structure and user flow.",
        "Create a responsive web design.",
        "Configure and publish the website.",
        "Prepare content for everyday use."
      ],
      "outcome": "The result is a compact website ready for normal operations and customer communication.",
      "tag": "Web · Deployment · Digital",
      "technologies": [
        "Web",
        "Responsive UI",
        "Deployment",
        "Content"
      ]
    },
    "ql": {
      "title": "Cumulative workforce-demand planning and KPI monitoring",
      "summary": "Workforce-demand tracking, KPI monitoring in Hungary and reporting for the main partner.",
      "challenge": "Provide a clear view of current and future workforce needs across operations while monitoring KPIs for the main partner.",
      "solution": [
        "Build a cumulative workforce-demand model.",
        "Monitor KPIs for operations in Hungary.",
        "Provide visibility into capacity, fulfilment and operational requirements.",
        "Prepare reporting for communication with the main partner."
      ],
      "outcome": "The solution provides a shared view of workforce capacity and performance indicators for operational management.",
      "tag": "Workforce · KPI · Hungary",
      "technologies": [
        "Power BI",
        "KPI",
        "Workforce Planning",
        "Operations"
      ]
    },
    "arbopark": {
      "title": "Power BI reporting directly on Microsoft SQL Server",
      "summary": "Direct Power BI connectivity to MSSQL, data modelling and analytical outputs.",
      "challenge": "Replace fragmented data views with a unified reporting solution directly on the database.",
      "solution": [
        "Connect Power BI to Microsoft SQL Server.",
        "Prepare data sources and the data model.",
        "Design analytical views and KPIs.",
        "Configure refresh and support further reporting expansion."
      ],
      "outcome": "The result is a data layer and reporting directly on the database, ready for further expansion.",
      "tag": "Power BI · MSSQL · Data Integration",
      "technologies": [
        "Power BI",
        "Microsoft SQL Server",
        "SQL",
        "Data Modelling"
      ]
    }
  },
  "de": {
    "frost": {
      "title": "Produktionsplanung, Reporting und automatisierte Datenflüsse",
      "summary": "Planung mit Power BI, Shell-Automatisierung, Erfassung von Kamerapunkten und API-gestützte Berechnung des Mehlverbrauchs.",
      "challenge": "Planung, Kontrolldaten und betriebliche Berechnungen in einem praxisgerechten System für tägliche Entscheidungen zusammenführen.",
      "solution": [
        "Planung und Managementansichten in Power BI einrichten.",
        "Datenergänzung mit Shell-Skripten automatisieren.",
        "Kamerapunkte im gesamten Objekt erfassen und kartieren.",
        "Kontrollberichte in Power BI für betriebliche Prüfungen erstellen.",
        "Berechnungen des Mehlverbrauchs über eine API anbinden."
      ],
      "outcome": "Das Ergebnis ist eine vernetzte Berichts- und Planungslösung auf Basis realer Betriebsdaten mit geringerer Abhängigkeit von manueller Verarbeitung.",
      "tag": "Power BI · API · Automatisierung",
      "technologies": [
        "Power BI",
        "DAX",
        "API",
        "Shell",
        "Automatisierung"
      ]
    },
    "hollen": {
      "title": "Operative Produktionsplanung innerhalb von 24 Stunden",
      "summary": "Umfassendes Planungstool auf Basis des Verbrauchs der Produktionslinien, Verpackungsverfolgung und Power-BI-Implementierung.",
      "challenge": "Die manuelle Planung in ein schnelles Werkzeug überführen, das den Linienverbrauch und die Verpackungsmaterialbestände berücksichtigt.",
      "solution": [
        "Planungsmodell auf Basis des Verbrauchs der Produktionslinien entwickeln.",
        "Verpackungsmaterial und dessen Bedarf verfolgen.",
        "Power-BI-Ebene für operative und Managementansichten umsetzen.",
        "Schnellen Prototyp erstellen und ein nutzbares Planungstool bereitstellen."
      ],
      "outcome": "Das Planungstool ermöglicht schnellere Reaktionen auf den aktuellen Linienverbrauch und die Verpackungsverfügbarkeit.",
      "tag": "Planung · Power BI · Betrieb",
      "technologies": [
        "Power BI",
        "Excel",
        "Power Query",
        "Planung",
        "Betrieb"
      ]
    },
    "vedos": {
      "title": "Palettenzufuhr und Planung der Umpacklinie",
      "summary": "Planung der Palettenflüsse, Kapazität und des Betriebs der Umpacklinie.",
      "challenge": "Die Transparenz der Logistikflüsse und Linienplanung erhöhen, damit der Betrieb Palettenbedarf und Kapazität klar überblicken kann.",
      "solution": [
        "Logistikfluss der Palettenzufuhr modellieren.",
        "Kapazität und Auslastung der Umpacklinie planen.",
        "Betriebsdaten für operative Entscheidungen aufbereiten."
      ],
      "outcome": "Es entstand ein einheitlicher Überblick über Logistik und Linienplanung zur Unterstützung operativer Entscheidungen.",
      "tag": "Logistik · Planung · Arbeitsabläufe",
      "technologies": [
        "Logistik",
        "Planung",
        "Daten",
        "Arbeitsabläufe"
      ]
    },
    "betonoveploty": {
      "title": "Komplette Weblösung und Produktivsetzung",
      "summary": "Umfassender Webauftritt mit Produktstruktur, UX, Formularen und technischer Bereitstellung.",
      "challenge": "Eine moderne Website erstellen, die ein breites Sortiment übersichtlich präsentiert und die Gewinnung von Anfragen unterstützt.",
      "solution": [
        "Informationsarchitektur und Benutzeroberfläche entwerfen.",
        "Produktkategorien und Präsentationsseiten erstellen.",
        "Kontakt- und Anfrageformulare umsetzen.",
        "Technische Konfiguration und Produktivsetzung durchführen."
      ],
      "outcome": "Das Ergebnis ist ein moderner Webauftritt, der auf Geschäftsanfragen und weitere Entwicklung vorbereitet ist.",
      "tag": "Web · UX · Bereitstellung",
      "technologies": [
        "Web",
        "UX/UI",
        "Next.js",
        "SEO",
        "Bereitstellung"
      ]
    },
    "tvojbyt": {
      "title": "Individuelle Flutter-App",
      "summary": "Plattformübergreifende mobile Anwendung mit Möglichkeiten für weitere API-Integrationen.",
      "challenge": "Ein mobiles Produkt vorbereiten, das den bestehenden Online-Vertrieb um einen eigenständigen App-Kanal erweitern kann.",
      "solution": [
        "Benutzerabläufe der Anwendung konzipieren.",
        "Plattformübergreifende Entwicklung mit Flutter.",
        "Anbindung von APIs und Datenquellen vorbereiten.",
        "Architektur für die weitere Android-/iOS-Entwicklung auslegen."
      ],
      "outcome": "Es entstand die Grundlage einer individuellen Anwendung mit plattformübergreifender Architektur und Erweiterungsmöglichkeiten.",
      "tag": "Flutter · Mobile Apps · Individuelle App",
      "technologies": [
        "Flutter",
        "Dart",
        "Android",
        "iOS",
        "API"
      ]
    },
    "heko": {
      "title": "Integration des Altsystems Ecoray mit automatisierten Datenflüssen",
      "summary": "Anbindung des bestehenden Ecoray-Systems und seiner Datenbank sowie automatisierte Verarbeitung mit Power Query.",
      "challenge": "Daten aus dem Altsystem ohne manuelle Exporte und Neueingabe zugänglich machen.",
      "solution": [
        "Bestehendes Ecoray-System und Datenbank analysieren.",
        "Verfügbare Datenquellen anbinden.",
        "Daten mit Power Query automatisch laden und transformieren.",
        "Daten für weitere Berichte und Analysen vorbereiten."
      ],
      "outcome": "Das Altsystem wurde in einen automatisierten Datenfluss eingebunden, wodurch der manuelle Aufwand bei der Datenaufbereitung sank.",
      "tag": "Ecoray · Power Query · Altsystemintegration",
      "technologies": [
        "Ecoray",
        "MS Access",
        "Power Query",
        "Excel",
        "Altsystemintegration"
      ]
    },
    "dobrotka": {
      "title": "Komplette Website-Einrichtung",
      "summary": "Weblösung von Struktur und Design über technische Konfiguration bis zur Bereitstellung.",
      "challenge": "Einen einfachen, verständlichen und im Alltag nutzbaren Online-Auftritt für einen Gastronomiebetrieb erstellen.",
      "solution": [
        "Inhaltsstruktur und Benutzerabläufe gestalten.",
        "Responsives Webdesign umsetzen.",
        "Technische Konfiguration und Veröffentlichung durchführen.",
        "Inhalte für den täglichen Einsatz vorbereiten."
      ],
      "outcome": "Es entstand ein kompakter Webauftritt für den laufenden Betrieb und die Kundenkommunikation.",
      "tag": "Web · Bereitstellung · Digitalisierung",
      "technologies": [
        "Web",
        "Responsives UI",
        "Bereitstellung",
        "Inhalte"
      ]
    },
    "ql": {
      "title": "Kumulative Personalbedarfsplanung und KPI-Monitoring",
      "summary": "Personalbedarfserfassung, KPI-Monitoring in Ungarn und Reporting für den Hauptpartner.",
      "challenge": "Einen klaren Überblick über den aktuellen und zukünftigen Personalbedarf im Betrieb schaffen und gleichzeitig die KPIs gegenüber dem Hauptpartner verfolgen.",
      "solution": [
        "Kumulatives Personalbedarfsmodell erstellen.",
        "KPIs für den Betrieb in Ungarn überwachen.",
        "Kapazität, Erfüllung und operative Anforderungen transparent machen.",
        "Berichte für die Kommunikation mit dem Hauptpartner vorbereiten."
      ],
      "outcome": "Die Lösung bietet eine gemeinsame Sicht auf Personalkapazität und Leistungskennzahlen für die operative Steuerung.",
      "tag": "Personal · KPI · Ungarn",
      "technologies": [
        "Power BI",
        "KPI",
        "Personalplanung",
        "Betrieb"
      ]
    },
    "arbopark": {
      "title": "Power-BI-Reporting direkt auf Microsoft SQL Server",
      "summary": "Direkte Verbindung von Power BI mit MSSQL, Datenmodell und analytische Auswertungen.",
      "challenge": "Fragmentierte Datenansichten durch eine einheitliche Reporting-Lösung direkt auf der Datenbank ersetzen.",
      "solution": [
        "Power BI mit Microsoft SQL Server verbinden.",
        "Datenquellen und Datenmodell vorbereiten.",
        "Analytische Ansichten und KPIs entwerfen.",
        "Datenaktualisierung und Erweiterbarkeit des Reportings konfigurieren."
      ],
      "outcome": "Es entstand eine Daten- und Reporting-Ebene direkt auf der Datenbank, die für weitere Erweiterungen vorbereitet ist.",
      "tag": "Power BI · MSSQL · Datenintegration",
      "technologies": [
        "Power BI",
        "Microsoft SQL Server",
        "SQL",
        "Datenmodellierung"
      ]
    }
  },
  "pl": {
    "frost": {
      "title": "Planowanie produkcji, raportowanie i zautomatyzowane przepływy danych",
      "summary": "Planowanie w Power BI, automatyzacja skryptami shell, ewidencja punktów kamerowych i obliczanie zużycia mąki przez API.",
      "challenge": "Połączyć planowanie, dane kontrolne i obliczenia operacyjne w jeden użyteczny system wspierający codzienne decyzje.",
      "solution": [
        "Konfiguracja planowania i widoków zarządczych w Power BI.",
        "Automatyczne uzupełnianie danych za pomocą skryptów shell.",
        "Ewidencjonowanie i nanoszenie punktów kamerowych na plan obiektu.",
        "Raportowanie kontrolne w Power BI na potrzeby kontroli operacyjnych.",
        "Integracja obliczeń zużycia mąki za pomocą API."
      ],
      "outcome": "Efektem jest zintegrowane raportowanie i planowanie oparte na rzeczywistych danych operacyjnych, mniej zależne od ręcznego przetwarzania.",
      "tag": "Power BI · API · Automatyzacja",
      "technologies": [
        "Power BI",
        "DAX",
        "API",
        "Shell",
        "Automatyzacja"
      ]
    },
    "hollen": {
      "title": "Operacyjne planowanie produkcji w ciągu 24 godzin",
      "summary": "Kompleksowe narzędzie planistyczne oparte na zużyciu linii, monitorowanie opakowań i wdrożenie Power BI.",
      "challenge": "Przenieść ręczne planowanie do szybkiego narzędzia uwzględniającego zużycie na liniach i zapasy materiałów opakowaniowych.",
      "solution": [
        "Projekt modelu planistycznego na podstawie zużycia linii produkcyjnych.",
        "Monitorowanie materiałów opakowaniowych i zapotrzebowania na nie.",
        "Warstwa Power BI dla widoków operacyjnych i zarządczych.",
        "Szybkie prototypowanie i wdrożenie użytecznego narzędzia planistycznego."
      ],
      "outcome": "Planowanie przeniesiono do narzędzia umożliwiającego szybsze reagowanie na bieżące zużycie na liniach oraz dostępność opakowań.",
      "tag": "Planowanie · Power BI · Operacje",
      "technologies": [
        "Power BI",
        "Excel",
        "Power Query",
        "Planowanie",
        "Operacje"
      ]
    },
    "vedos": {
      "title": "Logistyka dostaw palet i planowanie linii przepakowywania",
      "summary": "Planowanie przepływu palet, wydajności i pracy linii przepakowywania.",
      "challenge": "Zwiększyć przejrzystość przepływów logistycznych i planowania linii, aby zapewnić jasny obraz zapotrzebowania na palety i zdolności operacyjnych.",
      "solution": [
        "Model przepływu logistycznego dostaw palet.",
        "Planowanie wydajności i wykorzystania linii przepakowywania.",
        "Przegląd danych operacyjnych wspierający bieżące decyzje."
      ],
      "outcome": "Powstał spójny obraz logistyki i planowania linii, wspierający podejmowanie decyzji operacyjnych.",
      "tag": "Logistyka · Planowanie · Przepływ pracy",
      "technologies": [
        "Logistyka",
        "Planowanie",
        "Dane",
        "Przepływ pracy"
      ]
    },
    "betonoveploty": {
      "title": "Kompleksowe rozwiązanie webowe i wdrożenie produkcyjne",
      "summary": "Kompletna strona internetowa, struktura produktów, UX, formularze i wdrożenie techniczne.",
      "challenge": "Stworzyć nowoczesny serwis, który przejrzyście prezentuje szeroki asortyment oraz wspiera pozyskiwanie zapytań.",
      "solution": [
        "Projekt architektury informacji i interfejsu użytkownika.",
        "Kategorie produktów i strony prezentacyjne.",
        "Formularze kontaktowe i ofertowe.",
        "Konfiguracja techniczna i wdrożenie produkcyjne."
      ],
      "outcome": "Efektem jest nowoczesna strona internetowa gotowa do obsługi zapytań handlowych i dalszego rozwoju.",
      "tag": "Web · UX · Wdrożenie",
      "technologies": [
        "Web",
        "UX/UI",
        "Next.js",
        "SEO",
        "Wdrożenie"
      ]
    },
    "tvojbyt": {
      "title": "Aplikacja Flutter na zamówienie",
      "summary": "Wieloplatformowa aplikacja mobilna przygotowana do dalszych integracji API.",
      "challenge": "Przygotować produkt mobilny umożliwiający rozszerzenie istniejącej sprzedaży internetowej o osobny kanał aplikacyjny.",
      "solution": [
        "Projekt ścieżek użytkownika w aplikacji.",
        "Rozwój wieloplatformowy we Flutterze.",
        "Przygotowanie do integracji API i źródeł danych.",
        "Architektura dostosowana do dalszego rozwoju na Androidzie i iOS."
      ],
      "outcome": "Powstała podstawa dedykowanej aplikacji o wieloplatformowej architekturze i możliwościach rozbudowy.",
      "tag": "Flutter · Aplikacje mobilne · Aplikacja na zamówienie",
      "technologies": [
        "Flutter",
        "Dart",
        "Android",
        "iOS",
        "API"
      ]
    },
    "heko": {
      "title": "Integracja starszego systemu Ecoray z automatycznym przepływem danych",
      "summary": "Połączenie z istniejącym systemem Ecoray i bazą danych oraz automatyczne przetwarzanie w Power Query.",
      "challenge": "Udostępnić dane ze starszego systemu bez konieczności ręcznego eksportowania i przepisywania informacji.",
      "solution": [
        "Analiza istniejącego systemu Ecoray i bazy danych.",
        "Podłączenie dostępnych źródeł danych.",
        "Automatyczne pobieranie i transformacja danych w Power Query.",
        "Przygotowanie danych do dalszego raportowania i analiz."
      ],
      "outcome": "Starszy system włączono do zautomatyzowanego przepływu danych, co ograniczyło ręczną pracę przy ich przygotowywaniu.",
      "tag": "Ecoray · Power Query · Integracja starszych systemów",
      "technologies": [
        "Ecoray",
        "MS Access",
        "Power Query",
        "Excel",
        "Integracja starszych systemów"
      ]
    },
    "dobrotka": {
      "title": "Kompleksowa konfiguracja strony internetowej",
      "summary": "Rozwiązanie webowe od struktury i projektu przez konfigurację techniczną po wdrożenie.",
      "challenge": "Przygotować prostą, czytelną i użyteczną w codziennej pracy prezentację internetową dla lokalu gastronomicznego.",
      "solution": [
        "Struktura treści i ścieżki użytkownika.",
        "Responsywny projekt strony.",
        "Konfiguracja techniczna i publikacja.",
        "Przygotowanie treści do codziennego użytkowania."
      ],
      "outcome": "Powstała kompaktowa strona gotowa do bieżącego użytkowania i komunikacji z klientami.",
      "tag": "Web · Wdrożenie · Cyfryzacja",
      "technologies": [
        "Web",
        "Responsywny interfejs",
        "Wdrożenie",
        "Treści"
      ]
    },
    "ql": {
      "title": "Kumulatywne planowanie zapotrzebowania na pracowników i monitoring KPI",
      "summary": "Monitorowanie zapotrzebowania na pracowników, KPI na Węgrzech i raportowanie dla głównego partnera.",
      "challenge": "Zapewnić przejrzysty obraz bieżącego i przyszłego zapotrzebowania na pracowników w całej działalności oraz monitorować KPI względem głównego partnera.",
      "solution": [
        "Kumulatywny model zapotrzebowania na pracowników.",
        "Monitoring KPI dla operacji na Węgrzech.",
        "Przegląd zdolności, realizacji i wymagań operacyjnych.",
        "Raportowanie przygotowane do komunikacji z głównym partnerem."
      ],
      "outcome": "Rozwiązanie zapewnia wspólny obraz potencjału kadrowego i wskaźników wydajności na potrzeby zarządzania operacyjnego.",
      "tag": "Personel · KPI · Węgry",
      "technologies": [
        "Power BI",
        "KPI",
        "Planowanie zatrudnienia",
        "Operacje"
      ]
    },
    "arbopark": {
      "title": "Raportowanie Power BI bezpośrednio na Microsoft SQL Server",
      "summary": "Bezpośrednie połączenie Power BI z MSSQL, model danych i wyniki analiz.",
      "challenge": "Zastąpić rozproszone widoki danych jednym rozwiązaniem raportowym działającym bezpośrednio na bazie danych.",
      "solution": [
        "Połączenie Power BI z Microsoft SQL Server.",
        "Przygotowanie źródeł i modelu danych.",
        "Projekt widoków analitycznych i KPI.",
        "Konfiguracja odświeżania danych i możliwości dalszej rozbudowy raportowania."
      ],
      "outcome": "Powstała warstwa danych i raportowanie bezpośrednio na bazie, przygotowane do dalszej rozbudowy.",
      "tag": "Power BI · MSSQL · Integracja danych",
      "technologies": [
        "Power BI",
        "Microsoft SQL Server",
        "SQL",
        "Modelowanie danych"
      ]
    }
  },
  "es": {
    "frost": {
      "title": "Planificación de la producción, informes y flujos de datos automatizados",
      "summary": "Planificación en Power BI, automatización mediante scripts de shell, registro de puntos de cámaras y cálculo del consumo de harina mediante API.",
      "challenge": "Unificar la planificación, los datos de control y los cálculos operativos en un único sistema útil para la toma de decisiones diaria.",
      "solution": [
        "Configurar la planificación y las vistas de gestión en Power BI.",
        "Automatizar la actualización de datos mediante scripts de shell.",
        "Registrar y situar en planos los puntos de cámaras de toda la instalación.",
        "Desarrollar informes de control en Power BI para las comprobaciones operativas.",
        "Integrar los cálculos de consumo de harina mediante API."
      ],
      "outcome": "El resultado es una solución integrada de informes y planificación basada en datos operativos reales, con menor dependencia del procesamiento manual.",
      "tag": "Power BI · API · Automatización",
      "technologies": [
        "Power BI",
        "DAX",
        "API",
        "Shell",
        "Automatización"
      ]
    },
    "hollen": {
      "title": "Planificación operativa de la producción en 24 horas",
      "summary": "Herramienta integral de planificación basada en el consumo de las líneas, seguimiento de embalajes e implementación de Power BI.",
      "challenge": "Sustituir la planificación manual por una herramienta ágil que tenga en cuenta el consumo de las líneas y las existencias de materiales de embalaje.",
      "solution": [
        "Diseñar un modelo de planificación basado en el consumo de las líneas de producción.",
        "Supervisar los materiales de embalaje y sus necesidades.",
        "Implementar una capa de Power BI para las vistas operativas y de dirección.",
        "Desarrollar rápidamente un prototipo y desplegar una herramienta de planificación operativa."
      ],
      "outcome": "La planificación se trasladó a una herramienta que permite responder con mayor rapidez al consumo actual de las líneas y a la disponibilidad de embalajes.",
      "tag": "Planificación · Power BI · Operaciones",
      "technologies": [
        "Power BI",
        "Excel",
        "Power Query",
        "Planificación",
        "Operaciones"
      ]
    },
    "vedos": {
      "title": "Logística de suministro de palés y planificación de la línea de reenvasado",
      "summary": "Planificación del flujo logístico de palés, la capacidad y el funcionamiento de la línea de reenvasado.",
      "challenge": "Mejorar la visibilidad del flujo logístico y de la planificación de la línea para que el equipo de operaciones conozca claramente las necesidades de palés y la capacidad disponible.",
      "solution": [
        "Modelar el flujo logístico de suministro de palés.",
        "Planificar la capacidad y el grado de utilización de la línea de reenvasado.",
        "Presentar los datos operativos para apoyar la toma de decisiones diaria."
      ],
      "outcome": "Se obtuvo una visión integrada de la logística y la planificación de la línea que facilita las decisiones operativas.",
      "tag": "Logística · Planificación · Flujos de trabajo",
      "technologies": [
        "Logística",
        "Planificación",
        "Datos",
        "Flujos de trabajo"
      ]
    },
    "betonoveploty": {
      "title": "Solución web integral y despliegue en producción",
      "summary": "Sitio web completo, estructura de productos, UX, formularios y despliegue técnico.",
      "challenge": "Crear un sitio web moderno que presente claramente una amplia gama de productos y facilite la captación de solicitudes comerciales.",
      "solution": [
        "Diseñar la arquitectura de información y la interfaz de usuario.",
        "Crear categorías de productos y páginas de presentación.",
        "Implementar formularios de contacto y solicitud de presupuesto.",
        "Realizar la configuración técnica y el despliegue en producción."
      ],
      "outcome": "El resultado es un sitio web moderno preparado para recibir solicitudes comerciales y evolucionar en el futuro.",
      "tag": "Web · UX · Despliegue",
      "technologies": [
        "Web",
        "UX/UI",
        "Next.js",
        "SEO",
        "Despliegue"
      ]
    },
    "tvojbyt": {
      "title": "Aplicación Flutter a medida",
      "summary": "Aplicación móvil multiplataforma diseñada para admitir futuras integraciones mediante API.",
      "challenge": "Preparar un producto móvil que permita ampliar las ventas en línea existentes mediante un canal independiente basado en una aplicación.",
      "solution": [
        "Diseñar los recorridos de usuario de la aplicación.",
        "Desarrollar una aplicación multiplataforma con Flutter.",
        "Preparar la integración de API y fuentes de datos.",
        "Definir una arquitectura adecuada para seguir desarrollando la aplicación en Android e iOS."
      ],
      "outcome": "Se estableció la base de una aplicación a medida con arquitectura multiplataforma y posibilidades de ampliación.",
      "tag": "Flutter · Aplicaciones móviles · Aplicación a medida",
      "technologies": [
        "Flutter",
        "Dart",
        "Android",
        "iOS",
        "API"
      ]
    },
    "heko": {
      "title": "Integración del sistema heredado Ecoray con flujos de datos automatizados",
      "summary": "Conexión con el sistema Ecoray existente y su base de datos, con procesamiento automatizado mediante Power Query.",
      "challenge": "Facilitar el acceso a los datos de un sistema heredado sin necesidad de exportarlos y volver a introducirlos manualmente.",
      "solution": [
        "Analizar el sistema Ecoray existente y su base de datos.",
        "Conectar las fuentes de datos disponibles.",
        "Automatizar la carga y transformación de datos con Power Query.",
        "Preparar los datos para informes y análisis posteriores."
      ],
      "outcome": "El sistema heredado se integró en un flujo de datos automatizado, reduciendo el trabajo manual de preparación de los datos.",
      "tag": "Ecoray · Power Query · Integración de sistemas heredados",
      "technologies": [
        "Ecoray",
        "MS Access",
        "Power Query",
        "Excel",
        "Integración de sistemas heredados"
      ]
    },
    "dobrotka": {
      "title": "Configuración integral del sitio web",
      "summary": "Solución web que abarca desde la estructura y el diseño hasta la configuración técnica y el despliegue.",
      "challenge": "Preparar una presencia en línea sencilla, clara y funcional para un establecimiento de restauración.",
      "solution": [
        "Definir la estructura de contenidos y los recorridos de usuario.",
        "Crear un diseño web adaptable.",
        "Configurar y publicar el sitio web.",
        "Preparar los contenidos para el uso diario."
      ],
      "outcome": "Se obtuvo un sitio web compacto preparado para el funcionamiento habitual y la comunicación con los clientes.",
      "tag": "Web · Despliegue · Digitalización",
      "technologies": [
        "Web",
        "Interfaz adaptable",
        "Despliegue",
        "Contenidos"
      ]
    },
    "ql": {
      "title": "Planificación acumulativa de necesidades de personal y seguimiento de KPI",
      "summary": "Seguimiento de necesidades de personal, KPI en Hungría e informes para el socio principal.",
      "challenge": "Ofrecer una visión clara de las necesidades actuales y futuras de personal en las operaciones y, al mismo tiempo, supervisar los KPI acordes con el socio principal.",
      "solution": [
        "Crear un modelo acumulativo de necesidades de personal.",
        "Supervisar los KPI de las operaciones en Hungría.",
        "Presentar la capacidad, el cumplimiento y los requisitos operativos.",
        "Preparar informes para la comunicación con el socio principal."
      ],
      "outcome": "La solución ofrece una visión compartida de la capacidad de personal y los indicadores de rendimiento para la gestión operativa.",
      "tag": "Personal · KPI · Hungría",
      "technologies": [
        "Power BI",
        "KPI",
        "Planificación de personal",
        "Operaciones"
      ]
    },
    "arbopark": {
      "title": "Informes de Power BI directamente sobre Microsoft SQL Server",
      "summary": "Conexión directa de Power BI con MSSQL, modelo de datos y resultados analíticos.",
      "challenge": "Sustituir las vistas de datos fragmentadas por una solución unificada de informes directamente sobre la base de datos.",
      "solution": [
        "Conectar Power BI con Microsoft SQL Server.",
        "Preparar las fuentes y el modelo de datos.",
        "Diseñar vistas analíticas e indicadores KPI.",
        "Configurar la actualización de datos y la ampliación futura de los informes."
      ],
      "outcome": "Se creó una capa de datos y de informes directamente sobre la base de datos, preparada para futuras ampliaciones.",
      "tag": "Power BI · MSSQL · Integración de datos",
      "technologies": [
        "Power BI",
        "Microsoft SQL Server",
        "SQL",
        "Modelado de datos"
      ]
    }
  }
} satisfies Record<Locale, Record<StudyId, StudyCopy>>;

function normalizeLocale(value: unknown): Locale {
  const code = String(value ?? "sk").toLowerCase().split(/[-_]/)[0];
  const normalized = code === "cz" ? "cs" : code;
  return (LOCALES as readonly string[]).includes(normalized)
    ? (normalized as Locale)
    : "sk";
}

function CompanyLogo({ project, large = false }: { project: StudyMeta; large?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const monogram = project.name.replace(/[^A-Za-z0-9+]/g, "").slice(0, 3).toUpperCase();
  return (
    <div className={`reference-logo-wrap${large ? " large" : ""}`} aria-hidden="true">
      {project.domain && !imageFailed && (
        // Preserve the favicon provider used in the original project.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(project.domain)}&sz=128`}
          alt=""
          className="reference-logo"
          onError={() => setImageFailed(true)}
          decoding="async"
        />
      )}
      <span className="reference-monogram">{monogram}</span>
    </div>
  );
}

export default function CaseStudies() {
  const { lang } = useLanguage();
  const locale = normalizeLocale(lang);
  const t = LABELS[locale];
  const localized = COPY[locale];
  // Store only the ID, never a snapshot of translated text.
  const [selectedId, setSelectedId] = useState<StudyId | null>(null);
  const selected = selectedId ? PROJECTS[selectedId] : null;
  const details = selectedId ? localized[selectedId] : null;
  const modalRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogTitleId = useId();
  const dialogSummaryId = useId();

  useEffect(() => {
    if (!selectedId) return;
    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;
    const dialog = modalRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedId(null);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]'
      )).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !dialog.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !dialog.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (opener?.isConnected) opener.focus();
    };
  }, [selectedId]);

  return (
    <section className="section references-section" id="referencie" lang={locale}>
      <div className="wrap" inert={selectedId !== null}>
        <div className="section-heading references-heading">
          <div>
            <div className="eyebrow dark"><span />{t.k}</div>
            <h2>{t.h}</h2>
          </div>
          <p>{t.p}</p>
        </div>
        <div className="reference-logo-grid">
          {STUDY_IDS.map((id, index) => {
            const project = PROJECTS[id];
            const text = localized[id];
            return (
              <article className={`reference-company-card${index === 0 ? " featured" : ""}`} key={id}>
                <div className="reference-company-head">
                  <CompanyLogo project={project} />
                  <div><strong>{project.name}</strong><small>{text.tag}</small></div>
                </div>
                <h3>{text.title}</h3>
                <p>{text.summary}</p>
                <div className="reference-card-actions">
                  <button type="button" className="case-study-button" aria-haspopup="dialog"
                    aria-label={`${t.study}: ${project.name}`}
                    onClick={(event) => {
                      openerRef.current = event.currentTarget;
                      setSelectedId(id);
                    }}>
                    {t.study}<span aria-hidden="true">↗</span>
                  </button>
                  {project.website ? (
                    <a className="reference-web-link" href={project.website} target="_blank" rel="noopener noreferrer">
                      {t[project.linkKind]}<span aria-hidden="true">↗</span>
                    </a>
                  ) : <span className="reference-private">{t.private}</span>}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selected && details && selectedId && (
        <div className="case-modal-backdrop" role="presentation"
          onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedId(null); }}>
          <article className="case-modal" ref={modalRef} role="dialog" aria-modal="true"
            aria-labelledby={dialogTitleId} aria-describedby={dialogSummaryId}>
            <button className="case-modal-close" type="button" ref={closeRef}
              onClick={() => setSelectedId(null)} aria-label={t.close}>×</button>
            <div className="case-modal-brand">
              <CompanyLogo key={selectedId} project={selected} large />
              <div><span>{details.tag}</span><h2>{selected.name}</h2></div>
            </div>
            <h3 className="case-modal-title" id={dialogTitleId}>{details.title}</h3>
            <div className="case-modal-grid">
              <section><small>{t.challenge}</small><p id={dialogSummaryId}>{details.challenge}</p></section>
              <section><small>{t.solution}</small><ul>{details.solution.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><small>{t.tech}</small><div className="case-tech-list">{details.technologies.map((item) => <span key={item}>{item}</span>)}</div></section>
              <section><small>{t.outcome}</small><p>{details.outcome}</p></section>
            </div>
            <div className="case-modal-footer">
              {selected.website && (
                <a href={selected.website} target="_blank" rel="noopener noreferrer" className="button button-primary">
                  {t[selected.linkKind]} <span aria-hidden="true">↗</span>
                </a>
              )}
              <button type="button" className="button case-close-button" onClick={() => setSelectedId(null)}>{t.close}</button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

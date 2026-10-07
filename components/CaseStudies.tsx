"use client";
import { useLanguage } from "@/components/LanguageProvider";

const base=[
 {name:"FROST a.s.",tag:"Power BI · API · Automation"},
 {name:"HOLLEN s.r.o.",tag:"Planning · Power BI · Operations"},
 {name:"VEDOS",tag:"Logistics · Planning · Workflow"},
 {name:"BETONOVEPLOTY.eu",tag:"Web · Next.js · UX"},
 {name:"TVOJBYT.sk",tag:"Flutter · Mobile · Custom App"},
 {name:"H+EKO",tag:"Ecoray · Power Query · Legacy Integration"},
 {name:"DOBROTKA.online",tag:"Web · Deployment · Digital"},
 {name:"QL INDUSTRIAL SERVICES",tag:"Workforce · KPI · Hungary"},
 {name:"ARBOPARK",tag:"Power BI · MSSQL · Data Integration"}
];

const copy:any={
 sk:{k:"REFERENCIE & PRÍPADOVÉ ŠTÚDIE",h:"Riešenia postavené na reálnych procesoch.",p:"Vybrané realizácie naprieč výrobou, logistikou, BI, webom a mobilnými aplikáciami. Uvádzam konkrétny rozsah dodaného riešenia bez vymýšľania marketingových metrík.",partners:"Partneri a realizácie",review:"Textové recenzie zverejňujem až po odsúhlasení klientom. Nižšie preto prezentujem overiteľný rozsah realizovaných riešení.",items:[
  ["Plánovanie a reporting výrobných procesov","Nastavenie plánovania v Power BI, automatizované dopĺňanie dát cez shell skripty, evidencia a zakresľovanie kamerových bodov v celom objekte, kontrolný Power BI reporting a výpočty spotreby múky prepojené cez API."],
  ["Operatívne plánovanie do 24 hodín","Kompletný plánovací nástroj založený na spotrebe výrobných liniek, sledovanie obalového materiálu a implementácia Power BI pre operatívny aj manažérsky pohľad."],
  ["Logistika a plánovanie prebaľovacej linky","Riešenie logistiky navážania paliet, plánovanie kapacity a toku prebaľovacej linky a podpora rozhodovania nad prevádzkovými dátami."],
  ["Kompletné webové riešenie","Návrh, konfigurácia a realizácia webovej prezentácie vrátane štruktúry obsahu, používateľského rozhrania, formulárov, technického nastavenia a produkčného nasadenia."],
  ["Flutter aplikácia na mieru","Vývoj mobilnej aplikácie na mieru vo Flutteri s dôrazom na multiplatformové použitie, používateľský tok a pripravenosť na ďalšie API a dátové integrácie."],
  ["Prepojenie starého systému Ecoray","Napojenie na existujúci systém Ecoray a jeho databázu, automatické získavanie a transformácia dát cez Power Query a príprava dátového toku pre ďalšie reportovanie."],
  ["Kompletné nastavenie webovej stránky","Kompletná príprava webového riešenia od štruktúry a dizajnu cez technickú konfiguráciu až po nasadenie a základnú prevádzkovú pripravenosť."],
  ["Kumulatívne plánovanie potreby pracovníkov","Kumulatívne sledovanie potreby pracovníkov, KPI monitoring pre prevádzku v Maďarsku a reporting pre hlavného partnera s dôrazom na kapacitu, plnenie a operatívne rozhodovanie."],
  ["Power BI napojené na Microsoft SQL Server","Nastavenie Power BI reportingu a priame prepojenie na Microsoft SQL Server vrátane prípravy dátových zdrojov, modelu a analytických výstupov."]]},
 cs:{k:"REFERENCE & PŘÍPADOVÉ STUDIE",h:"Řešení postavená na reálných procesech.",p:"Vybrané realizace ve výrobě, logistice, BI, webu a mobilních aplikacích. Uvádím konkrétní rozsah dodaného řešení bez vymyšlených marketingových metrik.",partners:"Partneři a realizace",review:"Textové recenze zveřejňuji až po schválení klientem. Níže proto uvádím konkrétní rozsah realizovaných řešení.",items:[
  ["Plánování a reporting výrobních procesů","Nastavení plánování v Power BI, automatizované doplňování dat pomocí shell skriptů, evidence a zakreslení kamerových bodů v celém objektu, kontrolní reporting a výpočty spotřeby mouky propojené přes API."],
  ["Operativní plánování do 24 hodin","Kompletní plánovací nástroj založený na spotřebě výrobních linek, sledování obalového materiálu a implementace Power BI pro operativní i manažerský pohled."],
  ["Logistika a plánování přebalovací linky","Řešení logistiky navážení palet, plánování kapacity a toku přebalovací linky a podpora rozhodování nad provozními daty."],
  ["Kompletní webové řešení","Návrh a realizace webu včetně obsahové struktury, UI, formulářů, technické konfigurace a produkčního nasazení."],
  ["Flutter aplikace na míru","Vývoj mobilní aplikace na míru ve Flutteru s důrazem na multiplatformní použití, uživatelský tok a připravenost na API a datové integrace."],
  ["Propojení starého systému Ecoray","Napojení na existující Ecoray a databázi, automatické získávání a transformace dat přes Power Query a příprava datového toku pro reporting."],
  ["Kompletní nastavení webu","Příprava webového řešení od struktury a designu přes technickou konfiguraci až po nasazení a provozní připravenost."],
  ["Kumulativní plánování potřeby pracovníků","Sledování kumulativní potřeby pracovníků, KPI monitoring v Maďarsku a reporting pro hlavního partnera se zaměřením na kapacitu a plnění."],
  ["Power BI propojené s Microsoft SQL Server","Nastavení Power BI reportingu a přímé propojení s Microsoft SQL Server včetně datových zdrojů, modelu a analytických výstupů."]]},
 en:{k:"REFERENCES & CASE STUDIES",h:"Solutions built around real operations.",p:"Selected work across manufacturing, logistics, BI, web and mobile apps. The descriptions focus on delivered scope rather than invented marketing metrics.",partners:"Partners & delivered projects",review:"Written testimonials are published only with client approval. The section below therefore presents the concrete scope of delivered solutions.",items:[
  ["Production planning and operational reporting","Power BI planning, automated data completion through shell scripts, mapping of camera points across the facility, control reporting and API-connected flour-consumption calculations."],
  ["Operational planning within 24 hours","A complete planning tool driven by production-line consumption, packaging-material tracking and Power BI implementation for operational and management views."],
  ["Pallet logistics and repacking-line planning","Inbound pallet logistics, capacity and flow planning for the repacking line, with operational data supporting day-to-day decisions."],
  ["Complete website solution","Website structure, interface, forms, technical configuration and production deployment delivered as one end-to-end web solution."],
  ["Custom Flutter application","A tailored Flutter mobile app focused on cross-platform use, clear user flows and readiness for further API and data integrations."],
  ["Legacy Ecoray integration","Connection to the existing Ecoray system and database, automated extraction and transformation through Power Query and a reusable reporting data flow."],
  ["Complete website setup","End-to-end website preparation from structure and design to technical configuration, deployment and basic operational readiness."],
  ["Cumulative workforce-demand planning","Cumulative workforce-need tracking, KPI monitoring for operations in Hungary and reporting for the main partner, focused on capacity and fulfilment."],
  ["Power BI connected to Microsoft SQL Server","Power BI reporting with direct Microsoft SQL Server connectivity, including data-source preparation, modelling and analytical outputs."]]},
 de:{k:"REFERENZEN & CASE STUDIES",h:"Lösungen für reale Geschäftsprozesse.",p:"Ausgewählte Projekte aus Produktion, Logistik, BI, Web und Mobile. Beschrieben wird der tatsächlich gelieferte Umfang statt erfundener Marketingkennzahlen.",partners:"Partner & Projekte",review:"Kundenstimmen werden nur nach Freigabe veröffentlicht. Daher zeigen wir hier den konkreten Umfang der realisierten Lösungen.",items:[
  ["Produktionsplanung und Reporting","Power-BI-Planung, automatisierte Datenergänzung über Shell-Skripte, Dokumentation von Kamerapunkten im gesamten Objekt, Kontrollreporting und API-gestützte Berechnung des Mehlverbrauchs."],
  ["Operative Planung innerhalb von 24 Stunden","Komplettes Planungstool auf Basis des Verbrauchs der Produktionslinien, Verpackungsverfolgung und Power-BI-Implementierung für operative und Management-Sichten."],
  ["Palettenlogistik und Planung der Umpacklinie","Logistik der Palettenzufuhr, Kapazitäts- und Flussplanung der Umpacklinie sowie Entscheidungsunterstützung auf Basis von Betriebsdaten."],
  ["Komplette Weblösung","Konzeption und Umsetzung der Website einschließlich Struktur, UI, Formulare, technische Konfiguration und Produktionsdeployment."],
  ["Individuelle Flutter-App","Maßgeschneiderte mobile Flutter-Anwendung mit Fokus auf plattformübergreifende Nutzung, User Flow und zukünftige API- und Datenintegrationen."],
  ["Integration des Altsystems Ecoray","Anbindung des bestehenden Ecoray-Systems und der Datenbank, automatische Datenübernahme und Transformation mit Power Query sowie Reporting-Datenfluss."],
  ["Komplette Website-Einrichtung","Weblösung von Struktur und Design über technische Konfiguration bis Deployment und betriebliche Grundkonfiguration."],
  ["Kumulative Personalbedarfsplanung","Kumulative Erfassung des Personalbedarfs, KPI-Monitoring für den Betrieb in Ungarn und Reporting für den Hauptpartner."],
  ["Power BI mit Microsoft SQL Server","Power-BI-Reporting mit direkter SQL-Server-Anbindung einschließlich Datenquellen, Modell und analytischen Ausgaben."]]},
 pl:{k:"REFERENCJE & CASE STUDIES",h:"Rozwiązania oparte na realnych procesach.",p:"Wybrane realizacje z produkcji, logistyki, BI, web i aplikacji mobilnych. Opisujemy faktyczny zakres zamiast wymyślonych wskaźników marketingowych.",partners:"Partnerzy i realizacje",review:"Opinie tekstowe publikujemy dopiero po akceptacji klienta. Poniżej pokazujemy więc konkretny zakres wykonanych rozwiązań.",items:[
  ["Planowanie produkcji i raportowanie","Planowanie w Power BI, automatyczne uzupełnianie danych skryptami shell, ewidencja punktów kamerowych w całym obiekcie, raporty kontrolne i obliczenia zużycia mąki przez API."],
  ["Planowanie operacyjne w ciągu 24 godzin","Kompletne narzędzie planistyczne oparte na zużyciu linii produkcyjnych, śledzenie opakowań i wdrożenie Power BI dla operacji i kadry zarządzającej."],
  ["Logistyka palet i planowanie linii przepakowania","Logistyka dowozu palet, planowanie przepustowości i przepływu linii przepakowania oraz wsparcie decyzji na podstawie danych operacyjnych."],
  ["Kompletne rozwiązanie webowe","Projekt i realizacja serwisu wraz ze strukturą, UI, formularzami, konfiguracją techniczną i wdrożeniem produkcyjnym."],
  ["Dedykowana aplikacja Flutter","Aplikacja mobilna Flutter na zamówienie, przygotowana do pracy wieloplatformowej oraz dalszych integracji API i danych."],
  ["Integracja starszego systemu Ecoray","Połączenie z istniejącym Ecoray i bazą danych, automatyczne pobieranie i transformacja w Power Query oraz przygotowanie przepływu raportowego."],
  ["Kompletna konfiguracja strony internetowej","Rozwiązanie od struktury i projektu przez konfigurację techniczną aż po wdrożenie i gotowość operacyjną."],
  ["Kumulatywne planowanie zapotrzebowania na pracowników","Śledzenie skumulowanego zapotrzebowania na pracowników, KPI dla operacji na Węgrzech i raportowanie dla głównego partnera."],
  ["Power BI z Microsoft SQL Server","Konfiguracja raportowania Power BI i bezpośrednie połączenie z Microsoft SQL Server wraz z modelem danych i analizami."]]},
 es:{k:"REFERENCIAS & CASOS",h:"Soluciones construidas sobre procesos reales.",p:"Proyectos seleccionados en fabricación, logística, BI, web y apps móviles. Se presenta el alcance entregado, no métricas de marketing inventadas.",partners:"Socios y proyectos",review:"Los testimonios escritos se publican solo con aprobación del cliente. Por eso mostramos el alcance concreto de los proyectos realizados.",items:[
  ["Planificación de producción y reporting","Planificación en Power BI, carga automática mediante scripts shell, registro de puntos de cámaras en toda la instalación, reporting de control y cálculos de consumo de harina conectados por API."],
  ["Planificación operativa en 24 horas","Herramienta completa basada en el consumo de las líneas de producción, seguimiento de embalajes e implementación de Power BI para operaciones y dirección."],
  ["Logística de palés y planificación de la línea de reempaque","Logística de entrada de palés, planificación de capacidad y flujo de la línea de reempaque y soporte a decisiones con datos operativos."],
  ["Solución web completa","Diseño y realización del sitio, estructura de contenidos, interfaz, formularios, configuración técnica y despliegue en producción."],
  ["Aplicación Flutter a medida","App móvil Flutter personalizada, orientada al uso multiplataforma y preparada para futuras integraciones de API y datos."],
  ["Integración con el sistema legado Ecoray","Conexión con Ecoray y su base de datos, extracción y transformación automática mediante Power Query y flujo de datos para reporting."],
  ["Configuración completa del sitio web","Preparación integral desde estructura y diseño hasta configuración técnica, despliegue y preparación operativa básica."],
  ["Planificación acumulativa de necesidades de personal","Seguimiento acumulado de necesidades de personal, KPI para operaciones en Hungría y reporting para el socio principal."],
  ["Power BI conectado a Microsoft SQL Server","Reporting Power BI con conexión directa a Microsoft SQL Server, preparación de fuentes, modelo de datos y salidas analíticas."]]}
};

export default function CaseStudies(){const {lang}=useLanguage();const x=copy[lang];return <section className="section references-section" id="referencie"><div className="wrap"><div className="section-heading references-heading"><div><div className="eyebrow dark"><span/>{x.k}</div><h2>{x.h}</h2></div><p>{x.p}</p></div><div className="partner-marquee" aria-label={x.partners}>{base.map(p=><span key={p.name}>{p.name}</span>)}</div><div className="reference-note"><span>✓</span><p>{x.review}</p></div><div className="case-grid">{base.map((p,i)=><article className={`case-card ${i===0||i===1?"case-card-featured":""}`} key={p.name}><div className="case-index">{String(i+1).padStart(2,"0")}</div><div className="case-brand">{p.name}</div><div className="case-tags">{p.tag}</div><h3>{x.items[i][0]}</h3><p>{x.items[i][1]}</p></article>)}</div></div></section>}

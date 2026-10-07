"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Study = {
  name: string;
  tag: string;
  domain?: string;
  website?: string;
  publicLabel?: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string[];
  technologies: string[];
  outcome: string;
};

const studies: Study[] = [
  {
    name:"FROST a.s.", tag:"Power BI · API · Automation", domain:"frost.sk", website:"https://www.frost.sk/sk",
    title:"Plánovanie, výrobný reporting a automatizované dátové toky",
    summary:"Power BI plánovanie, shell automatizácie, evidencia kamerových bodov a API výpočty spotreby múky.",
    challenge:"Zjednotiť plánovanie, kontrolné dáta a prevádzkové výpočty do jedného použiteľného systému pre každodenné rozhodovanie.",
    solution:["Nastavenie plánovania a manažérskych pohľadov v Power BI.","Automatizované dopĺňanie dát cez shell skripty.","Evidencia a zakresľovanie kamerových bodov v rámci objektu.","Kontrolný Power BI reporting pre prevádzkové kontroly.","Výpočty spotreby múky prepojené cez API."],
    technologies:["Power BI","DAX","API","Shell","Automation"], outcome:"Výsledkom je prepojený reporting a plánovanie postavené na reálnych prevádzkových dátach, s menšou závislosťou od manuálneho spracovania."
  },
  {
    name:"HOLLEN s.r.o.", tag:"Planning · Power BI · Operations", domain:"hollen.sk", website:"https://www.hollen.sk/",
    title:"Operatívne plánovanie výroby do 24 hodín",
    summary:"Kompletný plánovací nástroj podľa spotreby liniek, sledovanie obalov a Power BI implementácia.",
    challenge:"Dostať plánovanie z manuálneho režimu do rýchleho nástroja, ktorý vie pracovať so spotrebou liniek a zásobami obalového materiálu.",
    solution:["Návrh plánovacieho modelu na základe spotreby výrobných liniek.","Sledovanie obalového materiálu a jeho potreby.","Power BI vrstva pre operatívny a manažérsky pohľad.","Rýchly prototyp a nasadenie použiteľného plánovacieho nástroja."],
    technologies:["Power BI","Excel","Power Query","Planning","Operations"], outcome:"Plánovanie bolo prenesené do nástroja, ktorý umožňuje rýchlejšie reagovať na aktuálnu spotrebu liniek a dostupnosť obalov."
  },
  {
    name:"VEDOS", tag:"Logistics · Planning · Workflow", domain:"vedos.sk", website:"https://www.vedos.sk/",
    title:"Logistika navážania paliet a plánovanie prebaľovacej linky",
    summary:"Plánovanie logistického toku paliet, kapacity a prevádzky prebaľovacej linky.",
    challenge:"Zvýšiť prehľad nad logistickým tokom a plánovaním linky tak, aby prevádzka mala jasný pohľad na potrebu paliet a kapacitu.",
    solution:["Model logistického toku navážania paliet.","Plánovanie kapacity a vyťaženia prebaľovacej linky.","Prehľad prevádzkových údajov pre operatívne rozhodovanie."],
    technologies:["Logistics","Planning","Data","Workflow"], outcome:"Vznikol ucelený pohľad na logistiku a plánovanie linky, ktorý podporuje operatívne rozhodovanie."
  },
  {
    name:"BETONOVEPLOTY.eu", tag:"Web · UX · Deployment", domain:"betonoveploty.eu", website:"https://betonoveploty.eu/",
    title:"Kompletné webové riešenie a produkčné nasadenie",
    summary:"Kompletná webová prezentácia, štruktúra produktov, UX, formuláre a technické nasadenie.",
    challenge:"Vytvoriť moderný web, ktorý prehľadne prezentuje široký sortiment a zároveň podporuje získavanie dopytov.",
    solution:["Návrh informačnej architektúry a používateľského rozhrania.","Produktové kategórie a prezentačné stránky.","Kontaktné a dopytové formuláre.","Technické nastavenie a produkčné nasadenie."],
    technologies:["Web","UX/UI","Next.js","SEO","Deployment"], outcome:"Výsledkom je moderná webová prezentácia pripravená na obchodné dopyty a ďalší rozvoj."
  },
  {
    name:"TVOJBYT.sk", tag:"Flutter · Mobile · Custom App", domain:"tvojbyt.sk", website:"https://tvojbyt.sk/",
    title:"Flutter aplikácia na mieru",
    summary:"Mobilná aplikácia navrhnutá ako multiplatformové riešenie s priestorom pre ďalšie API integrácie.",
    challenge:"Pripraviť mobilný produkt, ktorý dokáže rozšíriť existujúci online predaj o samostatný aplikačný kanál.",
    solution:["Návrh používateľských tokov aplikácie.","Multiplatformový vývoj vo Flutteri.","Pripravenosť na napojenie API a dátových zdrojov.","Architektúra vhodná pre ďalší rozvoj Android/iOS."],
    technologies:["Flutter","Dart","Android","iOS","API"], outcome:"Vznikol základ aplikácie na mieru s multiplatformovou architektúrou a možnosťou ďalšieho rozšírenia."
  },
  {
    name:"H + EKO", tag:"Ecoray · Power Query · Legacy Integration", domain:"", website:"https://www.isoh.gov.sk/uvod/registre/register-spracovatelov.html", publicLabel:"Firemný profil",
    title:"Prepojenie starého systému Ecoray s automatickým dátovým tokom",
    summary:"Napojenie na existujúci systém Ecoray, databázu a automatizované Power Query spracovanie.",
    challenge:"Sprístupniť dáta zo staršieho systému bez potreby ručného exportovania a prepisovania údajov.",
    solution:["Analýza existujúceho systému Ecoray a databázy.","Napojenie na dostupné dátové zdroje.","Automatické načítanie a transformácia cez Power Query.","Príprava dát pre ďalší reporting a analytiku."],
    technologies:["Ecoray","MS Access","Power Query","Excel","Legacy Integration"], outcome:"Starší systém bol zapojený do automatizovaného dátového toku, čím sa znížil podiel manuálnej práce pri príprave dát."
  },
  {
    name:"DOBROTKA.online", tag:"Web · Deployment · Digital", domain:"dobrotka.site", website:"https://www.dobrotka.site/",
    title:"Kompletné nastavenie webovej stránky",
    summary:"Webové riešenie od štruktúry a dizajnu cez technickú konfiguráciu až po nasadenie.",
    challenge:"Pripraviť jednoduchú, zrozumiteľnú a prevádzkovo použiteľnú online prezentáciu pre gastro prevádzku.",
    solution:["Štruktúra obsahu a používateľský tok.","Responzívny webový dizajn.","Technická konfigurácia a publikovanie.","Príprava obsahu na každodenné používanie."],
    technologies:["Web","Responsive UI","Deployment","Content"], outcome:"Vznikla kompaktná webová prezentácia pripravená na bežnú prevádzku a komunikáciu so zákazníkmi."
  },
  {
    name:"QL INDUSTRIAL SERVICES", tag:"Workforce · KPI · Hungary", domain:"", website:"",
    title:"Kumulatívne plánovanie potreby pracovníkov a KPI monitoring",
    summary:"Sledovanie potreby pracovníkov, KPI v Maďarsku a reporting pre hlavného partnera.",
    challenge:"Vytvoriť jasný pohľad na aktuálnu a budúcu potrebu pracovníkov naprieč prevádzkou a súčasne sledovať KPI voči hlavnému partnerovi.",
    solution:["Kumulatívny model potreby pracovníkov.","KPI monitoring pre prevádzku v Maďarsku.","Prehľad kapacity, plnenia a operatívnych požiadaviek.","Reporting pripravený pre komunikáciu s hlavným partnerom."],
    technologies:["Power BI","KPI","Workforce Planning","Operations"], outcome:"Riešenie poskytuje spoločný pohľad na personálnu kapacitu a výkonové ukazovatele pre operatívne riadenie."
  },
  {
    name:"ARBOPARK", tag:"Power BI · MSSQL · Data Integration", domain:"", website:"",
    title:"Power BI reporting priamo nad Microsoft SQL Server",
    summary:"Priame prepojenie Power BI s MSSQL, dátový model a analytické výstupy.",
    challenge:"Nahradiť fragmentované dátové pohľady jedným reportovacím riešením priamo nad databázou.",
    solution:["Napojenie Power BI na Microsoft SQL Server.","Príprava dátových zdrojov a modelu.","Návrh analytických pohľadov a KPI.","Nastavenie obnovovania a ďalšej rozšíriteľnosti reportingu."],
    technologies:["Power BI","Microsoft SQL Server","SQL","Data Modeling"], outcome:"Vznikla dátová vrstva a reporting priamo nad databázou, pripravený na ďalšie rozširovanie."
  }
];

const labels:any={
  sk:{k:"REFERENCIE & PRÍPADOVÉ ŠTÚDIE",h:"Riešenia postavené na reálnych procesoch.",p:"Vybrané realizácie naprieč výrobou, logistikou, BI, webom a mobilnými aplikáciami.",study:"Prípadová štúdia",web:"Web stránka",close:"Zavrieť",challenge:"Výzva",solution:"Riešenie",tech:"Technológie",outcome:"Výsledok",private:"Interné riešenie"},
  cs:{k:"REFERENCE & PŘÍPADOVÉ STUDIE",h:"Řešení postavená na reálných procesech.",p:"Vybrané realizace napříč výrobou, logistikou, BI, webem a mobilními aplikacemi.",study:"Případová studie",web:"Web",close:"Zavřít",challenge:"Výzva",solution:"Řešení",tech:"Technologie",outcome:"Výsledek",private:"Interní řešení"},
  en:{k:"REFERENCES & CASE STUDIES",h:"Solutions built around real processes.",p:"Selected work across manufacturing, logistics, BI, web and mobile applications.",study:"Case study",web:"Website",close:"Close",challenge:"Challenge",solution:"Solution",tech:"Technology",outcome:"Outcome",private:"Internal solution"},
  de:{k:"REFERENZEN & CASE STUDIES",h:"Lösungen auf Basis realer Prozesse.",p:"Ausgewählte Projekte aus Produktion, Logistik, BI, Web und mobilen Anwendungen.",study:"Case Study",web:"Website",close:"Schließen",challenge:"Herausforderung",solution:"Lösung",tech:"Technologien",outcome:"Ergebnis",private:"Interne Lösung"},
  pl:{k:"REFERENCJE & CASE STUDIES",h:"Rozwiązania oparte na realnych procesach.",p:"Wybrane realizacje z produkcji, logistyki, BI, webu i aplikacji mobilnych.",study:"Case study",web:"Strona",close:"Zamknij",challenge:"Wyzwanie",solution:"Rozwiązanie",tech:"Technologie",outcome:"Rezultat",private:"Rozwiązanie wewnętrzne"},
  es:{k:"REFERENCIAS & CASOS DE ESTUDIO",h:"Soluciones basadas en procesos reales.",p:"Proyectos seleccionados en fabricación, logística, BI, web y aplicaciones móviles.",study:"Caso de estudio",web:"Web",close:"Cerrar",challenge:"Reto",solution:"Solución",tech:"Tecnologías",outcome:"Resultado",private:"Solución interna"}
};

export default function CaseStudies(){
  const {lang}=useLanguage();
  const t=labels[lang];
  const [selected,setSelected]=useState<Study|null>(null);
  useEffect(()=>{if(!selected)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setSelected(null)};document.body.style.overflow="hidden";window.addEventListener("keydown",onKey);return()=>{document.body.style.overflow="";window.removeEventListener("keydown",onKey)}},[selected]);

  return <section className="section references-section" id="referencie">
    <div className="wrap">
      <div className="section-heading references-heading"><div><div className="eyebrow dark"><span/>{t.k}</div><h2>{t.h}</h2></div><p>{t.p}</p></div>
      <div className="reference-logo-grid">
        {studies.map((s,i)=><article className={`reference-company-card ${i===0?"featured":""}`} key={s.name}>
          <div className="reference-company-head">
            <div className="reference-logo-wrap">
              {s.domain?<img src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=128`} alt="" className="reference-logo"/>:null}
              <span className="reference-monogram">{s.name.replace(/[^A-Za-z0-9+]/g,"").slice(0,3).toUpperCase()}</span>
            </div>
            <div><strong>{s.name}</strong><small>{s.tag}</small></div>
          </div>
          <h3>{s.title}</h3><p>{s.summary}</p>
          <div className="reference-card-actions">
            <button type="button" className="case-study-button" onClick={()=>setSelected(s)}>{t.study}<span>↗</span></button>
            {s.website?<a className="reference-web-link" href={s.website} target="_blank" rel="noreferrer">{s.publicLabel||t.web}<span>↗</span></a>:<span className="reference-private">{t.private}</span>}
          </div>
        </article>)}
      </div>
    </div>

    {selected?<div className="case-modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.currentTarget===e.target)setSelected(null)}}>
      <article className="case-modal" role="dialog" aria-modal="true" aria-label={selected.name}>
        <button className="case-modal-close" type="button" onClick={()=>setSelected(null)} aria-label={t.close}>×</button>
        <div className="case-modal-brand">
          <div className="reference-logo-wrap large">{selected.domain?<img src={`https://www.google.com/s2/favicons?domain=${selected.domain}&sz=128`} alt="" className="reference-logo"/>:null}<span className="reference-monogram">{selected.name.replace(/[^A-Za-z0-9+]/g,"").slice(0,3).toUpperCase()}</span></div>
          <div><span>{selected.tag}</span><h2>{selected.name}</h2></div>
        </div>
        <h3 className="case-modal-title">{selected.title}</h3>
        <div className="case-modal-grid">
          <section><small>{t.challenge}</small><p>{selected.challenge}</p></section>
          <section><small>{t.solution}</small><ul>{selected.solution.map(x=><li key={x}>{x}</li>)}</ul></section>
          <section><small>{t.tech}</small><div className="case-tech-list">{selected.technologies.map(x=><span key={x}>{x}</span>)}</div></section>
          <section><small>{t.outcome}</small><p>{selected.outcome}</p></section>
        </div>
        <div className="case-modal-footer">
          {selected.website?<a href={selected.website} target="_blank" rel="noreferrer" className="button button-primary">{selected.publicLabel||t.web} ↗</a>:null}
          <button type="button" className="button case-close-button" onClick={()=>setSelected(null)}>{t.close}</button>
        </div>
      </article>
    </div>:null}
  </section>;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Lang, useLanguage } from "@/components/LanguageProvider";

const navLabels = {
  sk: ["Úvod","Služby","Referencie","Kalkulačka","Technológie","Riešenia","Spolupráca","Architektúra","Kontakt"],
  cs: ["Úvod","Služby","Reference","Kalkulačka","Technologie","Řešení","Spolupráce","Architektura","Kontakt"],
  en: ["Home","Services","References","Estimator","Technology","Solutions","Process","Architecture","Contact"],
  de: ["Start","Leistungen","Referenzen","Kalkulator","Technologie","Lösungen","Zusammenarbeit","Architektur","Kontakt"],
  pl: ["Start","Usługi","Referencje","Kalkulator","Technologie","Rozwiązania","Współpraca","Architektura","Kontakt"],
  es: ["Inicio","Servicios","Referencias","Calculadora","Tecnología","Soluciones","Proceso","Arquitectura","Contacto"],
};
const ids = ["top","sluzby","referencie","kalkulacka","technologie","riesenia","proces","architektura","kontakt"];
const langs: {code:Lang; label:string}[] = [
  {code:"sk",label:"SK"},{code:"cs",label:"CZ"},{code:"en",label:"EN"},{code:"de",label:"DE"},{code:"pl",label:"PL"},{code:"es",label:"ES"}
];

function ArrowIcon({ direction = "down" }: { direction?: "up" | "down" | "right" }) {
  const rotate = direction === "up" ? "rotate(180 12 12)" : direction === "right" ? "rotate(-90 12 12)" : undefined;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15M6.5 13.5 12 19l5.5-5.5" transform={rotate} /></svg>;
}
function MailIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6"/></svg>}

export default function SiteNavigation(){
  const {lang,setLang}=useLanguage();
  const [activeId,setActiveId]=useState("top");
  const [scrolled,setScrolled]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [hydrated,setHydrated]=useState(false);
  const labels=navLabels[lang];
  const sections=useMemo(()=>ids.map((id,i)=>({id,label:labels[i]})),[labels]);
  const email="tutka.peter@gmail.com";
  const activeIndex=Math.max(0,sections.findIndex(s=>s.id===activeId));

  const goTo=(id:string)=>{
    const target=document.getElementById(id); if(!target)return;
    const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"start"});
    window.history.replaceState(null,"",id==="top"?window.location.pathname:`#${id}`);
    setMobileOpen(false);
  };
  const move=(step:number)=>{const next=Math.min(sections.length-1,Math.max(0,activeIndex+step));goTo(sections[next].id)};

  useEffect(()=>{setHydrated(true)},[]);
  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>24); onScroll(); window.addEventListener("scroll",onScroll,{passive:true});
    const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible?.target?.id)setActiveId(visible.target.id)},{rootMargin:"-24% 0px -54% 0px",threshold:[.05,.15,.3,.55]});
    sections.forEach(({id})=>{const el=document.getElementById(id);if(el)observer.observe(el)});
    const onKeyDown=(event:KeyboardEvent)=>{const target=event.target as HTMLElement|null;if(target&&["INPUT","TEXTAREA","SELECT"].includes(target.tagName))return;if(event.altKey||event.ctrlKey||event.metaKey)return;if(["ArrowDown","PageDown"].includes(event.key)){event.preventDefault();move(1)}else if(["ArrowUp","PageUp"].includes(event.key)){event.preventDefault();move(-1)}else if(event.key==="Home"){event.preventDefault();goTo("top")}else if(event.key==="End"){event.preventDefault();goTo("kontakt")}};
    window.addEventListener("keydown",onKeyDown); return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("keydown",onKeyDown);observer.disconnect()}
  },[activeIndex,sections]);

  const quoteLabel={sk:"Cenová ponuka",cs:"Cenová nabídka",en:"Get a quote",de:"Angebot",pl:"Wycena",es:"Presupuesto"}[lang];
  return <>
    <header className={`site-header premium-header ${scrolled?"is-scrolled":""}`}>
      <button className="brand brand-button" type="button" onClick={()=>goTo("top")} aria-label="TUTKA"><span className="brand-mark">T</span><span className="brand-copy"><strong>TUTKA</strong><small>DIGITAL · AI · DATA</small></span></button>
      <nav className="desktop-nav" aria-label="Navigation">{sections.filter(s=>["sluzby","referencie","kalkulacka","technologie","kontakt"].includes(s.id)).map(s=><button type="button" key={s.id} className={activeId===s.id?"active":""} onClick={()=>goTo(s.id)}>{s.label}</button>)}</nav>
      <div className="header-actions">
        <div className="language-switcher" aria-label="Language">{langs.map(item=><button type="button" key={item.code} className={lang===item.code?"active":""} onClick={()=>setLang(item.code)}>{item.label}</button>)}</div>
        <a className="header-email" href={`mailto:${email}`}><MailIcon/><span>{email}</span></a>
        <button type="button" className="nav-cta" onClick={()=>goTo("kontakt")}>{quoteLabel}<ArrowIcon direction="right"/></button>
        <button type="button" className={`menu-toggle ${mobileOpen?"open":""}`} onClick={()=>setMobileOpen(v=>!v)} aria-expanded={mobileOpen} aria-label="Menu"><span/><span/></button>
      </div>
      <div className={`mobile-menu ${mobileOpen?"open":""}`}>
        <div className="mobile-languages">{langs.map(item=><button type="button" key={item.code} className={lang===item.code?"active":""} onClick={()=>setLang(item.code)}>{item.label}</button>)}</div>
        {sections.map((s,i)=><button type="button" key={s.id} onClick={()=>goTo(s.id)} className={activeId===s.id?"active":""}><span>{String(i+1).padStart(2,"0")}</span>{s.label}<ArrowIcon direction="right"/></button>)}
        <a href={`mailto:${email}`}><MailIcon/>{email}</a>
      </div>
    </header>
    <aside className="section-navigator" aria-label="Section navigation">
      <button type="button" className="nav-arrow" onClick={()=>move(-1)} disabled={hydrated&&activeIndex===0} aria-label="Previous section"><ArrowIcon direction="up"/></button>
      <div className="nav-progress"><span className="nav-progress-label">{String(activeIndex+1).padStart(2,"0")}</span><div className="nav-dots">{sections.map(s=><button type="button" key={s.id} className={activeId===s.id?"active":""} onClick={()=>goTo(s.id)} aria-label={s.label} title={s.label}/>)}</div><span className="nav-progress-label muted">{String(sections.length).padStart(2,"0")}</span></div>
      <button type="button" className="nav-arrow" onClick={()=>move(1)} disabled={hydrated&&activeIndex===sections.length-1} aria-label="Next section"><ArrowIcon direction="down"/></button>
    </aside>
  </>;
}

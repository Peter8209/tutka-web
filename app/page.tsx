"use client";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import PriceCalculator from "@/components/PriceCalculator";
import { useLanguage } from "@/components/LanguageProvider";
import { LegalFormNotice } from "@/components/legal/LegalPage";
import { normalizeLegalLang } from "@/components/legal/legal-shared";
import { copy, tech, homeLang } from "@/lib/home-copy";
import { company } from "@/lib/company";
import { IconArrow } from "@/components/HomeIcons";
export default function Home(){const {lang:currentLanguage}=useLanguage(); const lang=homeLang(currentLanguage); const legalLang=normalizeLegalLang(lang); const t=copy[lang]; return <main id="main-content" className="tutka-home rev09-home"><Header/><Hero lang={lang}/><Services lang={lang}/><Portfolio/>
  <section className="section section-ink" id="technologie"><div className="wrap"><div className="section-heading light"><div><div className="eyebrow"><span/>{t.stack}</div><h2>{t.stackH}</h2></div><p>{t.stackP}</p></div><div className="tech-grid">{tech.map(([cat,...items])=><div className="tech-card" key={cat}><small>{cat}</small><div>{items.map(x=><span key={x}>{x}</span>)}</div></div>)}</div></div></section>
  <section className="section wrap split-section" id="riesenia"><div className="split-copy"><div className="eyebrow dark"><span/>{t.tasks}</div><h2>{t.tasksH}</h2><p>{t.tasksP}</p><a className="text-link" href="#kontakt">{t.case}<IconArrow/></a></div><div className="check-grid">{t.use.map((x:string)=><div className="check-item" key={x}><span>✓</span>{x}</div>)}</div></section>
  <section className="section process-section" id="proces"><div className="wrap"><div className="section-heading"><div><div className="eyebrow dark"><span/>{t.process}</div><h2>{t.processH}</h2></div><p>{t.processP}</p></div><div className="process-grid">{t.steps.map((x,i)=><article className="process-card" key={i}><span>{String(i+1).padStart(2,"0")}</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></div></section>
  <section className="section wrap architecture-section" id="architektura"><div className="architecture-copy"><div className="eyebrow dark"><span/>{t.arch}</div><h2>{t.archH}</h2><p>{t.archP}</p></div><div className="architecture-flow"><div className="arch-node"><small>{t.input}</small><b>Web • ERP • API • {t.docs}</b></div><span>→</span><div className="arch-node active"><small>{t.logic}</small><b>Backend • SQL • Python</b></div><span>→</span><div className="arch-node"><small>{t.ai}</small><b>LLM • RAG • AI Agent</b></div><span>→</span><div className="arch-node"><small>{t.output}</small><b>Web • BI • Android • iOS</b></div></div></section>
  <div className="tutka-calculator-region"><PriceCalculator/><div className="wrap tutka-calculator-notice"><LegalFormNotice lang={legalLang}/></div></div>
  <section className="contact-section" id="kontakt"><div className="wrap contact-layout"><div className="contact-copy"><div className="eyebrow"><span/>{t.contact}</div><h2>{t.contactH}</h2><p>{t.contactP}</p><div className="quote-promise"><strong>{t.promise}</strong><span>{t.promise2}</span></div><div className="contact-note"><strong><a href={`mailto:${company.email}`}>{company.email}</a></strong><span>Web • AI • AI Agents • Bots • Automation • Data • Mobile • Custom Software</span></div></div><div className="tutka-contact-fields"><ContactForm/><LegalFormNotice lang={legalLang}/></div></div></section>
 </main>
}

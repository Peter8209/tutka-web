import Image from "next/image";
import { baseServices, serviceTitles, portraitCopy, copy, type HomeLang } from "@/lib/home-copy";
import { IconArrow, IconChart, IconData, IconCode } from "./HomeIcons";
export default function Hero({lang}:{lang:HomeLang}) { const t=copy[lang]; const portrait=portraitCopy[lang]; return <>
  <section className="hero" id="top"><div className="hero-glow hero-glow-one"/><div className="hero-glow hero-glow-two"/><div className="hero-content wrap"><div className="hero-copy"><div className="eyebrow"><span/>{t.heroK}</div><h1><span>{t.hero1}</span><span>{t.hero2} <em>{t.heroEm}</em></span></h1><p className="hero-lead">{t.lead}</p><div className="hero-actions"><a className="button button-primary" href="#kontakt">{t.quote}<IconArrow/></a><a className="button button-secondary" href="#sluzby">{t.see}</a></div><div className="hero-pills">{["Web / Next.js","AI Agents","Chatbots","Python","Kotlin","Power BI","SQL","Flutter"].map(x=><span key={x}>{x}</span>)}</div></div>
  <div className="hero-visual">
    <a className="hero-profile-card" href="#kontakt" aria-label={`${portrait.cta} – Ing. Peter Tutka`}>
      <span className="hero-profile-photo">
        <Image src="/images/peter-tutka.webp" alt={portrait.alt} width={277} height={592}
          sizes="(max-width: 480px) 100px, 124px" priority />
      </span>
      <span className="hero-profile-information">
        <span className="hero-profile-eyebrow"><span className="hero-profile-dot"/>{portrait.eyebrow}</span>
        <strong>Ing. Peter Tutka</strong>
        <span className="hero-profile-position">{portrait.position}</span>
        <span className="hero-profile-link">{portrait.cta}<IconArrow/></span>
      </span>
    </a>
    <div className="rev09-capabilities"><div className="rev09-cap-heading">WEB / AI / DATA</div>{[5,6,0,3].map((i,index)=><a href="#sluzby" key={i}><span className="rev09-cap-index">0{index+1}</span><span><strong>{serviceTitles[lang][i]}</strong><small>{baseServices[i][1].slice(0,3).join(" · ")}</small></span><IconArrow/></a>)}</div></div></div></section>
  <section className="trust-strip"><div className="wrap trust-grid">{t.trust.map((x,i)=><div key={x[0]}>{i===0?<IconChart/>:i===1?<IconData/>:<IconCode/>}<span><strong>{x[0]}</strong><small>{x[1]}</small></span></div>)}</div></section>
</>;
}

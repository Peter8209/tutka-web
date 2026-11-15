'use client';
import {createContext,useContext,useEffect,useState,useId,useCallback,useRef, type ReactNode} from 'react';
import {legalConfig as c} from './legal-config';
import {ui,legalHref,type LegalLang} from './legal-shared';
export const CONSENT_KEY='tutka.consent.v2';
const TTL=c.consentDays*86400000;
export type Choice={version:number;at:number;analytics:boolean;marketing:boolean};
export type Category='analytics'|'marketing';
const enabled={analytics:c.analyticsEnabled as boolean,marketing:c.marketingEnabled as boolean};
function read():Choice|null {try {const x=JSON.parse(localStorage.getItem(CONSENT_KEY)||'null');return x && x.version===c.consentVersion && Number.isFinite(x.at) && x.at<=Date.now() && Date.now()-x.at<TTL && typeof x.analytics==='boolean' && typeof x.marketing==='boolean'?x:null;}catch{return null;}}
const Context=createContext<{choice:Choice|null;open:()=>void}>({choice:null,open:()=>{}});
export function useCookieConsent(){return useContext(Context);}
export function ConsentGate({category,children}:{category:Category;children:ReactNode}){const {choice}=useCookieConsent();return enabled[category]&&choice?.[category]?<>{children}</>:null;}
export function CookieSettingsButton({lang='sk'}:{lang?:LegalLang}){const {open}=useCookieConsent();return <button type="button" className="tl-text-button" onClick={open}>{ui[lang].settings}</button>;}
export function CookieConsentProvider({children,lang='sk'}:{children:ReactNode;lang?:LegalLang}){
 const t=ui[lang];const [ready,setReady]=useState(false);const [choice,setChoice]=useState<Choice|null>(null);const [settings,setSettings]=useState(false);const [a,setA]=useState(false);const [m,setM]=useState(false);const heading=useId();const panel=useRef<HTMLElement>(null);const prevFocus=useRef<HTMLElement|null>(null);
 const open=useCallback(()=>{prevFocus.current=document.activeElement as HTMLElement|null;setA(!!choice?.analytics&&enabled.analytics);setM(!!choice?.marketing&&enabled.marketing);setSettings(true);},[choice]);
 useEffect(()=>{setChoice(read());setReady(true);const sync=(e:StorageEvent)=>{if(e.key===CONSENT_KEY||e.key===null)setChoice(read());};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 useEffect(()=>{if(!choice)return;const check=()=>{if(Date.now()>=choice.at+TTL){setChoice(null);try{localStorage.removeItem(CONSENT_KEY);}catch{}}};const timer=window.setInterval(check,60000);window.addEventListener('focus',check);return()=>{window.clearInterval(timer);window.removeEventListener('focus',check);};},[choice]);
 useEffect(()=>{if(settings)panel.current?.focus();},[settings]);
 function close(){setSettings(false);prevFocus.current?.focus();}
 function save(analytics:boolean,marketing:boolean){const next={version:c.consentVersion,at:Date.now(),analytics:enabled.analytics&&analytics,marketing:enabled.marketing&&marketing};const revoke=!!((choice?.analytics&&!next.analytics)||(choice?.marketing&&!next.marketing));try{localStorage.setItem(CONSENT_KEY,JSON.stringify(next));}catch{}setChoice(next);close();window.dispatchEvent(new CustomEvent('tutka:consent-change',{detail:next})); // Integrations must stop requests and remove their own optional cookies/storage on revocation.
 if(revoke)window.dispatchEvent(new CustomEvent('tutka:consent-revoked',{detail:{previous:choice,current:next}}));}
 const optional=enabled.analytics||enabled.marketing;
 return <Context.Provider value={{choice,open}}>{children}{ready&&(!choice||settings)&&<section className="tl-cookie" role="region" aria-labelledby={heading} tabIndex={-1} ref={panel} onKeyDown={e=>{if(e.key==='Escape'&&settings)close();}}>
 <div className="tl-cookie-top"><div><span className="tl-eyebrow">TUTKA · PRIVACY</span><h2 id={heading}>{settings?t.settings:t.title}</h2></div>{settings&&<button type="button" className="tl-close" aria-label={t.close} onClick={close}>×</button>}</div><p>{t.intro}</p>{!optional&&<p>{t.noTools}</p>}
 {settings&&<div className="tl-cookie-options"><div><strong>{t.required}</strong><span>{t.always}</span></div><label><span><strong>{t.analytics}</strong><small>{enabled.analytics?t.analyticsDesc:t.disabled}</small></span><input type="checkbox" checked={a} disabled={!enabled.analytics} onChange={e=>setA(e.target.checked)}/></label><label><span><strong>{t.marketing}</strong><small>{enabled.marketing?t.marketingDesc:t.disabled}</small></span><input type="checkbox" checked={m} disabled={!enabled.marketing} onChange={e=>setM(e.target.checked)}/></label></div>}
 <div className="tl-cookie-actions">{optional?<><button type="button" onClick={()=>save(true,true)}>{t.accept}</button><button type="button" onClick={()=>save(false,false)}>{t.reject}</button></>:<button type="button" onClick={()=>save(false,false)}>{t.confirm}</button>}{settings?<button type="button" onClick={()=>save(a,m)}>{t.save}</button>:<button type="button" onClick={open}>{t.settings}</button>}</div><a className="tl-cookie-policy" href={legalHref('cookies',lang)}>{t.cookiesTitle}</a></section>}</Context.Provider>;
}

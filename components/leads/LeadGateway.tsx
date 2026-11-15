'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Script from 'next/script';
import { normalizePhone } from './phone';
import { leadCopy, type LeadLang } from './lead-copy';

type Turnstile = {render:(element:HTMLElement,options:Record<string,unknown>)=>string;reset:(id:string)=>void;remove:(id:string)=>void};
const api = () => (window as Window & {turnstile?:Turnstile}).turnstile;
const MODE = process.env.NEXT_PUBLIC_LEAD_MODE || 'required';
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const KEY = 'tutka.lead.entry.v3';
const SKIP = 'tutka.lead.skip.v3';
const TTL = 30*24*60*60*1000;
function hasEntry(){try{const x=Number(localStorage.getItem(KEY));return x> Date.now() && x <= Date.now()+TTL;}catch{return false;}}
function hasSkip(){try{return sessionStorage.getItem(SKIP)==='1';}catch{return false;}}
export default function LeadGateway({lang,exempt,children}:{lang:LeadLang;exempt:boolean;children:ReactNode}) {
  const t=leadCopy[lang];const required=MODE==='required';
  const [dismissed,setDismissed]=useState(false);
  const [ready,setReady]=useState(false);
  const [entry,setEntry]=useState(false);
  const [skipped,setSkipped]=useState(false);
  const visible=(!exempt && !dismissed && ['optional','required'].includes(MODE) && !entry && (required || (ready && !skipped)));
  const [email,setEmail]=useState('');const [phone,setPhone]=useState('');const [contact,setContact]=useState(false);
  const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const [token,setToken]=useState('');const [scriptReady,setScriptReady]=useState(false);const [scriptFailed,setScriptFailed]=useState(false);
  const [challengeStarted,setChallengeStarted]=useState(false);
  const dialog=useRef<HTMLElement>(null);const target=useRef<HTMLDivElement>(null);const widget=useRef<string|null>(null);const inFlight=useRef(false);
  useEffect(()=>{const sync=()=>{setEntry(hasEntry());setSkipped(hasSkip());setReady(true);};sync();window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
  useEffect(()=>{if(!visible)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.focus();return()=>{document.body.style.overflow=old;};},[visible]);
  useEffect(()=>{if(!SITE_KEY||!visible||!challengeStarted||!scriptReady||!target.current||!api())return;
    const ts=api()!;let id:string|undefined;
    try{id=ts.render(target.current,{sitekey:SITE_KEY,action:'tutka-lead',theme:'dark',size:'flexible',language:lang==='cz'?'cs':lang,callback:(value:string)=>{setToken(value);setError('');},'expired-callback':()=>setToken(''),'error-callback':()=>{setToken('');setError(t.challenge);}});widget.current=id;}
    catch{setError(t.challenge);}
    return()=>{if(id){try{ts.remove(id);}catch{}}widget.current=null;setToken('');};
  },[visible,challengeStarted,scriptReady,lang,t.challenge]);
  function finish(submitted:boolean){if(submitted){try{localStorage.setItem(KEY,String(Date.now()+TTL));}catch{}}else{try{sessionStorage.setItem(SKIP,'1');}catch{}}setDismissed(true);setEmail('');setPhone('');setContact(false);setToken('');}
  function resetChallenge(){setToken('');if(widget.current!==null){try{api()?.reset(widget.current);}catch{}}}
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(inFlight.current||!SITE_KEY)return;const normalizedPhone=normalizePhone(phone);if(!normalizedPhone){setError(t.phoneError);document.getElementById('tutka-lead-phone')?.focus();return;}if(!token){setChallengeStarted(true);setError(t.challenge);return;}inFlight.current=true;setBusy(true);setError('');try{const res=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),phone:normalizedPhone,lang,contact,token}),signal:AbortSignal.timeout(65000)});if(!res.ok||!(await res.json()).ok)throw new Error('submit');finish(true);}catch{setError(t.error);resetChallenge();}finally{inFlight.current=false;setBusy(false);}}
  return <>
  <div hidden={visible} inert={visible} className="tutka-lead-site">{children}</div>
  {visible&&<div className="tutka-lead-overlay" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();if(!required&&!busy)finish(false);}}}>
  <section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" className="tutka-lead-dialog" aria-labelledby="tutka-lead-title">
    <div className="tutka-lead-brand"><span className="tutka-lead-mark" aria-hidden="true">T</span><span><b>TUTKA</b><small>DIGITAL · AI · DATA</small></span></div>
    <h2 id="tutka-lead-title">{t.title}</h2><p>{required?t.required:t.optional}</p>
    <form method="post" action="/api/leads" onSubmit={submit}>
      <label htmlFor="tutka-lead-email">{t.label}</label>
      <input id="tutka-lead-email" type="email" name="email" autoComplete="email" inputMode="email" placeholder="name@example.com" required maxLength={254} value={email} disabled={busy} onChange={e=>{setEmail(e.target.value);if(e.target.validity.valid&&e.target.value&&normalizePhone(phone))setChallengeStarted(true);}}/>
      <label htmlFor="tutka-lead-phone">{t.phoneLabel}</label>
      <input id="tutka-lead-phone" type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder={t.phonePlaceholder} aria-describedby="tutka-lead-phone-hint" required maxLength={48} value={phone} disabled={busy} onChange={e=>{setPhone(e.target.value);if(normalizePhone(e.target.value)&&email)setChallengeStarted(true);}}/>
      <p id="tutka-lead-phone-hint" className="tutka-lead-field-hint">{t.phoneHint} {t.fieldsRequired}</p>
      {required&&<label className="tutka-lead-check"><input type="checkbox" checked={contact} disabled={busy} onChange={e=>setContact(e.target.checked)}/><span>{t.contact}</span></label>}
      {SITE_KEY&&challengeStarted&&<><Script id="tutka-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={()=>{setScriptReady(true);setScriptFailed(false);}} onError={()=>{setScriptFailed(true);setError(t.challenge);}}/><div className="tutka-lead-challenge" ref={target}/>{scriptFailed&&<button type="button" className="tutka-lead-skip" onClick={()=>window.location.reload()}>{t.retry}</button>}</>}
      <p className="tutka-lead-notice">{t.note} <a href={`/ochrana-osobnych-udajov?lang=${lang}`}>{t.privacy}</a>.</p>
      {!SITE_KEY&&<p className="tutka-lead-error" role="alert">{t.configError}</p>}
      {error&&<p className="tutka-lead-error" role="alert">{error}</p>}
      <button className="tutka-lead-submit" disabled={busy||!SITE_KEY} type="submit">{busy?t.wait:t.submit}<span aria-hidden="true">→</span></button>
      {!required&&<button className="tutka-lead-skip" type="button" disabled={busy} onClick={()=>finish(false)}>{t.skip}</button>}
    </form>
  </section></div>}</>;
}

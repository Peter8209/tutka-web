'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { normalizePhone } from './phone';
import { leadCopy, leadLanguages, toWebsiteLanguage, type LeadLang } from './lead-copy';

import type { LeadMode } from "../../lib/lead-mode";
const KEY = 'tutka.lead.entry.v3';
const SKIP = 'tutka.lead.skip.v3';
const TTL = 30*24*60*60*1000;
function hasEntry(){try{const x=Number(localStorage.getItem(KEY));return x> Date.now() && x <= Date.now()+TTL;}catch{return false;}}
function hasSkip(){try{return sessionStorage.getItem(SKIP)==='1';}catch{return false;}}
export default function LeadGateway({mode,lang,onLanguageChange,exempt,children}:{mode:LeadMode;lang:LeadLang;onLanguageChange:(lang:LeadLang)=>void;exempt:boolean;children:ReactNode}) {
  const t=leadCopy[lang];const required=mode==='required';
  const [dismissed,setDismissed]=useState(false);
  const [ready,setReady]=useState(false);
  const [entry,setEntry]=useState(false);
  const [skipped,setSkipped]=useState(false);
  const visible=(!exempt && !dismissed && ['optional','required'].includes(mode) && !entry && (required || (ready && !skipped)));
  const [email,setEmail]=useState('');const [phone,setPhone]=useState('');const [contact,setContact]=useState(false);
  const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const [website,setWebsite]=useState('');
  const dialog=useRef<HTMLElement>(null);
  const inFlight=useRef(false);
  useEffect(()=>{const sync=()=>{setEntry(hasEntry());setSkipped(hasSkip());setReady(true);};sync();window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
  useEffect(()=>{if(!visible)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.focus();return()=>{document.body.style.overflow=old;};},[visible]);
  function finish(submitted:boolean) {
    try {
      if(submitted) localStorage.setItem(KEY,String(Date.now()+TTL));
      else sessionStorage.setItem(SKIP,'1');
    } catch { /* Storage restrictions must not prevent entry in this tab. */ }
    setDismissed(true); setEmail(''); setPhone(''); setContact(false); setWebsite('');
  }
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(inFlight.current) return;
    const cleanEmail=email.trim();
    if(cleanEmail.length>254 || !/^[^\s@<>\x00-\x1f\x7f]+@[^\s@<>\x00-\x1f\x7f]+\.[^\s@<>\x00-\x1f\x7f]+$/.test(cleanEmail)) {
      setError(t.emailError); document.getElementById('tutka-lead-email')?.focus(); return;
    }
    const normalizedPhone=normalizePhone(phone);
    if(!normalizedPhone) { setError(t.phoneError); document.getElementById('tutka-lead-phone')?.focus(); return; }
    inFlight.current=true; setBusy(true); setError('');
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(), 55000);
    try {
      const res=await fetch('/api/leads', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email:cleanEmail,phone:normalizedPhone,lang,contact,website}),
        signal:controller.signal, cache:'no-store', credentials:'same-origin',
      });
      const data=await res.json();
      if(!res.ok || data?.ok!==true) { setError(res.status===503 ? t.configError : t.error); return; }
      finish(true);
    } catch { setError(t.error); }
    finally { window.clearTimeout(timeout); inFlight.current=false; setBusy(false); }
  }
  return <>
  <div hidden={visible} inert={visible} className="tutka-lead-site">{children}</div>
  {visible&&<div className="tutka-lead-overlay" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();if(!required&&!busy)finish(false);}}}>
  <section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" lang={toWebsiteLanguage(lang)} className="tutka-lead-dialog" aria-labelledby="tutka-lead-title">
    <div className="tutka-lead-brand"><span className="tutka-lead-mark" aria-hidden="true">T</span><span><b>TUTKA</b><small>DIGITAL · AI · DATA</small></span></div>
    <fieldset className="tutka-lead-languages" disabled={busy}>
      <legend>{t.languageLabel}</legend>
      <div className="tutka-lead-language-grid">
        {leadLanguages.map(item => <button key={item.code} type="button" lang={item.html} aria-pressed={lang===item.code} onClick={()=>{if(lang===item.code)return;setError('');onLanguageChange(item.code);}}><span className="tutka-lead-language-code" aria-hidden="true">{item.short}</span><span>{item.label}</span></button>)}
      </div>
    </fieldset>
    <h2 id="tutka-lead-title">{t.title}</h2><p>{required?t.required:t.optional}</p>
    <form method="post" action="/api/leads" onSubmit={submit} noValidate>
      <label htmlFor="tutka-lead-email">{t.label} <span aria-hidden="true">*</span></label>
      <input id="tutka-lead-email" type="email" name="email" autoComplete="email" inputMode="email" placeholder="name@example.com" required maxLength={254} value={email} disabled={busy} onChange={e=>setEmail(e.target.value)}/>
      <label htmlFor="tutka-lead-phone">{t.phoneLabel} <span aria-hidden="true">*</span></label>
      <input id="tutka-lead-phone" type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder={t.phonePlaceholder} aria-describedby="tutka-lead-phone-hint" required maxLength={48} value={phone} disabled={busy} onChange={e=>setPhone(e.target.value)}/>
      <p id="tutka-lead-phone-hint" className="tutka-lead-field-hint">{t.phoneHint} {t.fieldsRequired}</p>
      {required&&<label className="tutka-lead-check"><input type="checkbox" checked={contact} disabled={busy} onChange={e=>setContact(e.target.checked)}/><span>{t.contact}</span></label>}
      <div aria-hidden="true" style={{position:'absolute',left:'-10000px',width:1,height:1,overflow:'hidden'}}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-label="Website" value={website} onChange={e=>setWebsite(e.target.value)}/>
      </div>
      <p className="tutka-lead-notice">{t.note} <a href={`/ochrana-osobnych-udajov?lang=${lang}`}>{t.privacy}</a>.</p>
      {error&&<p className="tutka-lead-error" role="alert">{error}</p>}
      <button className="tutka-lead-submit" disabled={busy} aria-busy={busy} type="submit">{busy?t.wait:t.submit}<span aria-hidden="true">→</span></button>
      {!required&&<button className="tutka-lead-skip" type="button" disabled={busy} onClick={()=>finish(false)}>{t.skip}</button>}
    </form>
  </section></div>}</>;
}

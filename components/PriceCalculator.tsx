"use client";

import { FormEvent, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Rate = { key:string; sk:string; min:number; max:number };

const rates: Rate[] = [
  {key:"junior",sk:"Administratívna / junior podpora",min:25,max:30},
  {key:"data-support",sk:"Mid-level dátová a procesná podpora",min:30,max:40},
  {key:"bi",sk:"Senior BI / Data Analyst / Power BI Developer",min:40,max:55},
  {key:"process",sk:"Senior IT Process Analyst / Digitalization Consultant",min:45,max:60},
  {key:"fullstack-ai",sk:"Senior Full-stack / AI / API špecialista",min:50,max:70},
  {key:"pm",sk:"Projektový manažér / koordinátor",min:45,max:65},
  {key:"automation",sk:"Automatizácia, elektro, MSR, commissioning",min:36,max:45},
  {key:"training",sk:"Lektoring, školenie, workshop",min:45,max:75},
  {key:"web",sk:"Tvorba webových stránok / firemných webov",min:40,max:60},
  {key:"eshop",sk:"E-shopy a marketplace integrácie",min:50,max:75},
  {key:"saas",sk:"Webové aplikácie / SaaS / zákaznícke portály",min:50,max:80},
  {key:"flutter",sk:"Mobilné aplikácie Android / iOS – Flutter",min:50,max:75},
  {key:"desktop",sk:"Desktopové a interné podnikové aplikácie",min:45,max:70},
  {key:"php",sk:"PHP / Laravel / WordPress / backend",min:45,max:70},
  {key:"js",sk:"JavaScript / TypeScript / React / Next.js / Node.js",min:50,max:80},
  {key:"python",sk:"Python / skriptovanie / automatizácia",min:45,max:75},
  {key:"other-code",sk:"Java / C# / .NET / C / C++ a ostatné programovacie jazyky",min:50,max:85},
  {key:"sql",sk:"SQL / MSSQL / MySQL / PostgreSQL / Oracle databázy",min:45,max:75},
  {key:"excel",sk:"Excel – pokročilé riešenia / VBA / makrá",min:40,max:65},
  {key:"pq",sk:"Power Query / Power Pivot / DAX / dátová automatizácia",min:40,max:65},
  {key:"tableau",sk:"Tableau / Qlik / ostatné BI platformy",min:45,max:70},
  {key:"api",sk:"API integrácie / ETL / systémové prepojenia",min:50,max:80},
  {key:"devops",sk:"Cloud / DevOps / Vercel / Azure / AWS / Docker / Git",min:50,max:85},
  {key:"ai",sk:"AI / LLM / chatboty / RAG / AI automatizácia",min:55,max:90},
  {key:"ml",sk:"Data Science / Machine Learning / analytické modely",min:55,max:90},
  {key:"ux",sk:"UI/UX dizajn / prototypovanie / Figma",min:40,max:65},
  {key:"qa",sk:"QA / testovanie softvéru / UAT",min:35,max:55},
  {key:"cad2d",sk:"CAD – 2D technické výkresy",min:35,max:55},
  {key:"cad3d",sk:"3D CAD modelovanie – strojárstvo / konštrukcie",min:45,max:70},
  {key:"render",sk:"3D vizualizácie / rendery / prezentačné modely",min:45,max:75},
  {key:"design",sk:"Projekčné služby / technické návrhy",min:45,max:75},
  {key:"bom",sk:"Výrobná dokumentácia / BOM / kusovníky / technologické podklady",min:35,max:60},
  {key:"docs",sk:"Technická dokumentácia / manuály / návody",min:35,max:55},
  {key:"architecture",sk:"Softvérová architektúra / IT konzultácie",min:55,max:90},
  {key:"special",sk:"Ostatné programovanie / špecializovaný softvér",min:50,max:90},
];

const tx:any={
 sk:{k:"ONLINE KALKULAČKA",h:"Orientačná cena okamžite.",p:"Výpočet vychádza priamo z aktuálneho cenníka pracovných sadzieb. Zvoľte službu, rozsah a prípadnú urgentnosť. Výsledok vám viem automaticky odoslať e-mailom.",service:"Služba",hours:"Odhadovaný rozsah",hoursUnit:"hodín",urgent:"Expresné / urgentné práce (+50 %)",rate:"Sadzba podľa cenníka",estimate:"Orientačná cena",note:"Výpočet je nezáväzný a nezahŕňa licencie, cloudové služby, cestovné ani externé komponenty. Fixná projektová cena sa potvrdzuje po spresnení zadania.",name:"Meno",email:"E-mail",company:"Firma",brief:"Stručné zadanie",send:"Poslať kalkuláciu e-mailom",sending:"Odosielam…",sent:"Kalkulácia bola odoslaná na e-mail.",error:"Kalkuláciu sa nepodarilo odoslať. Skontrolujte SMTP nastavenie alebo skúste neskôr.",placeholder:"Čo má riešenie robiť? Uveďte hlavné funkcie, integrácie a termín."},
 cs:{k:"ONLINE KALKULAČKA",h:"Orientační cena okamžitě.",p:"Výpočet vychází přímo z aktuálního ceníku pracovních sazeb. Vyberte službu, rozsah a případnou urgentnost. Výsledek lze automaticky odeslat e-mailem.",service:"Služba",hours:"Odhadovaný rozsah",hoursUnit:"hodin",urgent:"Expresní / urgentní práce (+50 %)",rate:"Sazba dle ceníku",estimate:"Orientační cena",note:"Výpočet je nezávazný a nezahrnuje licence, cloudové služby, cestovné ani externí komponenty. Fixní cena se potvrzuje po upřesnění zadání.",name:"Jméno",email:"E-mail",company:"Firma",brief:"Stručné zadání",send:"Poslat kalkulaci e-mailem",sending:"Odesílám…",sent:"Kalkulace byla odeslána e-mailem.",error:"Kalkulaci se nepodařilo odeslat. Zkontrolujte SMTP nastavení.",placeholder:"Co má řešení dělat? Uveďte hlavní funkce, integrace a termín."},
 en:{k:"ONLINE ESTIMATOR",h:"Get an indicative price instantly.",p:"The calculation uses the current published hourly rate card. Select the service, expected effort and whether the work is urgent. The result can be sent to your e-mail automatically.",service:"Service",hours:"Estimated effort",hoursUnit:"hours",urgent:"Express / urgent work (+50%)",rate:"Rate card",estimate:"Indicative price",note:"Non-binding estimate; licences, cloud services, travel and third-party components are priced separately. A fixed project price is confirmed after the scope is clarified.",name:"Name",email:"E-mail",company:"Company",brief:"Project brief",send:"E-mail this estimate",sending:"Sending…",sent:"The estimate was sent by e-mail.",error:"The estimate could not be sent. Please check SMTP configuration or try again later.",placeholder:"What should the solution do? Include key features, integrations and deadline."},
 de:{k:"ONLINE-KALKULATOR",h:"Richtpreis sofort berechnen.",p:"Die Berechnung basiert direkt auf der aktuellen Stundensatzliste. Leistung, Aufwand und Dringlichkeit auswählen; das Ergebnis kann automatisch per E-Mail gesendet werden.",service:"Leistung",hours:"Geschätzter Aufwand",hoursUnit:"Stunden",urgent:"Express / dringend (+50 %)",rate:"Stundensatz",estimate:"Richtpreis",note:"Unverbindlich; Lizenzen, Cloud, Reisekosten und externe Komponenten werden separat kalkuliert. Ein Festpreis wird nach Klärung des Umfangs bestätigt.",name:"Name",email:"E-Mail",company:"Unternehmen",brief:"Kurzbriefing",send:"Kalkulation per E-Mail senden",sending:"Wird gesendet…",sent:"Die Kalkulation wurde per E-Mail gesendet.",error:"Die Kalkulation konnte nicht gesendet werden. Bitte SMTP-Konfiguration prüfen.",placeholder:"Was soll die Lösung leisten? Funktionen, Integrationen und Termin angeben."},
 pl:{k:"KALKULATOR ONLINE",h:"Orientacyjna cena od razu.",p:"Kalkulacja korzysta bezpośrednio z aktualnego cennika stawek godzinowych. Wybierz usługę, zakres i pilność; wynik może zostać automatycznie wysłany e-mailem.",service:"Usługa",hours:"Szacowany zakres",hoursUnit:"godzin",urgent:"Tryb ekspresowy / pilny (+50%)",rate:"Stawka z cennika",estimate:"Cena orientacyjna",note:"Wycena niezobowiązująca; licencje, chmura, podróże i komponenty zewnętrzne są wyceniane oddzielnie. Cena stała jest potwierdzana po doprecyzowaniu zakresu.",name:"Imię i nazwisko",email:"E-mail",company:"Firma",brief:"Krótki opis",send:"Wyślij kalkulację e-mailem",sending:"Wysyłanie…",sent:"Kalkulacja została wysłana e-mailem.",error:"Nie udało się wysłać kalkulacji. Sprawdź konfigurację SMTP.",placeholder:"Co ma robić rozwiązanie? Podaj funkcje, integracje i termin."},
 es:{k:"CALCULADORA ONLINE",h:"Precio orientativo al instante.",p:"El cálculo utiliza directamente la tarifa horaria vigente. Seleccione el servicio, el esfuerzo y la urgencia; el resultado puede enviarse automáticamente por e-mail.",service:"Servicio",hours:"Esfuerzo estimado",hoursUnit:"horas",urgent:"Trabajo exprés / urgente (+50 %)",rate:"Tarifa",estimate:"Precio orientativo",note:"Estimación no vinculante; licencias, nube, viajes y componentes externos se presupuestan por separado. El precio fijo se confirma tras definir el alcance.",name:"Nombre",email:"E-mail",company:"Empresa",brief:"Resumen del proyecto",send:"Enviar cálculo por e-mail",sending:"Enviando…",sent:"El cálculo se ha enviado por e-mail.",error:"No se pudo enviar el cálculo. Revise la configuración SMTP.",placeholder:"¿Qué debe hacer la solución? Incluya funciones, integraciones y plazo."}
};

export default function PriceCalculator(){
 const {lang}=useLanguage(); const t=tx[lang];
 const [serviceKey,setServiceKey]=useState("ai"); const [hours,setHours]=useState(24); const [urgent,setUrgent]=useState(false);
 const [status,setStatus]=useState(""); const [sending,setSending]=useState(false);
 const rate=useMemo(()=>rates.find(r=>r.key===serviceKey) || rates[0],[serviceKey]);
 const factor=urgent?1.5:1; const min=Math.round(rate.min*hours*factor); const max=Math.round(rate.max*hours*factor);
 const money=(n:number)=>new Intl.NumberFormat(lang==="cs"?"cs-CZ":lang==="en"?"en-IE":lang==="de"?"de-DE":lang==="pl"?"pl-PL":lang==="es"?"es-ES":"sk-SK",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setStatus(""); setSending(true); const fd=new FormData(e.currentTarget);
  const payload={lang,name:String(fd.get("name")||""),company:String(fd.get("company")||""),email:String(fd.get("email")||""),brief:String(fd.get("brief")||""),service:rate.sk,hours,urgent,rateMin:rate.min,rateMax:rate.max,estimateMin:min,estimateMax:max};
  try{const res=await fetch("/api/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!res.ok)throw new Error("send");setStatus(t.sent);(e.currentTarget as HTMLFormElement).reset();}catch{setStatus(t.error)}finally{setSending(false)}
 }
 return <section className="section quote-calculator-section" id="kalkulacka"><div className="wrap quote-calculator-layout">
  <div className="quote-calculator-copy"><div className="eyebrow dark"><span/>{t.k}</div><h2>{t.h}</h2><p>{t.p}</p><div className="calculator-source"><span>06.10.2026</span><strong>Aktuálny cenník pracovných sadzieb</strong></div></div>
  <div className="calculator-card">
   <div className="calculator-controls"><label><span>{t.service}</span><select value={serviceKey} onChange={e=>setServiceKey(e.target.value)}>{rates.map(r=><option value={r.key} key={r.key}>{r.sk}</option>)}</select></label>
   <label><span>{t.hours}</span><div className="hours-control"><input type="range" min="1" max="240" value={hours} onChange={e=>setHours(Number(e.target.value))}/><input className="hours-number" type="number" min="1" max="1000" value={hours} onChange={e=>setHours(Math.max(1,Number(e.target.value)||1))}/><i>{t.hoursUnit}</i></div></label>
   <label className="urgent-check"><input type="checkbox" checked={urgent} onChange={e=>setUrgent(e.target.checked)}/><span>{t.urgent}</span></label></div>
   <div className="estimate-panel"><div><small>{t.rate}</small><strong>{money(rate.min)} – {money(rate.max)} / h</strong></div><div className="estimate-total"><small>{t.estimate}</small><strong>{money(min)} – {money(max)}</strong></div></div>
   <p className="estimate-note">{t.note}</p>
   <form className="calculator-email-form" onSubmit={submit}><div className="calculator-email-grid"><label><span>{t.name}</span><input name="name" required/></label><label><span>{t.email}</span><input name="email" type="email" required/></label><label><span>{t.company}</span><input name="company"/></label></div><label><span>{t.brief}</span><textarea name="brief" rows={3} placeholder={t.placeholder}/></label><button className="button button-primary" disabled={sending} type="submit">{sending?t.sending:t.send} <span aria-hidden="true">→</span></button>{status&&<p className="form-status" role="status">{status}</p>}</form>
  </div>
 </div></section>
}

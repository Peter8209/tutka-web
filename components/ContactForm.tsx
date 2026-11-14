"use client";

import { useRef, useState, type FormEvent } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const data = {
  sk:{kicker:"NEZÁVÄZNÝ DOPYT",title:"Získajte cenovú ponuku na mieru",intro:"Vyplňte základné informácie. Čím presnejšie zadanie, tým presnejšie viem pripraviť rozsah, technológiu a cenu.",name:"Meno a priezvisko *",company:"Firma / organizácia",email:"E-mail *",phone:"Telefón",need:"Čo potrebujete vytvoriť?",budget:"Orientačný rozpočet",deadline:"Požadovaný termín",detail:"Detail zadania *",namePh:"Vaše meno",companyPh:"Názov spoločnosti",deadlinePh:"napr. do 30 dní / dohodou",detailPh:"Popíšte cieľ projektu, hlavné funkcie, používateľov, potrebné napojenia/API, existujúce systémy a prípadné technologické preferencie.",benefits:["návrh vhodnej technológie","individuálne nacenenie","odpoveď obratom do e-mailu"],legal:"Odoslaním nevzniká objednávka ani záväzok. Údaje slúžia výhradne na spracovanie dopytu a prípravu cenovej ponuky.",button:"Požiadať o cenovú ponuku",missing:"Vyplňte, prosím, meno, e-mail a popis požiadavky."},
  cs:{kicker:"NEZÁVAZNÁ POPTÁVKA",title:"Získejte cenovou nabídku na míru",intro:"Vyplňte základní informace. Čím přesnější zadání, tím přesněji lze připravit rozsah, technologii a cenu.",name:"Jméno a příjmení *",company:"Firma / organizace",email:"E-mail *",phone:"Telefon",need:"Co potřebujete vytvořit?",budget:"Orientační rozpočet",deadline:"Požadovaný termín",detail:"Detail zadání *",namePh:"Vaše jméno",companyPh:"Název společnosti",deadlinePh:"např. do 30 dnů / dohodou",detailPh:"Popište cíl projektu, hlavní funkce, uživatele, potřebná napojení/API, stávající systémy a technologické preference.",benefits:["návrh vhodné technologie","individuální nacenění","rychlá odpověď e-mailem"],legal:"Odesláním nevzniká objednávka ani závazek. Údaje slouží pouze ke zpracování poptávky a přípravě nabídky.",button:"Požádat o cenovou nabídku",missing:"Vyplňte prosím jméno, e-mail a popis požadavku."},
  en:{kicker:"NO-OBLIGATION ENQUIRY",title:"Get a tailored quote",intro:"Share the essentials. The more precise the brief, the more accurately I can define scope, technology and price.",name:"Full name *",company:"Company / organisation",email:"E-mail *",phone:"Phone",need:"What do you need built?",budget:"Indicative budget",deadline:"Target deadline",detail:"Project brief *",namePh:"Your name",companyPh:"Company name",deadlinePh:"e.g. within 30 days / flexible",detailPh:"Describe the goal, key features, users, integrations/APIs, existing systems and any technology preferences.",benefits:["technology recommendation","individual pricing","fast response by e-mail"],legal:"Submitting this form does not create an order or obligation. Your data is used only to process the enquiry and prepare a quotation.",button:"Request a quote",missing:"Please enter your name, e-mail and project description."},
  de:{kicker:"UNVERBINDLICHE ANFRAGE",title:"Individuelles Angebot erhalten",intro:"Teilen Sie die wichtigsten Informationen. Je genauer das Briefing, desto präziser lassen sich Umfang, Technologie und Preis bestimmen.",name:"Vor- und Nachname *",company:"Unternehmen / Organisation",email:"E-Mail *",phone:"Telefon",need:"Was soll entwickelt werden?",budget:"Orientierungsbudget",deadline:"Gewünschter Termin",detail:"Projektbeschreibung *",namePh:"Ihr Name",companyPh:"Unternehmensname",deadlinePh:"z. B. innerhalb von 30 Tagen / flexibel",detailPh:"Beschreiben Sie Ziel, Funktionen, Nutzer, Integrationen/APIs, bestehende Systeme und technologische Präferenzen.",benefits:["passende Technologieempfehlung","individuelle Kalkulation","schnelle Antwort per E-Mail"],legal:"Mit dem Absenden entsteht weder eine Bestellung noch eine Verpflichtung. Die Daten werden ausschließlich zur Bearbeitung der Anfrage verwendet.",button:"Angebot anfordern",missing:"Bitte Name, E-Mail und Projektbeschreibung ausfüllen."},
  pl:{kicker:"NIEZOBOWIĄZUJĄCE ZAPYTANIE",title:"Otrzymaj wycenę dopasowaną do projektu",intro:"Podaj podstawowe informacje. Im dokładniejszy brief, tym precyzyjniej można określić zakres, technologię i cenę.",name:"Imię i nazwisko *",company:"Firma / organizacja",email:"E-mail *",phone:"Telefon",need:"Co chcesz stworzyć?",budget:"Orientacyjny budżet",deadline:"Oczekiwany termin",detail:"Opis projektu *",namePh:"Twoje imię i nazwisko",companyPh:"Nazwa firmy",deadlinePh:"np. do 30 dni / do ustalenia",detailPh:"Opisz cel projektu, kluczowe funkcje, użytkowników, integracje/API, obecne systemy i preferowane technologie.",benefits:["dobór odpowiedniej technologii","indywidualna wycena","szybka odpowiedź e-mailem"],legal:"Wysłanie formularza nie stanowi zamówienia ani zobowiązania. Dane służą wyłącznie do obsługi zapytania i przygotowania wyceny.",button:"Poproś o wycenę",missing:"Uzupełnij imię, e-mail i opis projektu."},
  es:{kicker:"SOLICITUD SIN COMPROMISO",title:"Obtenga un presupuesto a medida",intro:"Comparta la información básica. Cuanto más preciso sea el briefing, más exactos podrán ser el alcance, la tecnología y el precio.",name:"Nombre completo *",company:"Empresa / organización",email:"E-mail *",phone:"Teléfono",need:"¿Qué necesita desarrollar?",budget:"Presupuesto orientativo",deadline:"Plazo deseado",detail:"Descripción del proyecto *",namePh:"Su nombre",companyPh:"Nombre de la empresa",deadlinePh:"p. ej. en 30 días / flexible",detailPh:"Describa el objetivo, funciones principales, usuarios, integraciones/API, sistemas existentes y preferencias tecnológicas.",benefits:["recomendación tecnológica","precio personalizado","respuesta rápida por e-mail"],legal:"El envío del formulario no crea un pedido ni una obligación. Los datos se utilizan únicamente para procesar la solicitud y preparar el presupuesto.",button:"Solicitar presupuesto",missing:"Complete su nombre, e-mail y descripción del proyecto."}
};

const services=["Web / corporate website","E-shop / customer portal","Web application / internal system","AI chatbot / conversational bot","Custom AI agent / multi-agent solution","Standalone AI module / AI integration","Process automation / workflow","API / backend / integrations","Python development / scripts / data processing","Kotlin / Android application","Flutter / Android / iOS application","Power BI / reporting / dashboards","Excel / Power Query / VBA automation","Tableau / visualisations","SQL / Microsoft SQL Server / databases","Oracle / PL/SQL","Other programming language / custom development","End-to-end solution from design to deployment"];
const budgets=["Need a quote","Up to €500","€500 – €1,500","€1,500 – €3,000","€3,000 – €5,000","€5,000 – €10,000","€10,000+"];

const feedback = {
  sk: { sending: "Odosielam požiadavku…", success: "Vaša požiadavka bola úspešne odoslaná.", thanks: "Ďakujeme za váš záujem. Budeme vás kontaktovať e-mailom.", error: "Požiadavku sa nepodarilo odoslať. Skúste to, prosím, neskôr." },
  cs: { sending: "Odesílám poptávku…", success: "Vaše poptávka byla úspěšně odeslána.", thanks: "Děkujeme za váš zájem. Budeme vás kontaktovat e-mailem.", error: "Poptávku se nepodařilo odeslat. Zkuste to prosím později." },
  en: { sending: "Submitting your enquiry…", success: "Your enquiry has been submitted successfully.", thanks: "Thank you for your interest. We will contact you by email.", error: "Your enquiry could not be submitted. Please try again later." },
  de: { sending: "Anfrage wird gesendet…", success: "Ihre Anfrage wurde erfolgreich übermittelt.", thanks: "Vielen Dank für Ihr Interesse. Wir kontaktieren Sie per E-Mail.", error: "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut." },
  pl: { sending: "Wysyłanie zapytania…", success: "Twoje zapytanie zostało pomyślnie wysłane.", thanks: "Dziękujemy za zainteresowanie. Skontaktujemy się z Tobą e-mailem.", error: "Nie udało się wysłać zapytania. Spróbuj ponownie później." },
  es: { sending: "Enviando solicitud…", success: "Su solicitud se ha enviado correctamente.", thanks: "Gracias por su interés. Nos pondremos en contacto por correo electrónico.", error: "No se pudo enviar su solicitud. Inténtelo de nuevo más tarde." },
} as const;

type Language = keyof typeof data;
type Status = "idle" | "sending" | "success" | "error" | "missing";

export default function ContactForm() {
  const { lang } = useLanguage();
  const language: Language = Object.prototype.hasOwnProperty.call(data, lang)
    ? (lang as Language) : "sk";
  const t = data[language];
  const f = feedback[language];
  const [status, setStatus] = useState<Status>("idle");
  const busy = useRef(false);
  const sending = status === "sending";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current) return;
    // Capture the form synchronously: React currentTarget is not valid after await.
    const form = e.currentTarget;
    const fields = new FormData(form);
    const value = (key: string) => String(fields.get(key) ?? "").trim();
    const payload = {
      lang: language, name: value("name"), company: value("company"),
      email: value("email"), phone: value("phone"), service: value("service"),
      budget: value("budget"), deadline: value("deadline"), message: value("message"),
      website: value("website"),
    };
    if (!payload.name || !payload.email || !payload.message || !form.checkValidity()) {
      setStatus("missing");
      form.reportValidity();
      return;
    }
    busy.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const result: { success?: boolean } | null = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        setStatus("error");
        return;
      }
      // A UI reset must never turn an accepted SMTP submission into an error.
      setStatus("success");
      try { form.reset(); } catch { /* Delivery has already succeeded. */ }
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} aria-busy={sending}
      onChange={() => { if (!busy.current) setStatus("idle"); }}>
      <div className="form-heading">
        <span>{t.kicker}</span><h3>{t.title}</h3><p>{t.intro}</p>
      </div>
      <div className="field-row">
        <label><span>{t.name}</span><input name="name" autoComplete="name" placeholder={t.namePh} required maxLength={150} disabled={sending} /></label>
        <label><span>{t.company}</span><input name="company" autoComplete="organization" placeholder={t.companyPh} maxLength={200} disabled={sending} /></label>
      </div>
      <div className="field-row">
        <label><span>{t.email}</span><input name="email" type="email" autoComplete="email" placeholder="name@example.com" required maxLength={254} disabled={sending} /></label>
        <label><span>{t.phone}</span><input name="phone" type="tel" autoComplete="tel" placeholder="+421 ..." maxLength={80} disabled={sending} /></label>
      </div>
      <label><span>{t.need}</span><select name="service" defaultValue={services[0]} disabled={sending}>{services.map(s => <option value={s} key={s}>{s}</option>)}</select></label>
      <div className="field-row">
        <label><span>{t.budget}</span><select name="budget" defaultValue={budgets[0]} disabled={sending}>{budgets.map(b => <option value={b} key={b}>{b}</option>)}</select></label>
        <label><span>{t.deadline}</span><input name="deadline" placeholder={t.deadlinePh} maxLength={200} disabled={sending} /></label>
      </div>
      <label><span>{t.detail}</span><textarea name="message" rows={7} placeholder={t.detailPh} required maxLength={10000} disabled={sending} /></label>
      <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="form-benefits">{t.benefits.map(x => <span key={x}>✓ {x}</span>)}</div>
      <div className="form-footer">
        <p>{t.legal}</p>
        <button className="button button-primary" type="submit" disabled={sending}>
          {sending ? f.sending : t.button} <span aria-hidden="true">{sending ? "…" : "→"}</span>
        </button>
      </div>
      {status === "success" && (
        <div role="status" aria-live="polite" className="form-status" style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "16px 18px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 14, color: "#065f46" }}>
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>
          <div><strong>{f.success}</strong><p style={{ margin: "5px 0 0", color: "#065f46" }}>{f.thanks}</p></div>
        </div>
      )}
      {(status === "error" || status === "missing") && (
        <p className="form-status" role="alert" style={{ padding: "12px 16px", border: "1px solid #fecaca", background: "#fef2f2", borderRadius: 12, color: "#991b1b" }}>{status === "missing" ? t.missing : f.error}</p>
      )}
    </form>
  );
}

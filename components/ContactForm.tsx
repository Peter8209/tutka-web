"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const data = {
  sk: {
    kicker: "NEZÁVÄZNÝ DOPYT",
    title: "Získajte cenovú ponuku na mieru",
    intro:
      "Vyplňte základné informácie. Čím presnejšie zadanie, tým presnejšie viem pripraviť rozsah, technológiu a cenu.",
    name: "Meno a priezvisko *",
    company: "Firma / organizácia",
    email: "E-mail *",
    phone: "Telefón",
    need: "Čo potrebujete vytvoriť?",
    budget: "Orientačný rozpočet",
    deadline: "Požadovaný termín",
    detail: "Detail zadania *",
    namePh: "Vaše meno",
    companyPh: "Názov spoločnosti",
    deadlinePh: "napr. do 30 dní / dohodou",
    detailPh:
      "Popíšte cieľ projektu, hlavné funkcie, používateľov, potrebné napojenia/API, existujúce systémy a prípadné technologické preferencie.",
    benefits: [
      "návrh vhodnej technológie",
      "individuálne nacenenie",
      "odpoveď obratom do e-mailu",
    ],
    legal:
      "Odoslaním nevzniká objednávka ani záväzok. Údaje slúžia výhradne na spracovanie dopytu a prípravu cenovej ponuky.",
    button: "Požiadať o cenovú ponuku",
    sending: "Dopyt sa odosiela...",
    success: "✓ Ďakujem. Váš dopyt bol úspešne odoslaný. Ozvem sa Vám čo najskôr.",
    error: "E-mail sa nepodarilo odoslať. Skúste to prosím znova alebo ma kontaktujte priamo.",
    missing: "Vyplňte, prosím, meno, e-mail a popis požiadavky.",
  },
  cs: {
    kicker: "NEZÁVAZNÁ POPTÁVKA",
    title: "Získejte cenovou nabídku na míru",
    intro:
      "Vyplňte základní informace. Čím přesnější zadání, tím přesněji lze připravit rozsah, technologii a cenu.",
    name: "Jméno a příjmení *",
    company: "Firma / organizace",
    email: "E-mail *",
    phone: "Telefon",
    need: "Co potřebujete vytvořit?",
    budget: "Orientační rozpočet",
    deadline: "Požadovaný termín",
    detail: "Detail zadání *",
    namePh: "Vaše jméno",
    companyPh: "Název společnosti",
    deadlinePh: "např. do 30 dnů / dohodou",
    detailPh:
      "Popište cíl projektu, hlavní funkce, uživatele, potřebná napojení/API, stávající systémy a technologické preference.",
    benefits: [
      "návrh vhodné technologie",
      "individuální nacenění",
      "rychlá odpověď e-mailem",
    ],
    legal:
      "Odesláním nevzniká objednávka ani závazek. Údaje slouží pouze ke zpracování poptávky a přípravě nabídky.",
    button: "Požádat o cenovou nabídku",
    sending: "Poptávka se odesílá...",
    success: "✓ Děkuji. Vaše poptávka byla úspěšně odeslána. Ozvu se Vám co nejdříve.",
    error: "E-mail se nepodařilo odeslat. Zkuste to prosím znovu nebo mě kontaktujte přímo.",
    missing: "Vyplňte prosím jméno, e-mail a popis požadavku.",
  },
  en: {
    kicker: "NO-OBLIGATION ENQUIRY",
    title: "Get a tailored quote",
    intro:
      "Share the essentials. The more precise the brief, the more accurately I can define scope, technology and price.",
    name: "Full name *",
    company: "Company / organisation",
    email: "E-mail *",
    phone: "Phone",
    need: "What do you need built?",
    budget: "Indicative budget",
    deadline: "Target deadline",
    detail: "Project brief *",
    namePh: "Your name",
    companyPh: "Company name",
    deadlinePh: "e.g. within 30 days / flexible",
    detailPh:
      "Describe the goal, key features, users, integrations/APIs, existing systems and any technology preferences.",
    benefits: [
      "technology recommendation",
      "individual pricing",
      "fast response by e-mail",
    ],
    legal:
      "Submitting this form does not create an order or obligation. Your data is used only to process the enquiry and prepare a quotation.",
    button: "Request a quote",
    sending: "Sending your enquiry...",
    success: "✓ Thank you. Your enquiry was sent successfully. I will get back to you as soon as possible.",
    error: "The e-mail could not be sent. Please try again or contact me directly.",
    missing: "Please enter your name, e-mail and project description.",
  },
  de: {
    kicker: "UNVERBINDLICHE ANFRAGE",
    title: "Individuelles Angebot erhalten",
    intro:
      "Teilen Sie die wichtigsten Informationen. Je genauer das Briefing, desto präziser lassen sich Umfang, Technologie und Preis bestimmen.",
    name: "Vor- und Nachname *",
    company: "Unternehmen / Organisation",
    email: "E-Mail *",
    phone: "Telefon",
    need: "Was soll entwickelt werden?",
    budget: "Orientierungsbudget",
    deadline: "Gewünschter Termin",
    detail: "Projektbeschreibung *",
    namePh: "Ihr Name",
    companyPh: "Unternehmensname",
    deadlinePh: "z. B. innerhalb von 30 Tagen / flexibel",
    detailPh:
      "Beschreiben Sie Ziel, Funktionen, Nutzer, Integrationen/APIs, bestehende Systeme und technologische Präferenzen.",
    benefits: [
      "passende Technologieempfehlung",
      "individuelle Kalkulation",
      "schnelle Antwort per E-Mail",
    ],
    legal:
      "Mit dem Absenden entsteht weder eine Bestellung noch eine Verpflichtung. Die Daten werden ausschließlich zur Bearbeitung der Anfrage verwendet.",
    button: "Angebot anfordern",
    sending: "Ihre Anfrage wird gesendet...",
    success: "✓ Vielen Dank. Ihre Anfrage wurde erfolgreich gesendet. Ich melde mich schnellstmöglich bei Ihnen.",
    error: "Die E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt.",
    missing: "Bitte Name, E-Mail und Projektbeschreibung ausfüllen.",
  },
  pl: {
    kicker: "NIEZOBOWIĄZUJĄCE ZAPYTANIE",
    title: "Otrzymaj wycenę dopasowaną do projektu",
    intro:
      "Podaj podstawowe informacje. Im dokładniejszy brief, tym precyzyjniej można określić zakres, technologię i cenę.",
    name: "Imię i nazwisko *",
    company: "Firma / organizacja",
    email: "E-mail *",
    phone: "Telefon",
    need: "Co chcesz stworzyć?",
    budget: "Orientacyjny budżet",
    deadline: "Oczekiwany termin",
    detail: "Opis projektu *",
    namePh: "Twoje imię i nazwisko",
    companyPh: "Nazwa firmy",
    deadlinePh: "np. do 30 dni / do ustalenia",
    detailPh:
      "Opisz cel projektu, kluczowe funkcje, użytkowników, integracje/API, obecne systemy i preferowane technologie.",
    benefits: [
      "dobór odpowiedniej technologii",
      "indywidualna wycena",
      "szybka odpowiedź e-mailem",
    ],
    legal:
      "Wysłanie formularza nie stanowi zamówienia ani zobowiązania. Dane służą wyłącznie do obsługi zapytania i przygotowania wyceny.",
    button: "Poproś o wycenę",
    sending: "Wysyłanie zapytania...",
    success: "✓ Dziękuję. Zapytanie zostało wysłane pomyślnie. Odpowiem najszybciej jak to możliwe.",
    error: "Nie udało się wysłać wiadomości. Spróbuj ponownie lub skontaktuj się ze mną bezpośrednio.",
    missing: "Uzupełnij imię, e-mail i opis projektu.",
  },
  es: {
    kicker: "SOLICITUD SIN COMPROMISO",
    title: "Obtenga un presupuesto a medida",
    intro:
      "Comparta la información básica. Cuanto más preciso sea el briefing, más exactos podrán ser el alcance, la tecnología y el precio.",
    name: "Nombre completo *",
    company: "Empresa / organización",
    email: "E-mail *",
    phone: "Teléfono",
    need: "¿Qué necesita desarrollar?",
    budget: "Presupuesto orientativo",
    deadline: "Plazo deseado",
    detail: "Descripción del proyecto *",
    namePh: "Su nombre",
    companyPh: "Nombre de la empresa",
    deadlinePh: "p. ej. en 30 días / flexible",
    detailPh:
      "Describa el objetivo, funciones principales, usuarios, integraciones/API, sistemas existentes y preferencias tecnológicas.",
    benefits: [
      "recomendación tecnológica",
      "precio personalizado",
      "respuesta rápida por e-mail",
    ],
    legal:
      "El envío del formulario no crea un pedido ni una obligación. Los datos se utilizan únicamente para procesar la solicitud y preparar el presupuesto.",
    button: "Solicitar presupuesto",
    sending: "Enviando la solicitud...",
    success: "✓ Gracias. Su solicitud se ha enviado correctamente. Me pondré en contacto con usted lo antes posible.",
    error: "No se pudo enviar el correo. Inténtelo de nuevo o póngase en contacto conmigo directamente.",
    missing: "Complete su nombre, e-mail y descripción del proyecto.",
  },
};

const services = [
  "Web / corporate website",
  "E-shop / customer portal",
  "Web application / internal system",
  "AI chatbot / conversational bot",
  "Custom AI agent / multi-agent solution",
  "Standalone AI module / AI integration",
  "Process automation / workflow",
  "API / backend / integrations",
  "Python development / scripts / data processing",
  "Kotlin / Android application",
  "Flutter / Android / iOS application",
  "Power BI / reporting / dashboards",
  "Excel / Power Query / VBA automation",
  "Tableau / visualisations",
  "SQL / Microsoft SQL Server / databases",
  "Oracle / PL/SQL",
  "Other programming language / custom development",
  "End-to-end solution from design to deployment",
];

const budgets = [
  "Need a quote",
  "Up to €500",
  "€500 – €1,500",
  "€1,500 – €3,000",
  "€3,000 – €5,000",
  "€5,000 – €10,000",
  "€10,000+",
];

type SubmitStatus = "idle" | "sending" | "success" | "error" | "missing";

export default function ContactForm() {
  const { lang } = useLanguage();
  const t = data[lang as keyof typeof data] ?? data.sk;
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const value = (key: string) => String(form.get(key) || "").trim();

    const payload = {
      name: value("name"),
      company: value("company"),
      email: value("email"),
      phone: value("phone"),
      service: value("service"),
      budget: value("budget"),
      deadline: value("deadline"),
      message: value("message"),
      lang,
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("missing");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Unable to send enquiry");
      }

      setStatus("success");
      formElement.reset();
    } catch (error) {
      console.error("Contact form submit error:", error);
      setStatus("error");
    }
  }

  const statusText =
    status === "sending"
      ? t.sending
      : status === "success"
      ? t.success
      : status === "error"
      ? t.error
      : status === "missing"
      ? t.missing
      : "";

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-heading">
        <span>{t.kicker}</span>
        <h3>{t.title}</h3>
        <p>{t.intro}</p>
      </div>

      <div className="field-row">
        <label>
          <span>{t.name}</span>
          <input
            name="name"
            autoComplete="name"
            placeholder={t.namePh}
            required
            disabled={status === "sending"}
          />
        </label>

        <label>
          <span>{t.company}</span>
          <input
            name="company"
            autoComplete="organization"
            placeholder={t.companyPh}
            disabled={status === "sending"}
          />
        </label>
      </div>

      <div className="field-row">
        <label>
          <span>{t.email}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            disabled={status === "sending"}
          />
        </label>

        <label>
          <span>{t.phone}</span>
          <input
            name="phone"
            autoComplete="tel"
            placeholder="+421 ..."
            disabled={status === "sending"}
          />
        </label>
      </div>

      <label>
        <span>{t.need}</span>
        <select
          name="service"
          defaultValue={services[0]}
          disabled={status === "sending"}
        >
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </label>

      <div className="field-row">
        <label>
          <span>{t.budget}</span>
          <select
            name="budget"
            defaultValue={budgets[0]}
            disabled={status === "sending"}
          >
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{t.deadline}</span>
          <input
            name="deadline"
            placeholder={t.deadlinePh}
            disabled={status === "sending"}
          />
        </label>
      </div>

      <label>
        <span>{t.detail}</span>
        <textarea
          name="message"
          rows={7}
          placeholder={t.detailPh}
          required
          disabled={status === "sending"}
        />
      </label>

      <div className="form-benefits" aria-label="Benefits">
        {t.benefits.map((benefit) => (
          <span key={benefit}>✓ {benefit}</span>
        ))}
      </div>

      <div className="form-footer">
        <p>{t.legal}</p>

        <button
          className="button button-primary"
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
        >
          {status === "sending" ? t.sending : t.button}
          {status !== "sending" && <span aria-hidden="true">→</span>}
        </button>
      </div>

      {statusText && (
        <p
          className={`form-status ${
            status === "success"
              ? "success"
              : status === "error" || status === "missing"
              ? "error"
              : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {statusText}
        </p>
      )}
    </form>
  );
}

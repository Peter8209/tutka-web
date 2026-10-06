import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tutka.sk"),
  title: {
    default: "TUTKA | Weby, AI agenti, chatboty, Python, Kotlin a aplikácie na mieru",
    template: "%s | TUTKA",
  },
  description:
    "Profesionálny zákazkový vývoj webov, webových a mobilných aplikácií, AI agentov, chatbotov, botov, AI modulov, automatizácií, Python a Kotlin riešení, API, databáz, BI a softvéru na mieru. Cenová ponuka podľa zadania.",
  keywords: [
    "webové stránky",
    "webové aplikácie",
    "AI agenti",
    "AI chatbot",
    "AI bot",
    "AI integrácie",
    "AI automatizácia",
    "vývoj softvéru na mieru",
    "vývoj aplikácií",
    "RAG",
    "Next.js",
    "React",
    "Kotlin",
    "Power BI",
    "reporting",
    "Excel",
    "Power Query",
    "Tableau",
    "Python",
    "SQL",
    "Microsoft SQL Server",
    "Oracle",
    "databázy",
    "Flutter",
    "Dart",
    "dashboard",
    "automatizácia",
    "Slovensko"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://www.tutka.sk",
    siteName: "TUTKA Data & Apps",
    title: "TUTKA | Weby, AI, automatizácia a aplikácie na mieru",
    description: "Weby, aplikácie, AI agenti, chatboty, boty, automatizácia, Python, Kotlin, Power BI, SQL, databázy a zákazkový softvér. Cenová ponuka na mieru podľa zadania.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TUTKA | Weby, AI, automatizácia a aplikácie na mieru",
    description: "Weby, aplikácie, AI agenti, chatboty, boty, automatizácia, Python, Kotlin, Power BI, SQL, databázy a zákazkový softvér. Cenová ponuka na mieru podľa zadania.",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk">
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}

# TUTKA — www.tutka.sk

Profesionálny slovenský web pre zákazkový vývoj digitálnych riešení: weby, webové aplikácie, AI agenti, chatboty/boty, AI moduly, automatizácia, Python, Kotlin, Flutter, Business Intelligence, Power BI, Excel/Power Query, SQL, Oracle, API a databázové integrácie.

## Technológia webu
- Next.js 16 (App Router)
- React 19
- TypeScript
- responzívne vlastné CSS
- SEO metadata, Open Graph, sitemap.xml, robots.txt a JSON-LD

## Lokálne spustenie
```bash
npm install
npm run dev
```
Otvorte `http://localhost:3000`.

## Kontaktný formulár a cenová ponuka
Skopírujte `.env.example` ako `.env.local` a nastavte:
```env
NEXT_PUBLIC_CONTACT_EMAIL=kontakt@tutka.sk
```
Formulár zbiera meno, firmu, e-mail, telefón, typ riešenia, orientačný rozpočet, požadovaný termín a detail zadania. Návštevník následne otvorí svoj e-mailový program s profesionálne pripravenou žiadosťou o cenovú ponuku.

Komunikácia webu: **„Pošlite zadanie. Cenovú ponuku na mieru pripravím obratom do e-mailu.“**

## Produkčné nasadenie na Vercel
1. Nahrajte projekt do GitHub repozitára.
2. Vercel → Add New → Project → import GitHub repozitára.
3. Framework: Next.js.
4. Settings → Environment Variables → pridajte `NEXT_PUBLIC_CONTACT_EMAIL`.
5. Deploy.
6. Settings → Domains → pridajte `tutka.sk` a `www.tutka.sk`.
7. Nastavte `www.tutka.sk` ako hlavnú doménu a apex doménu presmerujte podľa nastavenia Vercelu.

## Pred ostrým spustením
- nastavte reálny kontaktný e-mail,
- doplňte právne identifikačné údaje v ochrane osobných údajov,
- podľa potreby nahraďte mailto formulár serverovým formulárom (Resend/SMTP/API),
- po pridaní analytiky doplňte cookie consent podľa používaných nástrojov.

Contact e-mail: tutka.peter@gmail.com
Languages: SK, CZ, EN, DE, PL, ES

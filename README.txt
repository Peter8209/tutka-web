POSTUP
1. Nahraď components/ContactForm.tsx priloženým súborom.
2. Vytvor app/api/contact/route.ts a vlož priložený route.ts.
3. V termináli projektu spusti:
   npm install nodemailer
   npm install -D @types/nodemailer

4. Pre lokálny vývoj použi .env.local.
5. Vo Vercel > Project > Settings > Environment Variables pridaj rovnaké premenné:
   GMAIL_USER
   GMAIL_APP_PASSWORD
   CONTACT_TO_EMAIL
   NEXT_PUBLIC_CONTACT_EMAIL

6. Po pridaní environment variables urob nový Deploy.

DÔLEŽITÉ:
- GMAIL_APP_PASSWORD nevkladaj priamo do zdrojového kódu.
- .env ani .env.local necommituj do GitHubu.
- Do .gitignore pridaj:
  .env
  .env.local

// Server-only configuration, never import into a client component.
export function readSmtpConfig(env: Record<string, string | undefined>) {
  const value = (key: string) => (env[key] || '').trim();
  const host = (value('SMTP_HOST') || 'smtp.gmail.com').toLowerCase();
  const port = Number(value('SMTP_PORT') || '465');
  const user = value('SMTP_USER') || value('GMAIL_USER');
  const pass = (value('SMTP_PASS') || value('GMAIL_APP_PASSWORD')).replace(/\s/g, '');
  const to = value('LEAD_TO_EMAIL') || user;
  const email = /^[^\s@<>\x00-\x1f\x7f,;]+@[^\s@<>\x00-\x1f\x7f,;]+\.[^\s@<>\x00-\x1f\x7f,;]+$/;
  // Gmail only: reject insecure ports and unexpected hosts rather than sending credentials elsewhere.
  if (host !== 'smtp.gmail.com' || ![465, 587].includes(port) || !email.test(user) || !email.test(to) || !pass) return null;
  return { host, port, user, pass, to };
}

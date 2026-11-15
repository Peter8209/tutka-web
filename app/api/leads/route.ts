import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { readLeadMode } from '../../../lib/lead-mode';
import { readSmtpConfig } from './smtp-config';
import { normalizePhone } from '../../../components/leads/phone';
import { leadCopy, type LeadLang } from '../../../components/leads/lead-copy';

export const runtime = 'nodejs';
export const maxDuration = 60;
// Best-effort per-instance protection; use a deployment-wide firewall limit in production.
const attempts = new Map<string, { count: number; expires: number }>();
function allowAttempt(key: string) {
  const now = Date.now();
  for (const [k, v] of attempts) if (v.expires <= now) attempts.delete(k);
  const current = attempts.get(key);
  if (current) { if (current.count >= 5) return false; current.count++; return true; }
  if (attempts.size >= 5000) return false;
  attempts.set(key, { count: 1, expires: now + 60000 });
  return true;
}
const fail = (status: number) => NextResponse.json({ok:false}, {status, headers:{'Cache-Control':'no-store'}});
const unavailable = (reason: string) => { console.error('[tutka-leads]', reason); return fail(503); };
// Log fixed categories only: never log credentials, visitor data, or provider error objects.
export async function POST(req: Request) {
  const mode = readLeadMode();
  if (!['optional','required'].includes(mode)) return fail(404);
  const hostnames = (process.env.LEAD_HOSTNAMES || 'www.tutka.sk,tutka.sk').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  const smtp = readSmtpConfig(process.env);
  if (!smtp) return unavailable('SMTP_CONFIG_INVALID');
  if (!hostnames.length) return unavailable('HOST_ALLOWLIST_EMPTY');
  let stage = 'VALIDATION';
  try {
    const origin = req.headers.get('origin');
    if (!origin) return fail(403);
    let u: URL;
    try { u = new URL(origin); } catch { return fail(403); }
    if (req.headers.get('sec-fetch-site') === 'cross-site') return fail(403);
    if (!hostnames.includes(u.hostname.toLowerCase()) || (u.protocol !== 'https:' && !(process.env.NODE_ENV === 'development' && u.hostname === 'localhost'))) return fail(403);
    if (!(req.headers.get('content-type') || '').startsWith('application/json')) return fail(415);
    // Limit even chunked bodies before parsing.
    const reader = req.body?.getReader();
    if (!reader) return fail(400);
    const decoder = new TextDecoder();
    let bytes = 0, raw = '';
    while (true) {const {done,value}=await reader.read(); if(done)break; bytes+=value.byteLength; if(bytes>8192){await reader.cancel();return fail(413);} raw+=decoder.decode(value,{stream:true});}
    raw+=decoder.decode();
    let body: unknown; try {body=JSON.parse(raw);} catch {return fail(400);}
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(400);
    const b=body as Record<string,unknown>;
    const email=typeof b.email==='string'?b.email.trim():'';
    const phone=normalizePhone(b.phone);
    if (typeof b.website !== 'string' || b.website !== '') return fail(400);
    const lang=typeof b.lang==='string' && Object.prototype.hasOwnProperty.call(leadCopy,b.lang)?b.lang as LeadLang:'sk';
    if (!phone || email.length>254 || !/^[^\s@<>\x00-\x1f\x7f]+@[^\s@<>\x00-\x1f\x7f]+\.[^\s@<>\x00-\x1f\x7f]+$/.test(email) || typeof b.contact!=='boolean') return fail(400);
    const contact = mode==='optional' || b.contact===true;
    // Vercel's forwarded IP header is used only for a short-lived, local rate limit.
    const ip = (req.headers.get('x-vercel-forwarded-for') || 'unknown').split(',')[0].trim().slice(0, 128);
    if (!allowAttempt(ip)) return NextResponse.json({ok:false}, {status:429, headers:{'Cache-Control':'no-store','Retry-After':'60'}});
    const date=new Date().toISOString();
    const t=leadCopy[lang];
    const text=[contact?'NOVÝ LEAD – vyžiadaný jednorazový kontakt':'REGISTRÁCIA – nekontaktovať na marketing',`E-mail (neoverený): ${email}`,`Telefón (neoverený): ${phone}`,`Dátum UTC: ${date}`,`Jazyk: ${lang}`,`Režim: ${mode}`,`Kontakt vyžiadaný: ${contact?'ÁNO':'NIE'}`,'Newsletter: NIE','Verzia formulára: 2026-11-15 REV08 multilingual Gmail SMTP',`Text formulára: ${mode==='required'?t.required:t.optional}`,`Text voľby: ${mode==='required'?t.contact:t.submit}`].join('\n');
    // Only server-controlled addresses are used for SMTP envelope and headers.
    stage = 'SMTP';
    const transport = nodemailer.createTransport({
      host: smtp.host, port: smtp.port, secure: smtp.secure,
      requireTLS: smtp.requireTLS,
      auth: { user: smtp.user, pass: smtp.pass },
      connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000, dnsTimeout: 8000,
      tls: { minVersion: 'TLSv1.2' },
    });
    try {
    const sent = await transport.sendMail({
      from: { name: 'TUTKA Lead Gateway', address: smtp.user },
      to: smtp.to, subject: contact ? 'TUTKA.SK | Nový obchodný lead' : 'TUTKA.SK | Nová registrácia',
      text, disableFileAccess: true, disableUrlAccess: true,
    });
    if (!sent.accepted.length || sent.rejected.length) { console.error('[tutka-leads]', 'SMTP_RECIPIENT_REJECTED'); return fail(502); }
    return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
    } finally { transport.close(); }
  } catch (err) {
    const code = typeof err === 'object' && err !== null && 'code' in err ? err.code : '';
    const safeCode = typeof code === 'string' && ['EAUTH','ECONNECTION','ETIMEDOUT','ESOCKET','EENVELOPE','EMESSAGE','EDNS'].includes(code) ? code : 'OTHER';
    console.error('[tutka-leads]', stage, safeCode);
    return fail(502);
  }
}

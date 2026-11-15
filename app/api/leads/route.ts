import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { readSmtpConfig } from './smtp-config';
import { normalizePhone } from '../../../components/leads/phone';
import { leadCopy, type LeadLang } from '../../../components/leads/lead-copy';

export const runtime = 'nodejs';
export const maxDuration = 60;
const fail = (status: number) => NextResponse.json({ok:false}, {status, headers:{'Cache-Control':'no-store'}});
const unavailable = (reason: string) => { console.error('[tutka-leads]', reason); return fail(503); };
// Log fixed categories only: never log credentials, visitor data, or provider error objects.
export async function POST(req: Request) {
  const mode = process.env.NEXT_PUBLIC_LEAD_MODE || 'required';
  if (!['optional','required'].includes(mode)) return fail(404);
  const hostnames = (process.env.LEAD_HOSTNAMES || 'www.tutka.sk,tutka.sk').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const smtp = readSmtpConfig(process.env);
  if (!secret) return unavailable('TURNSTILE_SECRET_MISSING');
  if (!smtp) return unavailable('SMTP_CONFIG_INVALID');
  if (!hostnames.length) return unavailable('HOST_ALLOWLIST_EMPTY');
  let stage = 'VALIDATION';
  try {
    const origin = req.headers.get('origin');
    if (!origin) return fail(403);
    const u = new URL(origin);
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
    const token=typeof b.token==='string'?b.token:'';
    const lang=typeof b.lang==='string' && Object.prototype.hasOwnProperty.call(leadCopy,b.lang)?b.lang as LeadLang:'sk';
    if (!phone || email.length>254 || !/^[^\s@<>\x00-\x1f\x7f]+@[^\s@<>\x00-\x1f\x7f]+\.[^\s@<>\x00-\x1f\x7f]+$/.test(email) || !token || token.length>2048 || typeof b.contact!=='boolean') return fail(400);
    const contact = mode==='optional' || b.contact===true;
    stage = 'TURNSTILE';
    const check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret,response:token}),signal:AbortSignal.timeout(10000),cache:'no-store'});
    if(!check.ok)return unavailable('TURNSTILE_PROVIDER_ERROR');
    const verified=await check.json();
    if(verified.success!==true || verified.action!=='tutka-lead' || verified.hostname!==u.hostname || !hostnames.includes(verified.hostname))return fail(403);
    const date=new Date().toISOString();
    const t=leadCopy[lang];
    const text=[contact?'NOVÝ LEAD – vyžiadaný jednorazový kontakt':'REGISTRÁCIA – nekontaktovať na marketing',`E-mail (neoverený): ${email}`,`Telefón (neoverený): ${phone}`,`Dátum UTC: ${date}`,`Jazyk: ${lang}`,`Režim: ${mode}`,`Kontakt vyžiadaný: ${contact?'ÁNO':'NIE'}`,'Newsletter: NIE','Verzia formulára: 2026-11-15 REV06 multilingual SMTP',`Text formulára: ${mode==='required'?t.required:t.optional}`,`Text voľby: ${mode==='required'?t.contact:t.submit}`].join('\n');
    // Only server-controlled addresses are used for SMTP envelope and headers.
    stage = 'SMTP';
    const transport = nodemailer.createTransport({
      host: smtp.host, port: smtp.port, secure: smtp.port === 465,
      requireTLS: smtp.port === 587,
      auth: { user: smtp.user, pass: smtp.pass },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
      tls: { minVersion: 'TLSv1.2' },
    });
    const sent = await transport.sendMail({
      from: { name: 'TUTKA Lead Gateway', address: smtp.user },
      to: smtp.to, subject: contact ? 'TUTKA.SK | Nový obchodný lead' : 'TUTKA.SK | Nová registrácia',
      text, disableFileAccess: true, disableUrlAccess: true,
    });
    if (!sent.accepted.length || sent.rejected.length) { console.error('[tutka-leads]', 'SMTP_RECIPIENT_REJECTED'); return fail(502); }
    return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  } catch (err) {
    const code = typeof err === 'object' && err !== null && 'code' in err ? err.code : '';
    const safeCode = typeof code === 'string' && ['EAUTH','ECONNECTION','ETIMEDOUT','ESOCKET','EENVELOPE','EMESSAGE','EDNS'].includes(code) ? code : 'OTHER';
    console.error('[tutka-leads]', stage, safeCode);
    return fail(502);
  }
}

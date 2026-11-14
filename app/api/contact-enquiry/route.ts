import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const limits = {
  name: 150, company: 200, email: 254, phone: 80,
  service: 250, budget: 100, deadline: 200, message: 10000, website: 200,
} as const;
type Field = keyof typeof limits;
const languages = new Set(["sk", "cs", "en", "de", "pl", "es"]);
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, ch => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[ch] ?? ch));
const line = (value: string) => value.replace(/[\r\n\u0000-\u001f\u007f]/g, " ").trim();
const fail = (status: number) => NextResponse.json({ success: false }, { status });

export async function POST(request: Request) {
  // Require JSON and reject browser requests explicitly marked as cross-site.
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return fail(415);
  if (request.headers.get("sec-fetch-site") === "cross-site") return fail(403);

  let raw: unknown;
  try {
    const text = await request.text();
    if (Buffer.byteLength(text, "utf8") > 64 * 1024) return fail(413);
    raw = JSON.parse(text);
  } catch { return fail(400); }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fail(400);
  const input = raw as Record<string, unknown>;
  const fields = {} as Record<Field, string>;
  for (const key of Object.keys(limits) as Field[]) {
    const v = input[key] ?? "";
    if (typeof v !== "string" || v.length > limits[key]) return fail(400);
    fields[key] = v.trim();
  }
  if (fields.website || !fields.name || !fields.message || !emailPattern.test(fields.email)) return fail(400);
  const lang = typeof input.lang === "string" && languages.has(input.lang) ? input.lang : "sk";

  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const to = (process.env.CONTACT_TO_EMAIL || process.env.QUOTE_RECIPIENT || user)?.trim();
  if (!user || !pass || !to || !emailPattern.test(user) || !emailPattern.test(to)) {
    console.error("[contact-enquiry] Missing or invalid server mail configuration.");
    return fail(503);
  }

  const rows = [
    ["Meno / Name", fields.name], ["Firma / Company", fields.company],
    ["E-mail", fields.email], ["Telefón / Phone", fields.phone],
    ["Služba / Service", fields.service], ["Rozpočet / Budget", fields.budget],
    ["Termín / Deadline", fields.deadline], ["Jazyk / Language", lang.toUpperCase()],
  ];
  const htmlRows = rows.map(([label, value]) => `<tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#64748b;width:38%">${escapeHtml(label)}</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;overflow-wrap:anywhere">${escapeHtml(value || "–")}</td></tr>`).join("");
  const html = `<div style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a"><div style="max-width:720px;margin:auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden"><div style="background:#0b1320;padding:30px;color:#ffffff"><div style="color:#60e5d7;font-size:12px;letter-spacing:3px;font-weight:bold">TUTKA · DIGITAL · AI · DATA</div><h1 style="margin:14px 0 0;font-size:26px">Nový nezáväzný dopyt</h1></div><div style="padding:24px"><p>Nová požiadavka z kontaktného formulára TUTKA.SK.</p><table style="width:100%;border-collapse:collapse;font-size:14px">${htmlRows}</table><h2 style="font-size:18px;margin-top:28px">Detail zadania / Project brief</h2><div style="padding:16px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:10px;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(fields.message)}</div><p style="font-size:13px;color:#64748b;margin-top:22px">Odpovedajte priamo na tento e-mail. Adresa zákazníka je nastavená ako Reply-To.</p></div></div></div>`;
  const text = `TUTKA.SK – Nový nezáväzný dopyt\n\n${rows.map(([label, value]) => `${label}: ${value || "–"}`).join("\n")}\n\nDetail zadania:\n${fields.message}`;

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user, pass }, connectionTimeout: 10000,
    greetingTimeout: 10000, socketTimeout: 15000,
  });
  try {
    const result = await transport.sendMail({
      from: { name: "TUTKA.SK – Dopyty", address: user },
      to, replyTo: fields.email,
      subject: `TUTKA.SK | Nový dopyt – ${line(fields.service) || "IT / AI"}`,
      text, html,
    });
    if (!result.accepted?.length) {
      console.error("[contact-enquiry] SMTP did not accept the configured recipient.");
      return fail(502);
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Avoid logging payloads, credentials or sensitive SMTP responses.
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "SMTP_ERROR";
    console.error("[contact-enquiry] Mail submission failed:", code);
    return fail(502);
  }
}

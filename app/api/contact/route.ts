import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      company,
      email,
      phone,
      service,
      budget,
      deadline,
      message,
    } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Chýba meno, e-mail alebo detail zadania." },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const contactTo = process.env.CONTACT_TO_EMAIL || gmailUser;

    if (!gmailUser || !gmailAppPassword || !contactTo) {
      console.error("Missing GMAIL_USER / GMAIL_APP_PASSWORD / CONTACT_TO_EMAIL");
      return NextResponse.json(
        { success: false, message: "E-mailová služba nie je nakonfigurovaná." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const subject = `Nový dopyt z webu – ${service || "Cenová ponuka"}`;

    await transporter.sendMail({
      from: `"TUTKA Web" <${gmailUser}>`,
      to: contactTo,
      replyTo: email,
      subject,
      text:
`Nový dopyt z webu

Meno: ${name}
Firma: ${company || "–"}
E-mail: ${email}
Telefón: ${phone || "–"}
Služba: ${service || "–"}
Rozpočet: ${budget || "–"}
Termín: ${deadline || "–"}

Detail zadania:
${message}
`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#142033">
          <div style="background:#071321;color:#fff;padding:28px;border-radius:16px 16px 0 0">
            <div style="color:#43e0d0;font-size:12px;font-weight:700;letter-spacing:1px">NOVÝ DOPYT Z WEBU</div>
            <h1 style="margin:8px 0 0;font-size:26px">Žiadosť o cenovú ponuku</h1>
          </div>
          <div style="padding:28px;border:1px solid #e6ebef;border-top:0;border-radius:0 0 16px 16px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:10px;border-bottom:1px solid #eee;color:#667085">Meno</td><td style="padding:10px;border-bottom:1px solid #eee;font-weight:700">${esc(name)}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;color:#667085">Firma</td><td style="padding:10px;border-bottom:1px solid #eee">${esc(company || "–")}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;color:#667085">E-mail</td><td style="padding:10px;border-bottom:1px solid #eee"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;color:#667085">Telefón</td><td style="padding:10px;border-bottom:1px solid #eee">${esc(phone || "–")}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;color:#667085">Služba</td><td style="padding:10px;border-bottom:1px solid #eee">${esc(service || "–")}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;color:#667085">Rozpočet</td><td style="padding:10px;border-bottom:1px solid #eee">${esc(budget || "–")}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;color:#667085">Termín</td><td style="padding:10px;border-bottom:1px solid #eee">${esc(deadline || "–")}</td></tr>
            </table>
            <div style="margin-top:22px;padding:20px;background:#f4f8fa;border-radius:12px">
              <div style="font-size:12px;font-weight:700;color:#667085;margin-bottom:8px">DETAIL ZADANIA</div>
              <div style="white-space:pre-wrap;line-height:1.6">${esc(message)}</div>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, message: "Pri odosielaní e-mailu nastala chyba." },
      { status: 500 }
    );
  }
}

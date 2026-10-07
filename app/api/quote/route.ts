import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const safe=(v:unknown,max=3000)=>String(v??"").replace(/[<>]/g,"").slice(0,max);
const eur=(n:number)=>new Intl.NumberFormat("sk-SK",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);

export async function POST(req:Request){
 try{
  const body=await req.json();
  const name=safe(body.name,120),email=safe(body.email,180),company=safe(body.company,180),brief=safe(body.brief,4000),service=safe(body.service,260);
  const hours=Math.max(1,Number(body.hours)||1), rateMin=Number(body.rateMin)||0, rateMax=Number(body.rateMax)||0, estimateMin=Number(body.estimateMin)||0, estimateMax=Number(body.estimateMax)||0, urgent=Boolean(body.urgent);
  if(!name||!email||!service||!email.includes("@")) return NextResponse.json({ok:false,error:"invalid"},{status:400});
  const user=process.env.GMAIL_USER || "tutka.peter@gmail.com"; const pass=process.env.GMAIL_APP_PASSWORD; const owner=process.env.QUOTE_RECIPIENT || "tutka.peter@gmail.com";
  if(!pass) return NextResponse.json({ok:false,error:"smtp_not_configured"},{status:503});
  const transporter=nodemailer.createTransport({service:"gmail",auth:{user,pass}});
  const quoteId=`TUTKA-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  const subject=`Orientačná kalkulácia ${quoteId} – ${service}`;
  const html=`<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#172033"><div style="background:#0b1220;color:white;padding:28px;border-radius:18px 18px 0 0"><div style="font-size:12px;letter-spacing:.18em;color:#8ff4e7">TUTKA · DIGITAL · AI · DATA</div><h1 style="margin:12px 0 0;font-size:28px">Orientačná kalkulácia</h1></div><div style="border:1px solid #dfe5eb;border-top:0;padding:28px;border-radius:0 0 18px 18px"><p>Dobrý deň, ${name},</p><p>na základe údajov z online kalkulačky posielam orientačný cenový rozsah podľa aktuálneho cenníka pracovných sadzieb.</p><table style="width:100%;border-collapse:collapse;margin:24px 0"><tr><td style="padding:10px;border-bottom:1px solid #eee">Služba</td><td style="padding:10px;border-bottom:1px solid #eee"><b>${service}</b></td></tr><tr><td style="padding:10px;border-bottom:1px solid #eee">Rozsah</td><td style="padding:10px;border-bottom:1px solid #eee"><b>${hours} h</b></td></tr><tr><td style="padding:10px;border-bottom:1px solid #eee">Sadzba</td><td style="padding:10px;border-bottom:1px solid #eee"><b>${eur(rateMin)} – ${eur(rateMax)} / h</b></td></tr><tr><td style="padding:10px;border-bottom:1px solid #eee">Urgentné práce</td><td style="padding:10px;border-bottom:1px solid #eee"><b>${urgent?"Áno (+50 %)":"Nie"}</b></td></tr></table><div style="background:#eefbf8;border:1px solid #c9f3ea;border-radius:14px;padding:20px"><div style="font-size:12px;color:#687286">ORIENTAČNÁ CENA</div><div style="font-size:32px;font-weight:800;color:#0b1220;margin-top:6px">${eur(estimateMin)} – ${eur(estimateMax)}</div></div>${brief?`<h3 style="margin-top:26px">Zadanie</h3><p style="white-space:pre-wrap">${brief}</p>`:""}<p style="font-size:12px;color:#687286;margin-top:26px">Kalkulácia je nezáväzná. Licencie, cloudové služby, cestovné, externé komponenty a autorizované výstupy sa naceňujú osobitne podľa zadania. Fixnú projektovú cenu potvrdíme po spresnení rozsahu.</p><p>S pozdravom<br><b>Ing. Peter Tutka</b><br><a href="mailto:tutka.peter@gmail.com">tutka.peter@gmail.com</a></p><div style="font-size:11px;color:#8b95a3">ID kalkulácie: ${quoteId}</div></div></div>`;
  await transporter.sendMail({from:`TUTKA <${user}>`,to:email,cc:owner,replyTo:owner,subject,html});
  return NextResponse.json({ok:true,quoteId});
 }catch(e){console.error(e);return NextResponse.json({ok:false,error:"server"},{status:500})}
}

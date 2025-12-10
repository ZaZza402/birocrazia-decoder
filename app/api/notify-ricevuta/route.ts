import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email non valida" }, { status: 400 });
    }

    // Namecheap Private Email configuration
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    // Send notification to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "start@alecsdesign.xyz",
      subject: "🔔 Nuovo Interesse: Generatore di Ricevute",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #1e293b;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: white;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 30px;
              }
              .content {
                background: #f8fafc;
                padding: 30px;
                border-radius: 12px;
                border: 2px solid #e2e8f0;
              }
              .email-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #4f46e5;
                margin: 20px 0;
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                color: #4f46e5;
              }
              .info {
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
                border-left: 4px solid #7c3aed;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                color: #64748b;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🔔 Nuovo Interesse</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Generatore di Ricevute</p>
            </div>
            
            <div class="content">
              <h2 style="margin-top: 0; color: #4f46e5;">Un utente vuole essere avvisato!</h2>
              
              <p>Un nuovo utente ha mostrato interesse per il <strong>Generatore di Ricevute</strong> e vuole essere notificato quando sarà disponibile.</p>
              
              <div class="email-box">
                ${email}
              </div>
              
              <div class="info">
                <p style="margin: 0;"><strong>📅 Data:</strong> ${new Date().toLocaleString(
                  "it-IT"
                )}</p>
                <p style="margin: 10px 0 0 0;"><strong>🔗 Provenienza:</strong> /calcolatori/ricevuta</p>
              </div>
              
              <p style="margin-top: 25px; color: #64748b; font-size: 14px;">
                <strong>Nota:</strong> Ricordati di salvare questa email nella lista di notifica per il lancio del Generatore di Ricevute.
              </p>
            </div>
            
            <div class="footer">
              <p>Bur<strong>0</strong> - Simulatore Fiscale</p>
              <p>Powered by alecsdesign.xyz</p>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Notifica inviata con successo" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Errore durante l'invio della notifica" },
      { status: 500 }
    );
  }
}

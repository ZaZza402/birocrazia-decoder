import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Get email credentials from environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPassword) {
      console.error("Email credentials not configured");
      return NextResponse.json({ success: true }); // Fail silently for user
    }

    // Create transporter with your email credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // or your SMTP server
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Email content
    const mailOptions = {
      from: emailUser,
      to: "start@alecsdesign.xyz", // Send to your business email
      subject: "Nuovo Interesse Bur0 PRO",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">🚀 Nuova Richiesta Bur0 PRO</h2>
          <p style="font-size: 16px; color: #333;">
            Un utente ha espresso interesse per le funzionalità PRO di Bur0.
          </p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #4f46e5;">
              📧 Email: <span style="color: #111827;">${email}</span>
            </p>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            <strong>Funzionalità richieste:</strong>
          </p>
          <ul style="color: #6b7280;">
            <li>💾 Salva i Clienti nel Cloud</li>
            <li>🎨 White Label (Logo personalizzato)</li>
            <li>📊 Confronta Scenari Multipli</li>
          </ul>
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            Ricevuto da: <strong>bur0.click</strong><br>
            Data: ${new Date().toLocaleString("it-IT", {
              timeZone: "Europe/Rome",
            })}
          </p>
        </div>
      `,
      text: `
Nuovo Interesse Bur0 PRO

Email: ${email}

Funzionalità richieste:
- Salva i Clienti nel Cloud
- White Label (Logo personalizzato)
- Confronta Scenari Multipli

Ricevuto da: bur0.click
Data: ${new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" })}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email submission error:", error);
    // Fail silently for user - don't expose errors
    return NextResponse.json({ success: true });
  }
}

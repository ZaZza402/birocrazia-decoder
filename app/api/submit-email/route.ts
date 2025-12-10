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
      host: "mail.privateemail.com", // Namecheap Private Email SMTP
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      throw verifyError;
    }

    // Email content
    const mailOptions = {
      from: `"Bur0 Notifiche" <${emailUser}>`,
      to: "start@alecsdesign.xyz",
      replyTo: email, // User's email as reply-to
      subject: "🚀 Nuovo Interesse Bur0 PRO",
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
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email submission error:", error);
    // Log detailed error info
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    // Return error for debugging (only in development)
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === "development" ? error : "Email failed",
      },
      { status: 500 }
    );
  }
}

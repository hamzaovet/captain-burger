import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.EMAIL_USER || "hamzaovet@gmail.com";
  const rawPass = process.env.EMAIL_PASS || "";
  const pass = rawPass.replace(/\s+/g, "");

  if (!pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

export async function sendOtpEmail(to: string, name: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn("⚠️ [Email] GMAIL_APP_PASS not configured in environment. Test code:", code);
      return { success: true };
    }

    const fromAddress = `"كابتن برجر 🍔🔥" <${process.env.EMAIL_USER || "hamzaovet@gmail.com"}>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Cairo', system-ui, -apple-system, sans-serif; background-color: #F5EBDC; color: #502314; margin: 0; padding: 20px; }
          .container { max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 2px solid #FFAE00; border-radius: 24px; padding: 36px 28px; text-align: center; box-shadow: 0 8px 30px rgba(80, 35, 20, 0.1); }
          .logo { color: #D62300; font-size: 28px; font-weight: 900; margin-bottom: 6px; }
          .sub { color: #502314; font-size: 14px; margin-bottom: 24px; font-weight: 700; }
          .otp-box { background: #F5EBDC; border: 2px dashed #D62300; border-radius: 16px; padding: 18px; margin: 24px 0; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #D62300; font-family: monospace; }
          .info { color: #502314; font-size: 13px; line-height: 1.6; }
          .footer { margin-top: 30px; font-size: 11px; color: #8A6D5E; border-top: 1px solid #EADBCC; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">كابتن برجر 🍔</div>
          <div class="sub">أشهى برجر لحم بلدي ودجاج كرسبي في الشيخ زايد و6 أكتوبر</div>
          
          <h2 style="color: #502314; font-size: 20px; margin: 0 0 10px 0;">أهلاً بك يا ${name || "عميلنا العزيز"} 👋</h2>
          <p class="info">استخدم رمز التحقق التالي لتأكيد تسجيل حسابك في التطبيق:</p>

          <div class="otp-box">${code}</div>

          <p class="info">⚠️ الرمز صالح لمدة 10 دقائق فقط. لا تشارك هذا الرمز مع أي شخص.</p>

          <div class="footer">
            تم إرسال هذا البريد تلقائياً من منصة كابتن برجر — فرعي الشيخ زايد و6 أكتوبر<br/>
            للطلبات والخدمة السريعة: 01206002168 | 01117776349
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `رمز التحقق الخاص بك في كابتن برجر 🍔: ${code}`,
      html: htmlContent,
    });

    return { success: true };
  } catch (err: any) {
    console.error("❌ [Email Error]:", err);
    return { success: false, error: err.message };
  }
}

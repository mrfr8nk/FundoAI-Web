import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env["SMTP_HOST"] || "smtp.gmail.com",
  port: Number(process.env["SMTP_PORT"] || 587),
  secure: false,
  auth: {
    user: process.env["SMTP_USER"],
    pass: process.env["SMTP_PASS"],
  },
});

export async function sendVerificationEmail(to: string, name: string, code: string) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#080511;font-family:'Inter',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:20px;padding:40px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#a855f7,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:22px;">🤖</div>
        <span style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#a855f7,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">FUNDO AI</span>
      </div>
    </div>
    <h2 style="color:#fff;font-size:24px;font-weight:800;text-align:center;margin:0 0 8px;">Verify your email 🔐</h2>
    <p style="color:rgba(255,255,255,0.55);text-align:center;margin:0 0 32px;">Hi ${name}! Use the code below to verify your account.</p>
    <div style="background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.3);border-radius:14px;padding:24px;text-align:center;margin-bottom:28px;">
      <div style="letter-spacing:12px;font-size:38px;font-weight:900;color:#fff;">${code}</div>
      <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:10px;">Expires in 10 minutes</div>
    </div>
    <p style="color:rgba(255,255,255,0.35);font-size:12px;text-align:center;margin:0;">If you didn't create a FUNDO AI account, you can safely ignore this email.</p>
    <div style="border-top:1px solid rgba(255,255,255,0.07);margin-top:32px;padding-top:20px;text-align:center;">
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">© 2025 FUNDO AI · Made in Zimbabwe 🇿🇼 by Darrell Mucheri</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env["SMTP_FROM"] || "FUNDO AI <noreply@fundoai.com>",
    to,
    subject: `${code} — Your FUNDO AI verification code`,
    html,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, code: string) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#080511;font-family:'Inter',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:20px;padding:40px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#a855f7,#7c3aed);display:inline-flex;align-items:center;justify-content:center;font-size:22px;">🤖</div>
        <span style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#a855f7,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">FUNDO AI</span>
      </div>
    </div>
    <h2 style="color:#fff;font-size:24px;font-weight:800;text-align:center;margin:0 0 8px;">Reset your password 🔑</h2>
    <p style="color:rgba(255,255,255,0.55);text-align:center;margin:0 0 32px;">Hi ${name}! Use the code below to reset your password.</p>
    <div style="background:rgba(6,182,212,0.10);border:1px solid rgba(6,182,212,0.3);border-radius:14px;padding:24px;text-align:center;margin-bottom:28px;">
      <div style="letter-spacing:12px;font-size:38px;font-weight:900;color:#fff;">${code}</div>
      <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:10px;">Expires in 10 minutes</div>
    </div>
    <p style="color:rgba(255,255,255,0.35);font-size:12px;text-align:center;margin:0;">If you didn't request a password reset, you can safely ignore this email.</p>
    <div style="border-top:1px solid rgba(255,255,255,0.07);margin-top:32px;padding-top:20px;text-align:center;">
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">© 2025 FUNDO AI · Made in Zimbabwe 🇿🇼 by Darrell Mucheri</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env["SMTP_FROM"] || "FUNDO AI <noreply@fundoai.com>",
    to,
    subject: `${code} — Reset your FUNDO AI password`,
    html,
  });
}

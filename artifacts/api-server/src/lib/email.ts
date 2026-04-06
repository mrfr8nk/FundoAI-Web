import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env["SMTP_HOST"] || "smtp.gmail.com",
  port: Number(process.env["SMTP_PORT"] || 587),
  secure: false,
  auth: {
    user: process.env["SMTP_USER"],
    pass: process.env["SMTP_PASS"],
  },
  tls: { rejectUnauthorized: false },
});

/* ── Shared design tokens ───────────────────────────────── */
const BG       = "#06030f";
const CARD_BG  = "#0f0a1e";
const BORDER   = "#1e1535";
const PURPLE   = "#a855f7";
const CYAN     = "#06b6d4";
const MUTED    = "#6b7280";
const WHITE    = "#ffffff";
const SOFT     = "#c4b5fd";

function base(preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>FUNDO AI</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;</div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BG};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Email card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">

          <!-- Header gradient bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,${PURPLE},${CYAN},${PURPLE});border-radius:3px 3px 0 0;"></td>
          </tr>

          <!-- Card body -->
          <tr>
            <td style="background-color:${CARD_BG};border:1px solid ${BORDER};border-top:none;border-radius:0 0 20px 20px;padding:40px 40px 36px;">

              <!-- Logo -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background:linear-gradient(135deg,${PURPLE},#7c3aed);border-radius:14px;padding:12px 14px;vertical-align:middle;">
                          <span style="font-size:22px;line-height:1;">🤖</span>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <div style="font-size:22px;font-weight:900;letter-spacing:-0.5px;background:linear-gradient(135deg,${PURPLE},${CYAN});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:${PURPLE};">FUNDO AI</div>
                          <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:${MUTED};margin-top:1px;">Zimbabwe's AI Assistant</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${body}

              <!-- Footer inside card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:36px;border-top:1px solid ${BORDER};">
                <tr>
                  <td style="padding-top:24px;">
                    <p style="margin:0;font-size:12px;color:${MUTED};text-align:center;line-height:1.6;">
                      This email was sent by <strong style="color:${SOFT};">FUNDO AI</strong>.<br/>
                      If you didn't request this, you can safely ignore it.
                    </p>
                    <p style="margin:12px 0 0;font-size:11px;color:#374151;text-align:center;">
                      © 2025 FUNDO AI &nbsp;·&nbsp; 🇿🇼 Made in Zimbabwe by
                      <span style="color:${PURPLE};font-weight:600;"> Darrell Mucheri</span>
                    </p>
                    <p style="margin:8px 0 0;text-align:center;">
                      <a href="https://fundoai.gleeze.com" style="font-size:11px;color:${MUTED};text-decoration:none;">fundoai.gleeze.com</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── Verification email ─────────────────────────────────── */
export async function sendVerificationEmail(to: string, name: string, code: string) {
  const firstName = name.split(" ")[0];
  const digits = code.split("");

  const body = `
    <!-- Heading -->
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:${WHITE};text-align:center;letter-spacing:-0.5px;">
      Verify your email 🔐
    </h1>
    <p style="margin:0 0 32px;font-size:15px;color:${MUTED};text-align:center;line-height:1.6;">
      Hey <strong style="color:${SOFT};">${firstName}</strong>! Welcome to FUNDO AI.<br/>
      Enter this code to activate your account.
    </p>

    <!-- OTP code block -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td align="center" style="background:linear-gradient(135deg,rgba(168,85,247,0.08),rgba(124,58,237,0.05));border:1px solid rgba(168,85,247,0.25);border-radius:16px;padding:28px 20px;">

          <!-- Digit boxes -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 12px;">
            <tr>
              ${digits.map(d => `
              <td style="padding:0 4px;">
                <div style="width:44px;height:52px;background:rgba(168,85,247,0.12);border:1.5px solid rgba(168,85,247,0.4);border-radius:10px;font-size:28px;font-weight:900;color:${WHITE};text-align:center;line-height:52px;letter-spacing:0;">
                  ${d}
                </div>
              </td>`).join("")}
            </tr>
          </table>

          <p style="margin:0;font-size:12px;color:${MUTED};">
            ⏱ Expires in <strong style="color:${SOFT};">10 minutes</strong>
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA button -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="https://fundoai.gleeze.com/verify-email?email=${encodeURIComponent(to)}" style="display:inline-block;background:linear-gradient(135deg,${PURPLE},#7c3aed);color:${WHITE};font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:12px;letter-spacing:0.2px;">
            Verify My Email →
          </a>
        </td>
      </tr>
    </table>

    <!-- Info box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="background:rgba(6,182,212,0.05);border:1px solid rgba(6,182,212,0.15);border-radius:12px;padding:16px 20px;">
          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.7;">
            <strong style="color:${SOFT};">What is FUNDO AI?</strong><br/>
            Zimbabwe's most advanced AI study assistant — aligned to the ZIMSEC curriculum from Grade 1 through A-Level. Available 24/7 on web and WhatsApp.
          </p>
        </td>
      </tr>
    </table>
  `;

  await transporter.sendMail({
    from: process.env["SMTP_FROM"] || `FUNDO AI <noreply@fundoai.com>`,
    to,
    subject: `${code} is your FUNDO AI verification code`,
    html: base(`Your FUNDO AI verification code is ${code}. It expires in 10 minutes.`, body),
  });
}

/* ── Password reset email ───────────────────────────────── */
export async function sendPasswordResetEmail(to: string, name: string, code: string) {
  const firstName = name.split(" ")[0];
  const digits = code.split("");

  const body = `
    <!-- Heading -->
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:${WHITE};text-align:center;letter-spacing:-0.5px;">
      Reset your password 🔑
    </h1>
    <p style="margin:0 0 32px;font-size:15px;color:${MUTED};text-align:center;line-height:1.6;">
      Hey <strong style="color:${SOFT};">${firstName}</strong>!<br/>
      We received a request to reset your FUNDO AI password.
    </p>

    <!-- OTP code block -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td align="center" style="background:linear-gradient(135deg,rgba(6,182,212,0.07),rgba(8,145,178,0.04));border:1px solid rgba(6,182,212,0.22);border-radius:16px;padding:28px 20px;">

          <!-- Digit boxes -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 12px;">
            <tr>
              ${digits.map(d => `
              <td style="padding:0 4px;">
                <div style="width:44px;height:52px;background:rgba(6,182,212,0.10);border:1.5px solid rgba(6,182,212,0.35);border-radius:10px;font-size:28px;font-weight:900;color:${WHITE};text-align:center;line-height:52px;letter-spacing:0;">
                  ${d}
                </div>
              </td>`).join("")}
            </tr>
          </table>

          <p style="margin:0;font-size:12px;color:${MUTED};">
            ⏱ Expires in <strong style="color:${CYAN};">10 minutes</strong>
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA button -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="https://fundoai.gleeze.com/reset-password?email=${encodeURIComponent(to)}" style="display:inline-block;background:linear-gradient(135deg,${CYAN},#0891b2);color:${WHITE};font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:12px;letter-spacing:0.2px;">
            Reset My Password →
          </a>
        </td>
      </tr>
    </table>

    <!-- Security notice -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.15);border-radius:12px;padding:16px 20px;">
          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.7;">
            <strong style="color:#fca5a5;">🛡️ Security notice:</strong><br/>
            If you did <em>not</em> request a password reset, please ignore this email. Your account is safe and your password has <em>not</em> been changed. No action is required.
          </p>
        </td>
      </tr>
    </table>
  `;

  await transporter.sendMail({
    from: process.env["SMTP_FROM"] || `FUNDO AI <noreply@fundoai.com>`,
    to,
    subject: `${code} — Reset your FUNDO AI password`,
    html: base(`Your FUNDO AI password reset code is ${code}. Expires in 10 minutes.`, body),
  });
}

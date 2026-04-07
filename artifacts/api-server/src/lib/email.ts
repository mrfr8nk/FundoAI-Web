import nodemailer from "nodemailer";

const SMTP_CONFIGURED = !!(process.env["SMTP_HOST"] && process.env["SMTP_USER"] && process.env["SMTP_PASS"]);

const SMTP_PORT = Number(process.env["SMTP_PORT"] || 465);
const transporter = nodemailer.createTransport({
  host: process.env["SMTP_HOST"] || "smtp.gmail.com",
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: process.env["SMTP_USER"],
    pass: process.env["SMTP_PASS"],
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 25000,
});

/* ── Shared design tokens ───────────────────────────────── */
const BG      = "#06030f";
const CARD_BG = "#0f0a1e";
const BORDER  = "#1e1535";
const PURPLE  = "#a855f7";
const CYAN    = "#06b6d4";
const MUTED   = "#6b7280";
const WHITE   = "#ffffff";
const SOFT    = "#c4b5fd";

function base(preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>FUNDO AI</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BG};">
    <tr><td align="center" style="padding:40px 16px;">

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">

        <!-- Gradient header bar -->
        <tr><td style="height:3px;background:linear-gradient(90deg,${PURPLE},${CYAN},${PURPLE});border-radius:3px 3px 0 0;"></td></tr>

        <!-- Card -->
        <tr>
          <td style="background-color:${CARD_BG};border:1px solid ${BORDER};border-top:none;border-radius:0 0 20px 20px;padding:40px 40px 36px;">

            <!-- Logo -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr><td align="center" style="padding-bottom:32px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background:linear-gradient(135deg,${PURPLE},#7c3aed);border-radius:14px;padding:12px 14px;vertical-align:middle;">
                      <span style="font-size:22px;line-height:1;">🤖</span>
                    </td>
                    <td style="padding-left:12px;vertical-align:middle;">
                      <div style="font-size:22px;font-weight:900;letter-spacing:-0.5px;color:${PURPLE};">FUNDO AI</div>
                      <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:${MUTED};margin-top:1px;">Zimbabwe's AI Assistant</div>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            ${body}

            <!-- Card footer -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:36px;border-top:1px solid ${BORDER};">
              <tr><td style="padding-top:24px;">
                <p style="margin:0;font-size:12px;color:${MUTED};text-align:center;line-height:1.6;">
                  This email was sent by <strong style="color:${SOFT};">FUNDO AI</strong>.<br/>
                  If you didn't request this, you can safely ignore it — your account is untouched.
                </p>
                <p style="margin:12px 0 0;font-size:11px;color:#374151;text-align:center;">
                  © 2025 FUNDO AI &nbsp;·&nbsp; 🇿🇼 Made in Zimbabwe by
                  <span style="color:${PURPLE};font-weight:600;"> Darrell Mucheri</span>
                </p>
                <p style="margin:8px 0 0;text-align:center;">
                  <a href="https://fundoai.gleeze.com" style="font-size:11px;color:${MUTED};text-decoration:none;">fundoai.gleeze.com</a>
                </p>
              </td></tr>
            </table>

          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Magic link email ────────────────────────────────────── */
export async function sendMagicLinkEmail(to: string, name: string, link: string, isNew: boolean) {
  if (!SMTP_CONFIGURED) {
    console.warn(`[EMAIL] SMTP not configured. Would have sent magic link to ${to}: ${link}`);
    throw new Error("Email service not configured. Please contact support or set SMTP environment variables.");
  }
  const firstName = name.split(" ")[0];
  const action = isNew ? "Complete signup" : "Sign in";
  const heading = isNew ? "Finish creating your account 🚀" : "Sign in to FUNDO AI 🔐";
  const subtitle = isNew
    ? `Hey <strong style="color:${SOFT};">${firstName}</strong>! One click and you're in.<br/>Your account is ready — just confirm it below.`
    : `Hey <strong style="color:${SOFT};">${firstName}</strong>! Click the button below to sign in.<br/>This link expires in 15 minutes.`;
  const btnLabel = isNew ? "Create My Account →" : "Sign In to FUNDO AI →";
  const btnColor = isNew ? `linear-gradient(135deg,${PURPLE},#7c3aed)` : `linear-gradient(135deg,${CYAN},#0891b2)`;
  const btnShadow = isNew ? "rgba(168,85,247,0.4)" : "rgba(6,182,212,0.4)";
  const boxBorder = isNew ? "rgba(168,85,247,0.25)" : "rgba(6,182,212,0.22)";
  const boxBg = isNew ? "rgba(168,85,247,0.06)" : "rgba(6,182,212,0.06)";

  const body = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:${WHITE};text-align:center;letter-spacing:-0.5px;">${heading}</h1>
    <p style="margin:0 0 32px;font-size:15px;color:${MUTED};text-align:center;line-height:1.6;">${subtitle}</p>

    <!-- CTA box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:${boxBg};border:1px solid ${boxBorder};border-radius:20px;padding:32px 24px;text-align:center;">
          <p style="margin:0 0 24px;font-size:13px;color:${MUTED};line-height:1.6;">
            This is a one-time sign-in link. It works once and expires in <strong style="color:${SOFT};">15 minutes</strong>.
          </p>
          <a href="${link}"
             style="display:inline-block;background:${btnColor};color:${WHITE};font-size:15px;font-weight:800;text-decoration:none;padding:16px 44px;border-radius:14px;letter-spacing:0.2px;box-shadow:0 8px 28px ${btnShadow};">
            ${btnLabel}
          </a>
          <p style="margin:20px 0 0;font-size:11px;color:${MUTED};">Button not working? Copy this link:</p>
          <p style="margin:6px 0 0;font-size:11px;word-break:break-all;">
            <a href="${link}" style="color:${PURPLE};text-decoration:none;">${link}</a>
          </p>
        </td>
      </tr>
    </table>

    <!-- Perks strip (new users only) -->
    ${isNew ? `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:18px 20px;">
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:${WHITE};">What you get with FUNDO AI:</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${[["🧠","Unlimited AI conversations"],["🔍","Live web search & real-time info"],["💾","Chat history saved automatically"],["🎓","Full ZIMSEC curriculum alignment"]].map(([icon,text])=>`
            <tr><td style="padding:4px 0;font-size:13px;color:${MUTED};">${icon}&nbsp; ${text}</td></tr>`).join("")}
          </table>
        </td>
      </tr>
    </table>` : `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.14);border-radius:12px;padding:16px 20px;">
          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.7;">
            <strong style="color:#fca5a5;">🛡️ Security notice:</strong><br/>
            If you didn't request this sign-in link, please ignore this email. Your account is safe and no action is required.
          </p>
        </td>
      </tr>
    </table>`}
  `;

  try {
    await transporter.sendMail({
      from: process.env["SMTP_FROM"] || `FUNDO AI <noreply@fundoai.com>`,
      to,
      subject: isNew ? `Welcome to FUNDO AI — finish your signup` : `Sign in to FUNDO AI`,
      html: base(
        isNew ? `Welcome! Click to finish creating your FUNDO AI account. Link expires in 15 minutes.`
              : `Your FUNDO AI sign-in link is ready. Click to sign in — expires in 15 minutes.`,
        body
      ),
    });
  } catch (smtpErr: any) {
    console.error(`[EMAIL] SMTP sendMail failed for ${to}:`, smtpErr?.message || smtpErr);
    throw smtpErr;
  }
}

/* ── Legacy: kept for backward compatibility ─────────────── */
export async function sendVerificationEmail(to: string, name: string, code: string) {
  const link = `${process.env["APP_URL"] || "https://fundoai.gleeze.com"}/auth/verify?token=${code}`;
  await sendMagicLinkEmail(to, name, link, true);
}

export async function sendPasswordResetEmail(to: string, name: string, code: string) {
  if (!SMTP_CONFIGURED) {
    console.warn(`[EMAIL] SMTP not configured. Password reset code for ${to}: ${code}`);
    throw new Error("Email service not configured. Please contact support or set SMTP environment variables.");
  }
  const digits = code.split("");
  const body = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:${WHITE};text-align:center;letter-spacing:-0.5px;">Reset your password 🔑</h1>
    <p style="margin:0 0 32px;font-size:15px;color:${MUTED};text-align:center;line-height:1.6;">
      Hey <strong style="color:${SOFT};">${name.split(" ")[0]}</strong>! Your password reset code:
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
      <tr><td align="center" style="background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.22);border-radius:16px;padding:28px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 12px;">
          <tr>${digits.map(d=>`<td style="padding:0 4px;"><div style="width:44px;height:52px;background:rgba(6,182,212,0.10);border:1.5px solid rgba(6,182,212,0.35);border-radius:10px;font-size:28px;font-weight:900;color:${WHITE};text-align:center;line-height:52px;">${d}</div></td>`).join("")}</tr>
        </table>
        <p style="margin:0;font-size:12px;color:${MUTED};">⏱ Expires in <strong style="color:${CYAN};">10 minutes</strong></p>
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
      <td style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.15);border-radius:12px;padding:16px 20px;">
        <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.7;"><strong style="color:#fca5a5;">🛡️ Security notice:</strong><br/>If you didn't request a password reset, ignore this email. Your account is safe.</p>
      </td>
    </tr></table>
  `;
  await transporter.sendMail({
    from: process.env["SMTP_FROM"] || `FUNDO AI <noreply@fundoai.com>`,
    to,
    subject: `${code} — Reset your FUNDO AI password`,
    html: base(`Your FUNDO AI password reset code is ${code}. Expires in 10 minutes.`, body),
  });
}

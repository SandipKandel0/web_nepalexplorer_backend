import nodemailer from "nodemailer";
import { HttpError } from "../errors/http-error";

interface ResetEmailInput {
  to: string;
  name: string;
  resetLink: string;
}

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendResetPasswordEmail = async ({ to, name, resetLink }: ResetEmailInput) => {
  const transporter = createTransporter();

  if (!transporter) {
    const requireSmtp = process.env.REQUIRE_SMTP === "true";

    if (requireSmtp) {
      throw new HttpError(
        500,
        "Email service is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS"
      );
    }

    // Fallback mode: keep forgot-password flow working without SMTP.
    console.warn("[MAILER] SMTP is not configured. Password reset email was not sent.");
    console.warn(`[MAILER] To: ${to}`);
    console.warn(`[MAILER] Name: ${name}`);
    console.warn(`[MAILER] Reset link: ${resetLink}`);
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@webnepal.local";

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to continue.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 16px;text-decoration:none;border-radius:8px;">
            Reset Password
          </a>
        </p>
        <p>Warning: If you did not request this reset, please ignore this email.</p>
      </div>
    `,
  });
};

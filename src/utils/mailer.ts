import nodemailer from "nodemailer";
import { HttpError } from "../errors/http-error";

interface ResetEmailInput {
  to: string;
  name: string;
  resetLink: string;
  role?: "user" | "guide";
}

const DEFAULT_ALLOWED_RESET_EMAILS = [
  "itsmesandip.0@gmail.com",
  "sandeepkandel45@gmail.com",
];

const getAllowedResetEmails = () => {
  const configured = process.env.RESET_PASSWORD_ALLOWED_EMAILS;
  if (!configured) {
    return DEFAULT_ALLOWED_RESET_EMAILS;
  }

  return configured
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

const isAllowedResetRecipient = (email: string) => {
  const normalized = email.trim().toLowerCase();
  return getAllowedResetEmails().includes(normalized);
};

const createTransporter = (role: "user" | "guide") => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const defaultUser = process.env.SMTP_USER;
  const defaultPass = process.env.SMTP_PASS;

  const user =
    role === "guide"
      ? process.env.SMTP_USER_GUIDE || defaultUser
      : process.env.SMTP_USER_USER || defaultUser;

  const pass =
    role === "guide"
      ? process.env.SMTP_PASS_GUIDE || defaultPass
      : process.env.SMTP_PASS_USER || defaultPass;

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

export const sendResetPasswordEmail = async ({ to, name, resetLink, role = "user" }: ResetEmailInput) => {
  // Restrict password reset delivery to explicit addresses only.
  if (!isAllowedResetRecipient(to)) {
    return;
  }

  const transporter = createTransporter(role);

  if (!transporter) {
    const requireSmtp = process.env.REQUIRE_SMTP === "true";

    if (requireSmtp) {
      throw new HttpError(
        500,
        "Email service is not configured. Please set SMTP_HOST/SMTP_PORT and SMTP credentials (SMTP_USER/SMTP_PASS or role-specific SMTP_USER_GUIDE/SMTP_PASS_GUIDE)"
      );
    }

    // Fallback mode: keep forgot-password flow working without SMTP.
    console.warn("[MAILER] SMTP is not configured. Password reset email was not sent.");
    console.warn(`[MAILER] To: ${to}`);
    console.warn(`[MAILER] Name: ${name}`);
    console.warn(`[MAILER] Reset link: ${resetLink}`);
    return;
  }

  const fallbackFrom = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@webnepal.local";
  const userFrom = process.env.SMTP_FROM_USER || fallbackFrom;
  const guideFrom = process.env.SMTP_FROM_GUIDE || fallbackFrom;
  const from = role === "guide" ? guideFrom : userFrom;

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

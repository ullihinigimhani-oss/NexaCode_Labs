import nodemailer from 'nodemailer';
import ApiError from '../utils/ApiError.js';
import { env, isProduction } from './env.js';

function hasSmtpConfig() {
  return Boolean(env.SMTP_HOST && env.SMTP_PORT);
}

let transporter;

if (hasSmtpConfig()) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
  });
}

export function assertEmailDeliveryConfigured() {
  if (transporter || (env.DEV_LOG_EMAIL_CONTENT && !isProduction())) {
    return;
  }

  throw new ApiError(
    503,
    'Email delivery is not configured. Configure SMTP or enable DEV_LOG_EMAIL_CONTENT in development.',
  );
}

export async function sendMail({ html, subject, text, to }) {
  assertEmailDeliveryConfigured();

  if (transporter) {
    await transporter.sendMail({
      from: env.MAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    return;
  }

  console.info('[DEV EMAIL FALLBACK]', {
    to,
    subject,
    text,
    html,
  });
}

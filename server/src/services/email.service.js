import { env } from '../config/env.js';
import { sendMail } from '../config/mailer.js';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendVerificationEmail(user, token) {
  const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;
  const name = escapeHtml(user.first_name || user.firstName || 'there');

  await sendMail({
    to: user.email,
    subject: 'Verify your NexaCode Labs email',
    text: `Hello ${user.first_name || user.firstName || 'there'},\n\nVerify your NexaCode Labs account using this link:\n${verificationUrl}\n\nThis link expires in 24 hours. If you did not create an account, you can ignore this email.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;color:#0F172A;line-height:1.6">
        <h2 style="color:#0B1220">Verify your email</h2>
        <p>Hello ${name},</p>
        <p>Confirm your email address to complete your NexaCode Labs account setup.</p>
        <p><a href="${verificationUrl}" style="display:inline-block;background:#2563EB;color:#FFFFFF;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">Verify email</a></p>
        <p style="color:#64748B;font-size:14px">This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetOtp(user, otp) {
  const name = escapeHtml(user.first_name || user.firstName || 'there');
  const safeOtp = escapeHtml(otp);

  await sendMail({
    to: user.email,
    subject: 'Your NexaCode Labs password reset code',
    text: `Hello ${user.first_name || user.firstName || 'there'},\n\nYour NexaCode Labs password reset code is ${otp}.\n\nThis code expires in 10 minutes. Do not share this code with anyone.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;color:#0F172A;line-height:1.6">
        <h2 style="color:#0B1220">Password reset code</h2>
        <p>Hello ${name},</p>
        <p>Use this secure code to continue your password reset:</p>
        <p style="font-size:28px;letter-spacing:6px;font-weight:800;color:#2563EB">${safeOtp}</p>
        <p style="color:#64748B;font-size:14px">This code expires in 10 minutes. Do not share this code with anyone.</p>
      </div>
    `,
  });
}

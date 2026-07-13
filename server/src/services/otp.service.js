import { env } from '../config/env.js';
import { addMinutes, generateSixDigitOtp, hmacSha256, safeEqual } from '../utils/crypto.js';

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_RESENDS = 5;

export function createOtp() {
  const otp = generateSixDigitOtp();
  return {
    otp,
    otpHash: hashOtp(otp),
    expiresAt: addMinutes(new Date(), OTP_EXPIRY_MINUTES),
  };
}

export function hashOtp(otp) {
  return hmacSha256(String(otp).trim(), env.PASSWORD_RESET_SECRET);
}

export function isOtpMatch(otp, otpHash) {
  return safeEqual(hashOtp(otp), otpHash);
}

export function isExpired(date) {
  return new Date(date).getTime() <= Date.now();
}

export function isWithinResendCooldown(lastSentAt) {
  if (!lastSentAt) {
    return false;
  }

  return Date.now() - new Date(lastSentAt).getTime() < OTP_RESEND_COOLDOWN_SECONDS * 1000;
}

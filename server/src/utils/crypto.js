import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

export function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

export function hmacSha256(value, secret) {
  return createHmac('sha256', secret).update(value, 'utf8').digest('hex');
}

export function generateRandomToken(bytes = 32) {
  return randomBytes(bytes).toString('hex');
}

export function generateSixDigitOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

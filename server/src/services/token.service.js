import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { addDays, generateRandomToken, sha256 } from '../utils/crypto.js';

function durationToMs(duration) {
  const match = /^(\d+)([smhd])$/.exec(duration);

  if (!match) {
    throw new Error(`Unsupported duration format: ${duration}`);
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}

export function getRefreshTokenExpiryDate() {
  return new Date(Date.now() + durationToMs(env.JWT_REFRESH_EXPIRES_IN));
}

export function getPasswordResetExpiryDate() {
  return new Date(Date.now() + durationToMs(env.PASSWORD_RESET_EXPIRES_IN));
}

export function generateRefreshToken() {
  return generateRandomToken(48);
}

export function hashRefreshToken(token) {
  return sha256(token);
}

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
      email: user.email,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

export function signRefreshJwt(user, rawRefreshToken) {
  return jwt.sign(
    {
      sub: String(user.id),
      tokenHash: hashRefreshToken(rawRefreshToken),
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
  );
}

export function verifyRefreshJwt(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

export function signPasswordResetToken({ otpId, passwordChangedAt, userId }) {
  return jwt.sign(
    {
      sub: String(userId),
      otpId,
      purpose: 'password_reset',
      passwordChangedAt: passwordChangedAt ? new Date(passwordChangedAt).toISOString() : null,
    },
    env.PASSWORD_RESET_SECRET,
    {
      expiresIn: env.PASSWORD_RESET_EXPIRES_IN,
    },
  );
}

export function verifyPasswordResetToken(token) {
  const payload = jwt.verify(token, env.PASSWORD_RESET_SECRET);

  if (payload.purpose !== 'password_reset') {
    throw new Error('Invalid reset token purpose.');
  }

  return payload;
}

export function createEmailVerificationExpiryDate() {
  return addDays(new Date(), 1);
}

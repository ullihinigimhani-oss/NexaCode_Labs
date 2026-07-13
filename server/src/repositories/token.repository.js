import { pool } from '../config/database.js';

export async function createEmailVerificationToken({ expiresAt, tokenHash, userId }, db = pool) {
  const [result] = await db.execute(
    `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [userId, tokenHash, expiresAt],
  );
  return result.insertId;
}

export async function findEmailVerificationTokenByHash(tokenHash, db = pool) {
  const [rows] = await db.execute(
    `SELECT *
     FROM email_verification_tokens
     WHERE token_hash = ?
     LIMIT 1`,
    [tokenHash],
  );
  return rows[0] || null;
}

export async function markEmailVerificationTokenUsed(tokenId, db = pool) {
  await db.execute(
    `UPDATE email_verification_tokens
     SET used_at = COALESCE(used_at, CURRENT_TIMESTAMP)
     WHERE id = ?`,
    [tokenId],
  );
}

export async function markUnusedEmailVerificationTokensUsed(userId, db = pool) {
  await db.execute(
    `UPDATE email_verification_tokens
     SET used_at = CURRENT_TIMESTAMP
     WHERE user_id = ? AND used_at IS NULL`,
    [userId],
  );
}

export async function markActivePasswordResetOtpsUsed(userId, db = pool) {
  await db.execute(
    `UPDATE password_reset_otps
     SET used_at = CURRENT_TIMESTAMP
     WHERE user_id = ? AND used_at IS NULL`,
    [userId],
  );
}

export async function createPasswordResetOtp(
  { expiresAt, lastSentAt, otpHash, resendCount = 0, userId },
  db = pool,
) {
  const [result] = await db.execute(
    `INSERT INTO password_reset_otps (
       user_id,
       otp_hash,
       expires_at,
       resend_count,
       last_sent_at
     )
     VALUES (?, ?, ?, ?, ?)`,
    [userId, otpHash, expiresAt, resendCount, lastSentAt],
  );
  return result.insertId;
}

export async function findLatestActivePasswordResetOtp(userId, db = pool) {
  const [rows] = await db.execute(
    `SELECT *
     FROM password_reset_otps
     WHERE user_id = ? AND used_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId],
  );
  return rows[0] || null;
}

export async function findLatestPasswordResetOtp(userId, db = pool) {
  const [rows] = await db.execute(
    `SELECT *
     FROM password_reset_otps
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId],
  );
  return rows[0] || null;
}

export async function findPasswordResetOtpById(id, db = pool) {
  const [rows] = await db.execute(
    `SELECT *
     FROM password_reset_otps
     WHERE id = ?
     LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}

export async function incrementPasswordResetOtpAttempt(id, db = pool) {
  await db.execute(
    `UPDATE password_reset_otps
     SET attempt_count = attempt_count + 1
     WHERE id = ?`,
    [id],
  );
}

export async function markPasswordResetOtpUsed(id, db = pool) {
  await db.execute(
    `UPDATE password_reset_otps
     SET used_at = COALESCE(used_at, CURRENT_TIMESTAMP)
     WHERE id = ?`,
    [id],
  );
}

export async function createRefreshToken(
  { expiresAt, ipAddress, tokenHash, userAgent, userId },
  db = pool,
) {
  const [result] = await db.execute(
    `INSERT INTO refresh_tokens (
       user_id,
       token_hash,
       expires_at,
       ip_address,
       user_agent
     )
     VALUES (?, ?, ?, ?, ?)`,
    [userId, tokenHash, expiresAt, ipAddress, userAgent],
  );
  return result.insertId;
}

export async function findRefreshTokenByHash(tokenHash, db = pool) {
  const [rows] = await db.execute(
    `SELECT *
     FROM refresh_tokens
     WHERE token_hash = ?
     LIMIT 1`,
    [tokenHash],
  );
  return rows[0] || null;
}

export async function revokeRefreshToken(id, replacedByTokenId = null, db = pool) {
  await db.execute(
    `UPDATE refresh_tokens
     SET revoked_at = COALESCE(revoked_at, CURRENT_TIMESTAMP),
         replaced_by_token_id = COALESCE(replaced_by_token_id, ?)
     WHERE id = ?`,
    [replacedByTokenId, id],
  );
}

export async function revokeRefreshTokenByHash(tokenHash, db = pool) {
  await db.execute(
    `UPDATE refresh_tokens
     SET revoked_at = COALESCE(revoked_at, CURRENT_TIMESTAMP)
     WHERE token_hash = ?`,
    [tokenHash],
  );
}

export async function revokeActiveRefreshTokensForUser(userId, db = pool) {
  await db.execute(
    `UPDATE refresh_tokens
     SET revoked_at = COALESCE(revoked_at, CURRENT_TIMESTAMP)
     WHERE user_id = ? AND revoked_at IS NULL`,
    [userId],
  );
}

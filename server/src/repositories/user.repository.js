import { pool } from '../config/database.js';

export function toSafeUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    status: row.status,
    isEmailVerified: Boolean(row.is_email_verified),
    emailVerifiedAt: row.email_verified_at,
    failedLoginAttempts: row.failed_login_attempts,
    lockedUntil: row.locked_until,
    lastLoginAt: row.last_login_at,
    passwordChangedAt: row.password_changed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findUserByEmail(email, db = pool) {
  const [rows] = await db.execute(
    `SELECT *
     FROM users
     WHERE email = ? AND deleted_at IS NULL
     LIMIT 1`,
    [email],
  );
  return rows[0] || null;
}

export async function findUserById(id, db = pool) {
  const [rows] = await db.execute(
    `SELECT *
     FROM users
     WHERE id = ? AND deleted_at IS NULL
     LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}

export async function createUser({ email, firstName, lastName, passwordHash, phone }, db = pool) {
  const [result] = await db.execute(
    `INSERT INTO users (
       first_name,
       last_name,
       email,
       phone,
       password_hash,
       role,
       status,
       password_changed_at
     )
     VALUES (?, ?, ?, ?, ?, 'USER', 'ACTIVE', CURRENT_TIMESTAMP)`,
    [firstName, lastName, email, phone, passwordHash],
  );
  return result.insertId;
}

export async function markUserEmailVerified(userId, db = pool) {
  await db.execute(
    `UPDATE users
     SET is_email_verified = 1,
         email_verified_at = COALESCE(email_verified_at, CURRENT_TIMESTAMP)
     WHERE id = ?`,
    [userId],
  );
}

export async function updateFailedLoginState(userId, failedAttempts, lockedUntil, db = pool) {
  await db.execute(
    `UPDATE users
     SET failed_login_attempts = ?,
         locked_until = ?
     WHERE id = ?`,
    [failedAttempts, lockedUntil, userId],
  );
}

export async function clearFailedLoginState(userId, db = pool) {
  await db.execute(
    `UPDATE users
     SET failed_login_attempts = 0,
         locked_until = NULL
     WHERE id = ?`,
    [userId],
  );
}

export async function updateSuccessfulLogin(userId, db = pool) {
  await db.execute(
    `UPDATE users
     SET failed_login_attempts = 0,
         locked_until = NULL,
         last_login_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [userId],
  );
}

export async function updatePassword(userId, passwordHash, db = pool) {
  await db.execute(
    `UPDATE users
     SET password_hash = ?,
         password_changed_at = CURRENT_TIMESTAMP,
         failed_login_attempts = 0,
         locked_until = NULL
     WHERE id = ?`,
    [passwordHash, userId],
  );
}

export async function listSafeUsers({ limit, offset }, db = pool) {
  const [rows] = await db.execute(
    `SELECT id,
            first_name,
            last_name,
            email,
            phone,
            role,
            status,
            is_email_verified,
            email_verified_at,
            failed_login_attempts,
            locked_until,
            last_login_at,
            password_changed_at,
            created_at,
            updated_at
     FROM users
     WHERE deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset],
  );

  const [[countRow]] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM users
     WHERE deleted_at IS NULL`,
  );

  return {
    users: rows.map(toSafeUser),
    total: countRow.total,
  };
}

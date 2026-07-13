import { pool } from '../config/database.js';

export async function createAuditLog(
  {
    action,
    entityId = null,
    entityType = null,
    ipAddress = null,
    metadata = null,
    userAgent = null,
    userId = null,
  },
  db = pool,
) {
  await db.execute(
    `INSERT INTO audit_logs (
       user_id,
       action,
       entity_type,
       entity_id,
       ip_address,
       user_agent,
       metadata
     )
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      action,
      entityType,
      entityId,
      ipAddress,
      userAgent,
      metadata ? JSON.stringify(metadata) : null,
    ],
  );
}

export async function createLoginAttempt(
  {
    emailAttempted,
    failureReason = null,
    ipAddress = null,
    userAgent = null,
    userId = null,
    wasSuccessful,
  },
  db = pool,
) {
  await db.execute(
    `INSERT INTO login_attempts (
       user_id,
       email_attempted,
       ip_address,
       user_agent,
       was_successful,
       failure_reason
     )
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, emailAttempted, ipAddress, userAgent, wasSuccessful ? 1 : 0, failureReason],
  );
}

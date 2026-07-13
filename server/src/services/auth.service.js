import bcrypt from 'bcrypt';
import ApiError from '../utils/ApiError.js';
import { addMinutes, generateRandomToken, normalizeEmail, sha256 } from '../utils/crypto.js';
import { withTransaction } from '../config/database.js';
import { assertEmailDeliveryConfigured } from '../config/mailer.js';
import { env } from '../config/env.js';
import {
  createAuditLog,
  createLoginAttempt,
} from '../repositories/audit.repository.js';
import {
  clearFailedLoginState,
  createUser,
  findUserByEmail,
  findUserById,
  listSafeUsers,
  markUserEmailVerified,
  toSafeUser,
  updateFailedLoginState,
  updatePassword,
  updateSuccessfulLogin,
} from '../repositories/user.repository.js';
import {
  createEmailVerificationToken,
  createPasswordResetOtp,
  createRefreshToken,
  findEmailVerificationTokenByHash,
  findLatestActivePasswordResetOtp,
  findLatestPasswordResetOtp,
  findPasswordResetOtpById,
  findRefreshTokenByHash,
  incrementPasswordResetOtpAttempt,
  markActivePasswordResetOtpsUsed,
  markEmailVerificationTokenUsed,
  markPasswordResetOtpUsed,
  markUnusedEmailVerificationTokensUsed,
  revokeActiveRefreshTokensForUser,
  revokeRefreshToken,
  revokeRefreshTokenByHash,
} from '../repositories/token.repository.js';
import { sendPasswordResetOtp, sendVerificationEmail } from './email.service.js';
import {
  createEmailVerificationExpiryDate,
  getRefreshTokenExpiryDate,
  hashRefreshToken,
  signAccessToken,
  signPasswordResetToken,
  signRefreshJwt,
  verifyPasswordResetToken,
  verifyRefreshJwt,
} from './token.service.js';
import {
  createOtp,
  isExpired,
  isOtpMatch,
  isWithinResendCooldown,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_RESENDS,
} from './otp.service.js';

const EMAIL_VERIFICATION_GENERIC_MESSAGE =
  'If the account requires verification, a new verification email will be sent.';
const PASSWORD_RESET_GENERIC_MESSAGE =
  'If an account exists for that email, a verification code will be sent.';

function invalidCredentialsError() {
  return new ApiError(401, 'Invalid email or password.');
}

function ensureUserCanAuthenticate(user) {
  if (user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
    throw new ApiError(403, 'This account is not available for sign in.');
  }

  if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
    throw new ApiError(423, 'This account is temporarily locked. Please try again later.');
  }
}

function ensureActiveUser(user) {
  if (!user || user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
    throw new ApiError(401, 'Authentication is required.');
  }
}

function createRefreshTokenValue(user) {
  const rawNonce = generateRandomToken(32);
  return signRefreshJwt(user, rawNonce);
}

async function storeRefreshToken({ db, ipAddress, refreshToken, user, userAgent }) {
  return createRefreshToken(
    {
      userId: user.id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: getRefreshTokenExpiryDate(),
      ipAddress,
      userAgent,
    },
    db,
  );
}

export async function registerUser(payload, meta) {
  const email = normalizeEmail(payload.email);
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(payload.password, env.BCRYPT_ROUNDS);
  const rawVerificationToken = generateRandomToken(32);
  const tokenHash = sha256(rawVerificationToken);
  const expiresAt = createEmailVerificationExpiryDate();

  const userId = await withTransaction(async (db) => {
    const createdUserId = await createUser(
      {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email,
        phone: payload.phone,
        passwordHash,
      },
      db,
    );

    await createEmailVerificationToken(
      {
        userId: createdUserId,
        tokenHash,
        expiresAt,
      },
      db,
    );

    await createAuditLog(
      {
        userId: createdUserId,
        action: 'USER_REGISTERED',
        entityType: 'users',
        entityId: createdUserId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
      db,
    );

    return createdUserId;
  });

  const user = await findUserById(userId);
  await sendVerificationEmail(user, rawVerificationToken);

  return {
    user: toSafeUser(user),
  };
}

export async function verifyEmail(rawToken, meta) {
  const tokenHash = sha256(rawToken);
  const token = await findEmailVerificationTokenByHash(tokenHash);

  if (!token || token.used_at || isExpired(token.expires_at)) {
    throw new ApiError(400, 'Verification link is invalid or expired.');
  }

  const user = await findUserById(token.user_id);

  if (!user) {
    throw new ApiError(400, 'Verification link is invalid or expired.');
  }

  await withTransaction(async (db) => {
    await markUserEmailVerified(user.id, db);
    await markEmailVerificationTokenUsed(token.id, db);
    await createAuditLog(
      {
        userId: user.id,
        action: 'EMAIL_VERIFIED',
        entityType: 'users',
        entityId: user.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
      db,
    );
  });

  const updatedUser = await findUserById(user.id);
  return {
    user: toSafeUser(updatedUser),
  };
}

export async function resendEmailVerification(emailInput, meta) {
  assertEmailDeliveryConfigured();

  const email = normalizeEmail(emailInput);
  const user = await findUserByEmail(email);

  if (!user || user.is_email_verified) {
    return {};
  }

  const rawVerificationToken = generateRandomToken(32);
  const tokenHash = sha256(rawVerificationToken);

  await withTransaction(async (db) => {
    await markUnusedEmailVerificationTokensUsed(user.id, db);
    await createEmailVerificationToken(
      {
        userId: user.id,
        tokenHash,
        expiresAt: createEmailVerificationExpiryDate(),
      },
      db,
    );
    await createAuditLog(
      {
        userId: user.id,
        action: 'EMAIL_VERIFICATION_RESENT',
        entityType: 'users',
        entityId: user.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
      db,
    );
  });

  await sendVerificationEmail(user, rawVerificationToken);
  return {};
}

export async function loginUser({ email: emailInput, password }, meta) {
  const email = normalizeEmail(emailInput);
  const user = await findUserByEmail(email);

  if (!user) {
    await bcrypt.hash(password, env.BCRYPT_ROUNDS);
    await createLoginAttempt({
      emailAttempted: email,
      failureReason: 'INVALID_CREDENTIALS',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      wasSuccessful: false,
    });
    throw invalidCredentialsError();
  }

  try {
    ensureUserCanAuthenticate(user);
  } catch (error) {
    await createLoginAttempt({
      userId: user.id,
      emailAttempted: email,
      failureReason: error.statusCode === 423 ? 'ACCOUNT_LOCKED' : 'ACCOUNT_UNAVAILABLE',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      wasSuccessful: false,
    });
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    const failedAttempts = Number(user.failed_login_attempts || 0) + 1;
    const lockedUntil = failedAttempts >= 5 ? addMinutes(new Date(), 15) : null;

    await withTransaction(async (db) => {
      await updateFailedLoginState(user.id, failedAttempts, lockedUntil, db);
      await createLoginAttempt(
        {
          userId: user.id,
          emailAttempted: email,
          failureReason: lockedUntil ? 'ACCOUNT_LOCKED_AFTER_FAILURES' : 'INVALID_CREDENTIALS',
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
          wasSuccessful: false,
        },
        db,
      );
    });

    if (lockedUntil) {
      throw new ApiError(423, 'Too many failed attempts. This account is temporarily locked.');
    }

    throw invalidCredentialsError();
  }

  const refreshToken = createRefreshTokenValue(user);

  await withTransaction(async (db) => {
    await updateSuccessfulLogin(user.id, db);
    await storeRefreshToken({
      db,
      user,
      refreshToken,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    await createLoginAttempt(
      {
        userId: user.id,
        emailAttempted: email,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        wasSuccessful: true,
      },
      db,
    );
    await createAuditLog(
      {
        userId: user.id,
        action: 'USER_LOGGED_IN',
        entityType: 'users',
        entityId: user.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
      db,
    );
  });

  const updatedUser = await findUserById(user.id);
  return {
    accessToken: signAccessToken(updatedUser),
    refreshToken,
    user: toSafeUser(updatedUser),
  };
}

export async function refreshAccessToken(refreshToken, meta) {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required.');
  }

  let payload;
  try {
    payload = verifyRefreshJwt(refreshToken);
  } catch {
    throw new ApiError(401, 'Refresh token is invalid or expired.');
  }

  const tokenHash = hashRefreshToken(refreshToken);
  const storedToken = await findRefreshTokenByHash(tokenHash);

  if (
    !storedToken ||
    storedToken.revoked_at ||
    new Date(storedToken.expires_at).getTime() <= Date.now() ||
    Number(storedToken.user_id) !== Number(payload.sub)
  ) {
    throw new ApiError(401, 'Refresh token is invalid or expired.');
  }

  const user = await findUserById(storedToken.user_id);
  ensureActiveUser(user);

  const newRefreshToken = createRefreshTokenValue(user);

  await withTransaction(async (db) => {
    const newTokenId = await storeRefreshToken({
      db,
      user,
      refreshToken: newRefreshToken,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    await revokeRefreshToken(storedToken.id, newTokenId, db);
    await createAuditLog(
      {
        userId: user.id,
        action: 'REFRESH_TOKEN_ROTATED',
        entityType: 'refresh_tokens',
        entityId: storedToken.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
      db,
    );
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken: newRefreshToken,
    user: toSafeUser(user),
  };
}

export async function logoutUser(refreshToken, meta) {
  if (refreshToken) {
    await revokeRefreshTokenByHash(hashRefreshToken(refreshToken));

    try {
      const payload = verifyRefreshJwt(refreshToken);
      await createAuditLog({
        userId: Number(payload.sub),
        action: 'USER_LOGGED_OUT',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });
    } catch {
      // Logout intentionally succeeds even for invalid or expired tokens.
    }
  }
}

export async function forgotPassword(emailInput) {
  assertEmailDeliveryConfigured();

  const email = normalizeEmail(emailInput);
  const user = await findUserByEmail(email);

  if (!user || user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
    return {};
  }

  const otpData = createOtp();

  await withTransaction(async (db) => {
    await markActivePasswordResetOtpsUsed(user.id, db);
    await createPasswordResetOtp(
      {
        userId: user.id,
        otpHash: otpData.otpHash,
        expiresAt: otpData.expiresAt,
        resendCount: 0,
        lastSentAt: new Date(),
      },
      db,
    );
    await createAuditLog(
      {
        userId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'users',
        entityId: user.id,
      },
      db,
    );
  });

  await sendPasswordResetOtp(user, otpData.otp);
  return {};
}

export async function verifyResetOtp({ email: emailInput, otp }, meta) {
  const email = normalizeEmail(emailInput);
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(400, 'OTP is invalid or expired.');
  }

  const record = await findLatestActivePasswordResetOtp(user.id);

  if (!record || isExpired(record.expires_at) || Number(record.attempt_count) >= OTP_MAX_ATTEMPTS) {
    throw new ApiError(400, 'OTP is invalid or expired.');
  }

  if (!isOtpMatch(otp, record.otp_hash)) {
    await incrementPasswordResetOtpAttempt(record.id);
    throw new ApiError(400, 'OTP is invalid or expired.');
  }

  await withTransaction(async (db) => {
    await markPasswordResetOtpUsed(record.id, db);
    await createAuditLog(
      {
        userId: user.id,
        action: 'PASSWORD_RESET_OTP_VERIFIED',
        entityType: 'password_reset_otps',
        entityId: record.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
      db,
    );
  });

  return {
    resetToken: signPasswordResetToken({
      userId: user.id,
      otpId: record.id,
      passwordChangedAt: user.password_changed_at,
    }),
  };
}

export async function resendPasswordResetOtp(emailInput) {
  assertEmailDeliveryConfigured();

  const email = normalizeEmail(emailInput);
  const user = await findUserByEmail(email);

  if (!user || user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
    return {};
  }

  const latestOtp = await findLatestPasswordResetOtp(user.id);

  if (latestOtp) {
    if (isWithinResendCooldown(latestOtp.last_sent_at)) {
      return {};
    }

    if (Number(latestOtp.resend_count || 0) >= OTP_MAX_RESENDS) {
      return {};
    }
  }

  const resendCount = latestOtp ? Number(latestOtp.resend_count || 0) + 1 : 1;
  const otpData = createOtp();

  await withTransaction(async (db) => {
    await markActivePasswordResetOtpsUsed(user.id, db);
    await createPasswordResetOtp(
      {
        userId: user.id,
        otpHash: otpData.otpHash,
        expiresAt: otpData.expiresAt,
        resendCount,
        lastSentAt: new Date(),
      },
      db,
    );
  });

  await sendPasswordResetOtp(user, otpData.otp);
  return {};
}

export async function resetPassword({ confirmPassword: _confirmPassword, newPassword, resetToken }, meta) {
  let payload;

  try {
    payload = verifyPasswordResetToken(resetToken);
  } catch {
    throw new ApiError(401, 'Password reset session is invalid or expired.');
  }

  const user = await findUserById(payload.sub);
  const otp = await findPasswordResetOtpById(payload.otpId);

  if (!user || !otp || Number(otp.user_id) !== Number(user.id) || !otp.used_at) {
    throw new ApiError(401, 'Password reset session is invalid or expired.');
  }

  if (user.password_changed_at) {
    const changedAtSeconds = Math.floor(new Date(user.password_changed_at).getTime() / 1000);
    if (changedAtSeconds > Number(payload.iat)) {
      throw new ApiError(401, 'Password reset session is invalid or expired.');
    }
  }

  const passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);

  await withTransaction(async (db) => {
    await updatePassword(user.id, passwordHash, db);
    await clearFailedLoginState(user.id, db);
    await revokeActiveRefreshTokensForUser(user.id, db);
    await createAuditLog(
      {
        userId: user.id,
        action: 'PASSWORD_RESET_COMPLETED',
        entityType: 'users',
        entityId: user.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
      db,
    );
  });
}

export async function getUserProfile(userId) {
  const user = await findUserById(userId);
  ensureActiveUser(user);
  return {
    user: toSafeUser(user),
  };
}

export async function getAdminUsers({ limit, page }) {
  const offset = (page - 1) * limit;
  const { total, users } = await listSafeUsers({ limit, offset });

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export { EMAIL_VERIFICATION_GENERIC_MESSAGE, PASSWORD_RESET_GENERIC_MESSAGE };

import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { findUserById, toSafeUser } from '../repositories/user.repository.js';
import { verifyAccessToken } from '../services/token.service.js';

function extractBearerToken(req) {
  const header = req.get('authorization') || '';

  if (!header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice('Bearer '.length).trim();
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req);

  if (!token) {
    throw new ApiError(401, 'Access token is required.');
  }

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, 'Access token is invalid or expired.');
  }

  const user = await findUserById(payload.sub);

  if (!user || user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
    throw new ApiError(401, 'Authentication is required.');
  }

  if (user.password_changed_at) {
    const changedAtSeconds = Math.floor(new Date(user.password_changed_at).getTime() / 1000);
    if (changedAtSeconds > Number(payload.iat)) {
      throw new ApiError(401, 'Access token is no longer valid.');
    }
  }

  req.auth = {
    payload,
    user,
    safeUser: toSafeUser(user),
  };

  next();
});

export function requireAdmin(req, _res, next) {
  if (req.auth?.user?.role !== 'ADMIN') {
    return next(new ApiError(403, 'Admin access is required.'));
  }

  return next();
}

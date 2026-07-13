import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import {
  EMAIL_VERIFICATION_GENERIC_MESSAGE,
  PASSWORD_RESET_GENERIC_MESSAGE,
  forgotPassword,
  getAdminUsers,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resendPasswordResetOtp,
  resetPassword,
  verifyEmail,
  verifyResetOtp,
} from '../services/auth.service.js';

const refreshCookieMaxAge = 7 * 24 * 60 * 60 * 1000;

function requestMeta(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.get('user-agent') || null,
  };
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: refreshCookieMaxAge,
    path: '/api/auth',
  };
}

function setRefreshCookie(res, refreshToken) {
  res.cookie(env.COOKIE_NAME, refreshToken, cookieOptions());
}

function clearRefreshCookie(res) {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/api/auth',
  });
}

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body, requestMeta(req));
  sendSuccess(res, 'Account created. Please verify your email address.', data, 201);
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const data = await verifyEmail(req.query.token, requestMeta(req));
  sendSuccess(res, 'Email verified successfully.', data);
});

export const resendVerification = asyncHandler(async (req, res) => {
  await resendEmailVerification(req.body.email, requestMeta(req));
  sendSuccess(res, EMAIL_VERIFICATION_GENERIC_MESSAGE);
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body, requestMeta(req));
  setRefreshCookie(res, data.refreshToken);
  sendSuccess(res, 'Signed in successfully.', {
    accessToken: data.accessToken,
    user: data.user,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[env.COOKIE_NAME];
  const data = await refreshAccessToken(refreshToken, requestMeta(req));
  setRefreshCookie(res, data.refreshToken);
  sendSuccess(res, 'Access token refreshed.', {
    accessToken: data.accessToken,
    user: data.user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[env.COOKIE_NAME];
  await logoutUser(refreshToken, requestMeta(req));
  clearRefreshCookie(res);
  sendSuccess(res, 'Signed out successfully.');
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  await forgotPassword(req.body.email);
  sendSuccess(res, PASSWORD_RESET_GENERIC_MESSAGE);
});

export const verifyResetOtpController = asyncHandler(async (req, res) => {
  const data = await verifyResetOtp(req.body, requestMeta(req));
  sendSuccess(res, 'OTP verified successfully.', data);
});

export const resendResetOtpController = asyncHandler(async (req, res) => {
  await resendPasswordResetOtp(req.body.email);
  sendSuccess(res, PASSWORD_RESET_GENERIC_MESSAGE);
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  await resetPassword(req.body, requestMeta(req));
  clearRefreshCookie(res);
  sendSuccess(res, 'Password reset successfully.');
});

export const me = asyncHandler(async (req, res) => {
  const data = await getUserProfile(req.auth.user.id);
  sendSuccess(res, 'Authenticated user profile.', data);
});

export const adminUsers = asyncHandler(async (req, res) => {
  const data = await getAdminUsers(req.query);
  sendSuccess(res, 'Users retrieved successfully.', data);
});

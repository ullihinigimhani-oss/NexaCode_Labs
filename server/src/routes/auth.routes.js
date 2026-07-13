import { Router } from 'express';
import {
  adminUsers,
  forgotPasswordController,
  login,
  logout,
  me,
  refresh,
  register,
  resendResetOtpController,
  resendVerification,
  resetPasswordController,
  verifyEmailController,
  verifyResetOtpController,
} from '../controllers/auth.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';
import {
  forgotPasswordLimiter,
  loginLimiter,
  otpLimiter,
  resendOtpLimiter,
} from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  adminUsersQuerySchema,
  emailOnlySchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailQuerySchema,
  verifyResetOtpSchema,
} from '../validators/auth.validator.js';

export const authRouter = Router();
export const adminRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.get('/verify-email', validate(verifyEmailQuerySchema, 'query'), verifyEmailController);
authRouter.post(
  '/resend-verification',
  resendOtpLimiter,
  validate(resendVerificationSchema),
  resendVerification,
);
authRouter.post('/login', loginLimiter, validate(loginSchema), login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
authRouter.post('/forgot-password', forgotPasswordLimiter, validate(emailOnlySchema), forgotPasswordController);
authRouter.post('/verify-reset-otp', otpLimiter, validate(verifyResetOtpSchema), verifyResetOtpController);
authRouter.post('/resend-reset-otp', resendOtpLimiter, validate(emailOnlySchema), resendResetOtpController);
authRouter.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);
authRouter.get('/me', requireAuth, me);

adminRouter.get('/users', requireAuth, requireAdmin, validate(adminUsersQuerySchema, 'query'), adminUsers);

import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email address.')
  .max(255)
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Z]/, 'Password must include an uppercase letter.')
  .regex(/[a-z]/, 'Password must include a lowercase letter.')
  .regex(/[0-9]/, 'Password must include a number.')
  .regex(/[^A-Za-z0-9]/, 'Password must include a special character.');

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    email: emailSchema,
    phone: z.string().trim().max(30).optional().or(z.literal('')),
    password: passwordSchema,
    confirmPassword: z.string().min(1),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Terms and Privacy Policy must be accepted.' }),
    }),
  })
  .strict()
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  })
  .transform((values) => ({
    ...values,
    phone: values.phone || null,
  }));

export const verifyEmailQuerySchema = z
  .object({
    token: z.string().trim().min(32),
  })
  .strict();

export const resendVerificationSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1),
  })
  .strict();

export const emailOnlySchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const verifyResetOtpSchema = z
  .object({
    email: emailSchema,
    otp: z.string().trim().regex(/^\d{6}$/, 'OTP must be a six-digit code.'),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    resetToken: z.string().trim().min(20),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1),
  })
  .strict()
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export const adminUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export { passwordSchema };

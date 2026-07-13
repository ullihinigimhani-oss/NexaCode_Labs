import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthHeader from '../../components/auth/AuthHeader.jsx';
import { cn } from '../../utils/cn.js';

const statusContent = {
  'account-created': {
    variant: 'success',
    eyebrow: 'Account setup',
    title: 'Account created successfully',
    message: 'Your NexaCode Labs account setup has been prepared. Sign in once authentication services are connected.',
    actionLabel: 'Sign in',
    actionTo: '/login',
    secondaryLabel: 'Back to home',
    secondaryTo: '/',
  },
  'email-verified': {
    variant: 'success',
    eyebrow: 'Email verification',
    title: 'Email verified',
    message: 'Your email address has been confirmed for the account setup workflow.',
    actionLabel: 'Sign in',
    actionTo: '/login',
    secondaryLabel: 'Back to home',
    secondaryTo: '/',
  },
  'password-reset': {
    variant: 'success',
    eyebrow: 'Password reset',
    title: 'Password reset successfully',
    message: 'Your password reset flow is complete in this frontend preview.',
    actionLabel: 'Sign in',
    actionTo: '/login',
    secondaryLabel: 'Back to home',
    secondaryTo: '/',
  },
  'otp-expired': {
    variant: 'warning',
    eyebrow: 'OTP verification',
    title: 'OTP expired',
    message: 'The verification code expired before it could be confirmed. Request a new OTP to continue.',
    actionLabel: 'Request OTP',
    actionTo: '/forgot-password',
    secondaryLabel: 'Back to sign in',
    secondaryTo: '/login',
  },
  'invalid-verification-link': {
    variant: 'error',
    eyebrow: 'Email verification',
    title: 'Invalid verification link',
    message: 'The verification link could not be recognized. Request a new verification email.',
    actionLabel: 'Create your account',
    actionTo: '/signup',
    secondaryLabel: 'Back to sign in',
    secondaryTo: '/login',
  },
  'account-locked': {
    variant: 'warning',
    eyebrow: 'Account security',
    title: 'Account temporarily locked',
    message: 'Too many failed attempts may temporarily lock an account once backend policy is connected.',
    actionLabel: 'Back to sign in',
    actionTo: '/login',
    secondaryLabel: 'Password help',
    secondaryTo: '/forgot-password',
  },
  info: {
    variant: 'info',
    eyebrow: 'Authentication status',
    title: 'Status information',
    message: 'This page can display authentication notices for future backend workflows.',
    actionLabel: 'Back to home',
    actionTo: '/',
    secondaryLabel: 'Sign in',
    secondaryTo: '/login',
  },
};

const variantStyles = {
  success: {
    icon: CheckCircle,
    iconClassName: 'bg-green-50 text-brand-success ring-green-100',
  },
  error: {
    icon: AlertCircle,
    iconClassName: 'bg-red-50 text-brand-error ring-red-100',
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: 'bg-amber-50 text-amber-600 ring-amber-100',
  },
  info: {
    icon: Info,
    iconClassName: 'bg-blue-50 text-brand-primary ring-blue-100',
  },
};

function AuthStatusPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || 'account-created';
  const fallback = statusContent[code] || statusContent.info;
  const variant = searchParams.get('type') || fallback.variant;
  const content = {
    ...fallback,
    variant,
    title: searchParams.get('title') || fallback.title,
    message: searchParams.get('message') || fallback.message,
    actionLabel: searchParams.get('actionLabel') || fallback.actionLabel,
    actionTo: searchParams.get('next') || fallback.actionTo,
    secondaryLabel: searchParams.get('secondaryLabel') || fallback.secondaryLabel,
    secondaryTo: searchParams.get('secondary') || fallback.secondaryTo,
  };
  const config = variantStyles[content.variant] || variantStyles.info;
  const Icon = code === 'account-locked' ? Lock : config.icon;

  return (
    <div className="space-y-7 text-center">
      <div
        className={cn(
          'auth-success-pop mx-auto inline-flex h-16 w-16 items-center justify-center rounded-brand ring-1 ring-inset',
          config.iconClassName,
        )}
      >
        <Icon aria-hidden="true" size={30} />
      </div>

      <AuthHeader
        align="center"
        description={content.message}
        eyebrow={content.eyebrow}
        title={content.title}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          className="inline-flex h-12 items-center justify-center rounded-brand bg-brand-primary px-5 text-base font-semibold text-white shadow-soft transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to={content.actionTo}
        >
          {content.actionLabel}
        </Link>
        {content.secondaryLabel ? (
          <Link
            className="inline-flex h-12 items-center justify-center rounded-brand border border-brand-border bg-white px-5 text-base font-semibold text-brand-text shadow-soft transition-colors duration-150 hover:border-brand-primary hover:bg-brand-light hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            to={content.secondaryTo}
          >
            {content.secondaryLabel}
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3 text-left text-sm text-brand-muted">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
          Preview other states
        </p>
        <Link
          className="rounded-brand border border-brand-border bg-brand-light px-4 py-3 font-semibold transition-colors duration-150 hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/auth/status?code=email-verified"
        >
          Email verified status
        </Link>
        <Link
          className="rounded-brand border border-brand-border bg-brand-light px-4 py-3 font-semibold transition-colors duration-150 hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/auth/status?code=otp-expired"
        >
          OTP expired status
        </Link>
        <Link
          className="rounded-brand border border-brand-border bg-brand-light px-4 py-3 font-semibold transition-colors duration-150 hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/auth/status?code=account-locked"
        >
          Account temporarily locked status
        </Link>
      </div>
    </div>
  );
}

export default AuthStatusPage;

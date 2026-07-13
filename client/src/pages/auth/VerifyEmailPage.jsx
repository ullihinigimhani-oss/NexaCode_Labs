import { CheckCircle, Loader2, MailCheck, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import AuthAlert from '../../components/auth/AuthAlert.jsx';
import AuthHeader from '../../components/auth/AuthHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import { maskEmail } from '../../utils/authValidation.js';

function VerifyEmailPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const email = location.state?.email || 'lihini@nexacodelabs.com';
  const requestedState = searchParams.get('state');
  const [screenState, setScreenState] = useState(requestedState || 'checking');
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    if (screenState !== 'checking') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setScreenState('success');
    }, 900);

    return () => window.clearTimeout(timer);
  }, [screenState]);

  const handleResend = () => {
    setResendMessage('A verification email step is ready for this frontend preview.');
  };

  if (screenState === 'checking') {
    return (
      <div className="space-y-7">
        <AuthHeader
          description={`Checking the verification link for ${maskEmail(email)}.`}
          eyebrow="Email verification"
          title="Verify your email"
        />
        <div className="rounded-brand border border-brand-border bg-brand-light p-6 text-center">
          <Loader2 aria-hidden="true" className="mx-auto animate-spin text-brand-primary" size={32} />
          <p className="mt-4 text-sm font-semibold text-brand-text">Checking verification</p>
          <p className="mt-2 text-sm leading-6 text-brand-muted">
            This screen previews the verification state before backend checks are connected.
          </p>
        </div>
      </div>
    );
  }

  if (screenState === 'success') {
    return (
      <div className="space-y-7">
        <AuthHeader
          description="Your email address passed the verification preview."
          eyebrow="Email verification"
          title="Verify your email"
        />
        <AuthAlert title="Verification successful" variant="success">
          <p>Your account setup can continue to the status confirmation page.</p>
        </AuthAlert>
        <Link
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-brand bg-brand-primary px-5 text-base font-semibold text-white shadow-soft transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/auth/status?code=account-created"
        >
          <CheckCircle aria-hidden="true" size={18} />
          Continue
        </Link>
      </div>
    );
  }

  if (screenState === 'expired') {
    return (
      <div className="space-y-7">
        <AuthHeader
          description="The email verification link is no longer active."
          eyebrow="Email verification"
          title="Verify your email"
        />
        <AuthAlert title="Expired verification link" variant="warning">
          <p>Request a new verification email to continue account setup.</p>
        </AuthAlert>
        {resendMessage ? (
          <AuthAlert title="Verification email requested" variant="success">
            <p>{resendMessage}</p>
          </AuthAlert>
        ) : null}
        <Button className="w-full" onClick={handleResend} size="lg" type="button">
          <RefreshCw aria-hidden="true" size={18} />
          Resend verification email
        </Button>
        <Link
          className="block text-center text-sm font-semibold text-brand-primary transition-colors duration-150 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/login"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <AuthHeader
        description="This verification link could not be recognized."
        eyebrow="Email verification"
        title="Verify your email"
      />
      <AuthAlert title="Invalid verification link" variant="error">
        <p>Use the newest verification email or request a new one.</p>
      </AuthAlert>
      {resendMessage ? (
        <AuthAlert title="Verification email requested" variant="success">
          <p>{resendMessage}</p>
        </AuthAlert>
      ) : null}
      <Button className="w-full" onClick={handleResend} size="lg" type="button">
        <MailCheck aria-hidden="true" size={18} />
        Resend verification email
      </Button>
      <Link
        className="block text-center text-sm font-semibold text-brand-primary transition-colors duration-150 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        to="/signup"
      >
        Create your account
      </Link>
    </div>
  );
}

export default VerifyEmailPage;

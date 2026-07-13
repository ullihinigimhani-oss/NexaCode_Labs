import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthAlert from '../../components/auth/AuthAlert.jsx';
import AuthHeader from '../../components/auth/AuthHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { validateEmailOnly } from '../../utils/authValidation.js';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextError = validateEmailOnly(email);
    setError(nextError);
    setStatus(null);

    if (nextError) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      if (email.trim().toLowerCase().includes('unknown')) {
        setStatus({
          variant: 'error',
          title: 'Email address not found',
          message: 'No matching account can be previewed for this address.',
        });
      } else {
        setStatus({
          variant: 'success',
          title: 'OTP request prepared',
          message: 'If this address belongs to an account, an OTP step can continue the reset flow.',
        });
      }

      setIsLoading(false);
    }, 700);
  };

  const canContinue = status?.variant === 'success';

  return (
    <div className="space-y-7">
      <AuthHeader
        description="Enter your email address and we will send you a secure verification code."
        eyebrow="Account recovery"
        title="Forgot your password?"
      />

      {status ? (
        <AuthAlert title={status.title} variant={status.variant}>
          <p>{status.message}</p>
        </AuthAlert>
      ) : (
        <AuthAlert title="Reset guidance" variant="info">
          <p>OTP codes expire after a short time. Never share a verification code with anyone.</p>
        </AuthAlert>
      )}

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          error={error}
          id="forgot-email"
          label="Email address"
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
            setError('');
            setStatus(null);
          }}
          placeholder="name@company.com"
          type="email"
          value={email}
        />

        <Button className="w-full" disabled={!email.trim() || isLoading} size="lg" type="submit">
          {isLoading ? <Loader2 aria-hidden="true" className="animate-spin" size={18} /> : <MailCheck aria-hidden="true" size={18} />}
          {isLoading ? 'Preparing OTP...' : 'Send OTP'}
        </Button>
      </form>

      {canContinue ? (
        <Button
          className="w-full"
          onClick={() => navigate('/verify-otp', { state: { email: email.trim() } })}
          size="lg"
          type="button"
          variant="outline"
        >
          Continue to OTP verification
        </Button>
      ) : null}

      <div className="space-y-3 text-center text-sm text-brand-muted">
        <p>Did not receive a code? You can request another OTP after the current code expires.</p>
        <Link
          className="inline-flex items-center justify-center gap-2 font-semibold text-brand-primary transition-colors duration-150 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/login"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

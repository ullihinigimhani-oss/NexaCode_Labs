import { ArrowLeft, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthAlert from '../../components/auth/AuthAlert.jsx';
import AuthHeader from '../../components/auth/AuthHeader.jsx';
import OtpInput from '../../components/auth/OtpInput.jsx';
import Button from '../../components/ui/Button.jsx';
import {
  formatCountdown,
  isCompleteOtp,
  maskEmail,
  normalizeOtp,
} from '../../utils/authValidation.js';

const OTP_SECONDS = 120;
const DEMO_VALID_OTP = '123456';

function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'lihini@gmail.com';
  const [otp, setOtp] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(OTP_SECONDS);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isExpired = secondsRemaining === 0;

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsRemaining]);

  useEffect(() => {
    if (isExpired) {
      setError('This OTP has expired. Request a new code to continue.');
    }
  }, [isExpired]);

  const handleVerify = (event) => {
    event.preventDefault();

    if (isExpired) {
      setError('This OTP has expired. Request a new code to continue.');
      return;
    }

    if (!isCompleteOtp(otp)) {
      setError('Enter the six-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setError('');
    setNotice(null);

    window.setTimeout(() => {
      if (normalizeOtp(otp) === DEMO_VALID_OTP) {
        setNotice({
          variant: 'success',
          title: 'Code accepted',
          message: 'Identity verification is ready to continue.',
        });
        window.setTimeout(() => {
          navigate('/reset-password', { state: { email } });
        }, 350);
        return;
      }

      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setError('The OTP code is invalid. Check the code and try again.');

      if (nextAttempts >= 3) {
        setNotice({
          variant: 'warning',
          title: 'Maximum-attempt warning',
          message: 'Too many failed attempts may temporarily lock the account once backend policy is connected.',
        });
      } else if (nextAttempts === 2) {
        setNotice({
          variant: 'warning',
          title: 'One attempt remaining',
          message: 'Repeated invalid codes may require a fresh OTP.',
        });
      }

      setIsLoading(false);
    }, 600);
  };

  const handleResend = () => {
    setOtp('');
    setError('');
    setAttempts(0);
    setSecondsRemaining(OTP_SECONDS);
    setNotice({
      variant: 'success',
      title: 'OTP request refreshed',
      message: 'A new OTP step is ready for review in this frontend preview.',
    });
  };

  return (
    <div className="space-y-7">
      <AuthHeader
        description="Enter the six-digit code sent to your email."
        eyebrow="Identity check"
        title="Verify your identity"
      />

      <div className="rounded-brand border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-muted">
        Code sent to <span className="font-semibold text-brand-text">{maskEmail(email)}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-brand border border-brand-border bg-brand-light p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Code expires in</p>
          <p className="mt-1 text-2xl font-bold text-brand-text">{formatCountdown(secondsRemaining)}</p>
        </div>
        <div className="rounded-brand border border-brand-border bg-brand-light p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Attempts used</p>
          <p className="mt-1 text-2xl font-bold text-brand-text">{attempts} / 3</p>
        </div>
      </div>

      {notice ? (
        <AuthAlert title={notice.title} variant={notice.variant}>
          <p>{notice.message}</p>
        </AuthAlert>
      ) : null}

      {isExpired ? (
        <AuthAlert title="OTP expired" variant="warning">
          <p>Request another OTP before continuing.</p>
        </AuthAlert>
      ) : (
        <AuthAlert title="Keep your code private" variant="info">
          <p>NexaCode Labs will never ask you to share an OTP outside the verification screen.</p>
        </AuthAlert>
      )}

      <form className="space-y-5" noValidate onSubmit={handleVerify}>
        <OtpInput
          error={error}
          onChange={(value) => {
            setOtp(value);
            setError('');
          }}
          value={otp}
        />

        <Button
          className="w-full"
          disabled={!isCompleteOtp(otp) || isExpired || isLoading || attempts >= 3}
          size="lg"
          type="submit"
        >
          {isLoading ? <Loader2 aria-hidden="true" className="animate-spin" size={18} /> : <ShieldCheck aria-hidden="true" size={18} />}
          {isLoading ? 'Verifying...' : 'Verify code'}
        </Button>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-brand px-2 py-2 text-sm font-semibold text-brand-primary transition-colors duration-150 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          onClick={handleResend}
          type="button"
        >
          <RefreshCw aria-hidden="true" size={16} />
          Resend OTP
        </button>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-brand px-2 py-2 text-sm font-semibold text-brand-muted transition-colors duration-150 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/forgot-password"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Change email
        </Link>
      </div>
    </div>
  );
}

export default VerifyOtpPage;

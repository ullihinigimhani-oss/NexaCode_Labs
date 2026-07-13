import { KeyRound, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthAlert from '../../components/auth/AuthAlert.jsx';
import AuthHeader from '../../components/auth/AuthHeader.jsx';
import PasswordInput from '../../components/auth/PasswordInput.jsx';
import PasswordStrength from '../../components/auth/PasswordStrength.jsx';
import Button from '../../components/ui/Button.jsx';
import { validatePasswordReset } from '../../utils/authValidation.js';

const initialValues = {
  password: '',
  confirmPassword: '',
};

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const initialState = searchParams.get('state') === 'expired' ? 'expired' : 'form';
  const [screenState, setScreenState] = useState(initialState);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = values.password && values.confirmPassword && !isLoading;

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validatePasswordReset(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      setScreenState('success');
      setIsLoading(false);
    }, 700);
  };

  if (screenState === 'expired') {
    return (
      <div className="space-y-7">
        <AuthHeader
          description="The password reset session is no longer available."
          eyebrow="Reset session"
          title="Create a new password"
        />
        <AuthAlert title="Reset session expired" variant="warning">
          <p>Request a new OTP to restart the password reset flow.</p>
        </AuthAlert>
        <Link
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-brand bg-brand-primary px-5 text-base font-semibold text-white shadow-soft transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/forgot-password"
        >
          Request a new OTP
        </Link>
      </div>
    );
  }

  if (screenState === 'success') {
    return (
      <div className="space-y-7">
        <AuthHeader
          description="Your new password passed the frontend validation checks."
          eyebrow="Password reset"
          title="Password reset prepared"
        />
        <AuthAlert title="Password reset successful" variant="success">
          <p>The reset success screen is ready for the future backend workflow.</p>
        </AuthAlert>
        <Link
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-brand bg-brand-primary px-5 text-base font-semibold text-white shadow-soft transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/auth/status?code=password-reset"
        >
          Continue
        </Link>
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
        description="Choose a strong password you have not used before."
        eyebrow="Password reset"
        title="Create a new password"
      />

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <PasswordInput
          autoComplete="new-password"
          error={errors.password}
          id="reset-password"
          label="New password"
          name="password"
          onChange={(event) => updateValue('password', event.target.value)}
          placeholder="Enter a new password"
          value={values.password}
        />

        <PasswordStrength password={values.password} />

        <PasswordInput
          autoComplete="new-password"
          error={errors.confirmPassword}
          id="reset-confirm-password"
          label="Confirm new password"
          name="confirmPassword"
          onChange={(event) => updateValue('confirmPassword', event.target.value)}
          placeholder="Confirm your new password"
          value={values.confirmPassword}
        />

        <Button className="w-full" disabled={!canSubmit} size="lg" type="submit">
          {isLoading ? <Loader2 aria-hidden="true" className="animate-spin" size={18} /> : <KeyRound aria-hidden="true" size={18} />}
          {isLoading ? 'Resetting password...' : 'Reset password'}
        </Button>
      </form>

      <p className="text-center text-sm text-brand-muted">
        Remembered your password?{' '}
        <Link
          className="font-semibold text-brand-primary transition-colors duration-150 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default ResetPasswordPage;

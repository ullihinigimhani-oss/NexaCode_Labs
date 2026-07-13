import { Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthAlert from '../../components/auth/AuthAlert.jsx';
import AuthDivider from '../../components/auth/AuthDivider.jsx';
import AuthHeader from '../../components/auth/AuthHeader.jsx';
import PasswordInput from '../../components/auth/PasswordInput.jsx';
import PasswordStrength from '../../components/auth/PasswordStrength.jsx';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { validateSignup } from '../../utils/authValidation.js';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

function SignupPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit =
    values.firstName.trim() &&
    values.lastName.trim() &&
    values.email.trim() &&
    values.password &&
    values.confirmPassword &&
    values.acceptTerms &&
    !isLoading;

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateSignup(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      navigate('/verify-email', {
        state: {
          email: values.email.trim(),
          firstName: values.firstName.trim(),
        },
      });
    }, 700);
  };

  return (
    <div className="space-y-7">
      <AuthHeader
        description="Join NexaCode Labs and manage your projects securely."
        eyebrow="Account setup"
        title="Create your account"
      />

      <AuthAlert title="Public account role" variant="info">
        <p>New public accounts are prepared for the standard user role. Administrative access is handled separately.</p>
      </AuthAlert>

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            autoComplete="given-name"
            error={errors.firstName}
            id="signup-first-name"
            label="First name"
            name="firstName"
            onChange={(event) => updateValue('firstName', event.target.value)}
            placeholder="Lihini"
            value={values.firstName}
          />
          <Input
            autoComplete="family-name"
            error={errors.lastName}
            id="signup-last-name"
            label="Last name"
            name="lastName"
            onChange={(event) => updateValue('lastName', event.target.value)}
            placeholder="Gimhani"
            value={values.lastName}
          />
        </div>

        <Input
          autoComplete="email"
          error={errors.email}
          id="signup-email"
          label="Email address"
          name="email"
          onChange={(event) => updateValue('email', event.target.value)}
          placeholder="name@company.com"
          type="email"
          value={values.email}
        />

        <Input
          autoComplete="tel"
          hint="Optional"
          id="signup-phone"
          label="Phone number"
          name="phone"
          onChange={(event) => updateValue('phone', event.target.value)}
          placeholder="+94 XX XXX XXXX"
          type="tel"
          value={values.phone}
        />

        <PasswordInput
          autoComplete="new-password"
          error={errors.password}
          id="signup-password"
          label="Password"
          name="password"
          onChange={(event) => updateValue('password', event.target.value)}
          placeholder="Create a strong password"
          value={values.password}
        />

        <PasswordStrength password={values.password} />

        <PasswordInput
          autoComplete="new-password"
          error={errors.confirmPassword}
          id="signup-confirm-password"
          label="Confirm password"
          name="confirmPassword"
          onChange={(event) => updateValue('confirmPassword', event.target.value)}
          placeholder="Confirm your password"
          value={values.confirmPassword}
        />

        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm text-brand-muted">
            <input
              aria-describedby={errors.acceptTerms ? 'signup-terms-error' : undefined}
              aria-invalid={errors.acceptTerms ? 'true' : undefined}
              checked={values.acceptTerms}
              className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
              name="acceptTerms"
              onChange={(event) => updateValue('acceptTerms', event.target.checked)}
              type="checkbox"
            />
            <span>
              I agree to the{' '}
              <Link className="font-semibold text-brand-primary hover:text-blue-700" to="/">
                Terms
              </Link>{' '}
              and{' '}
              <Link className="font-semibold text-brand-primary hover:text-blue-700" to="/">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.acceptTerms ? (
            <p className="text-sm font-medium text-brand-error" id="signup-terms-error">
              {errors.acceptTerms}
            </p>
          ) : null}
        </div>

        <Button className="w-full" disabled={!canSubmit} size="lg" type="submit">
          {isLoading ? <Loader2 aria-hidden="true" className="animate-spin" size={18} /> : <UserPlus aria-hidden="true" size={18} />}
          {isLoading ? 'Preparing verification...' : 'Create your account'}
        </Button>
      </form>

      <AuthDivider />
      <SocialLoginButtons />

      <p className="text-center text-sm text-brand-muted">
        Already have an account?{' '}
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

export default SignupPage;

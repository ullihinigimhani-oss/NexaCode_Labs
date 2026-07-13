import { Loader2, Lock } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthAlert from '../../components/auth/AuthAlert.jsx';
import AuthDivider from '../../components/auth/AuthDivider.jsx';
import AuthHeader from '../../components/auth/AuthHeader.jsx';
import PasswordInput from '../../components/auth/PasswordInput.jsx';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { validateLogin } from '../../utils/authValidation.js';

const initialValues = {
  email: '',
  password: '',
  remember: false,
};

function LoginPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = values.email.trim() && values.password && !isLoading;

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setStatus(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    setStatus(null);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      const email = values.email.trim().toLowerCase();

      if (email.includes('locked')) {
        setStatus({
          variant: 'warning',
          title: 'Account temporarily locked',
          message: 'Too many failed attempts may temporarily lock an account once backend policy is connected.',
        });
      } else if (email.includes('wrong') || values.password.toLowerCase() === 'incorrect') {
        setStatus({
          variant: 'error',
          title: 'Incorrect credentials',
          message: 'The email and password combination could not be validated.',
        });
      } else {
        setStatus({
          variant: 'success',
          title: 'Validation successful',
          message: 'The sign-in form is ready for the future authentication service.',
        });
      }

      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-7">
      <AuthHeader
        description="Sign in to continue to NexaCode Labs."
        eyebrow="Client portal"
        title="Welcome back"
      />

      {status ? (
        <AuthAlert title={status.title} variant={status.variant}>
          <p>{status.message}</p>
        </AuthAlert>
      ) : null}

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          error={errors.email}
          id="login-email"
          label="Email address"
          name="email"
          onChange={(event) => updateValue('email', event.target.value)}
          placeholder="name@company.com"
          type="email"
          value={values.email}
        />

        <PasswordInput
          autoComplete="current-password"
          error={errors.password}
          id="login-password"
          label="Password"
          name="password"
          onChange={(event) => updateValue('password', event.target.value)}
          placeholder="Enter your password"
          value={values.password}
        />

        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex w-fit items-center gap-2 font-medium text-brand-muted">
            <input
              checked={values.remember}
              className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
              name="remember"
              onChange={(event) => updateValue('remember', event.target.checked)}
              type="checkbox"
            />
            Remember me
          </label>
          <Link
            className="font-semibold text-brand-primary transition-colors duration-150 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            to="/forgot-password"
          >
            Forgot your password?
          </Link>
        </div>

        <Button className="w-full" disabled={!canSubmit} size="lg" type="submit">
          {isLoading ? <Loader2 aria-hidden="true" className="animate-spin" size={18} /> : <Lock aria-hidden="true" size={18} />}
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <AuthDivider />
      <SocialLoginButtons />

      <p className="text-center text-sm text-brand-muted">
        New to NexaCode Labs?{' '}
        <Link
          className="font-semibold text-brand-primary transition-colors duration-150 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          to="/signup"
        >
          Create your account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;

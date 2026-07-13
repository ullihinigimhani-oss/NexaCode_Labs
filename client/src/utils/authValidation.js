const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const passwordRequirements = [
  {
    id: 'length',
    label: 'Minimum 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Uppercase letter',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'Lowercase letter',
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'Number',
    test: (value) => /\d/.test(value),
  },
  {
    id: 'special',
    label: 'Special character',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

export function getPasswordChecks(password) {
  return passwordRequirements.map((rule) => ({
    ...rule,
    met: rule.test(password),
  }));
}

export function getPasswordStrength(password) {
  const metCount = getPasswordChecks(password).filter((rule) => rule.met).length;

  if (!password) {
    return {
      score: 0,
      label: 'Not started',
      meterClassName: 'bg-slate-200',
      textClassName: 'text-brand-muted',
    };
  }

  if (metCount <= 2) {
    return {
      score: 33,
      label: 'Needs attention',
      meterClassName: 'bg-brand-error',
      textClassName: 'text-brand-error',
    };
  }

  if (metCount <= 4) {
    return {
      score: 66,
      label: 'Getting stronger',
      meterClassName: 'bg-amber-500',
      textClassName: 'text-amber-700',
    };
  }

  return {
    score: 100,
    label: 'Strong password',
    meterClassName: 'bg-brand-success',
    textClassName: 'text-brand-success',
  };
}

export function isStrongPassword(password) {
  return getPasswordChecks(password).every((rule) => rule.met);
}

export function validateLogin(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Enter your password.';
  }

  return errors;
}

export function validateSignup(values) {
  const errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'Enter your first name.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Enter your last name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Create a password.';
  } else if (!isStrongPassword(values.password)) {
    errors.password = 'Meet all password requirements.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords must match.';
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'Accept the Terms and Privacy Policy to continue.';
  }

  return errors;
}

export function validateEmailOnly(email) {
  if (!email.trim()) {
    return 'Enter your email address.';
  }

  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }

  return '';
}

export function validatePasswordReset(values) {
  const errors = {};

  if (!values.password) {
    errors.password = 'Enter a new password.';
  } else if (!isStrongPassword(values.password)) {
    errors.password = 'Meet all password requirements.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your new password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords must match.';
  }

  return errors;
}

export function maskEmail(email) {
  const [name = '', domain = ''] = email.split('@');

  if (!name || !domain) {
    return 'your email address';
  }

  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}${'*'.repeat(Math.max(3, name.length - visible.length))}@${domain}`;
}

export function normalizeOtp(value) {
  return value.replace(/\D/g, '').slice(0, 6);
}

export function isCompleteOtp(value) {
  return normalizeOtp(value).length === 6;
}

export function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

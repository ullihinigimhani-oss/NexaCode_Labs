import { Check, X } from 'lucide-react';
import { getPasswordChecks, getPasswordStrength } from '../../utils/authValidation.js';
import { cn } from '../../utils/cn.js';

function PasswordStrength({ password }) {
  const checks = getPasswordChecks(password);
  const strength = getPasswordStrength(password);

  return (
    <section aria-label="Password requirements" className="rounded-brand border border-brand-border bg-brand-light p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-brand-text">Password strength</p>
        <p className={cn('text-sm font-semibold', strength.textClassName)}>{strength.label}</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-white ring-1 ring-inset ring-brand-border">
        <div
          aria-hidden="true"
          className={cn('h-full rounded-full transition-all duration-300', strength.meterClassName)}
          style={{ width: `${strength.score}%` }}
        />
      </div>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {checks.map((rule) => (
          <li className="flex items-center gap-2 text-brand-muted" key={rule.id}>
            <span
              className={cn(
                'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                rule.met
                  ? 'border-green-200 bg-green-50 text-brand-success'
                  : 'border-brand-border bg-white text-brand-muted',
              )}
            >
              {rule.met ? <Check aria-hidden="true" size={13} /> : <X aria-hidden="true" size={13} />}
            </span>
            <span className={rule.met ? 'text-brand-text' : undefined}>{rule.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PasswordStrength;

import { Eye, EyeOff } from 'lucide-react';
import { useId, useState } from 'react';
import { cn } from '../../utils/cn.js';

function PasswordInput({
  className = '',
  error,
  hint,
  id,
  inputClassName = '',
  label,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <label className="block text-sm font-semibold text-brand-text" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          aria-describedby={cn(hintId, errorId) || undefined}
          aria-invalid={error ? 'true' : undefined}
          className={cn(
            'block h-11 w-full rounded-brand border bg-white py-2 pl-3.5 pr-12 text-sm text-brand-text shadow-soft transition-colors duration-150',
            'placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
            error ? 'border-brand-error' : 'border-brand-border',
            inputClassName,
          )}
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          {...props}
        />
        <button
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-brand text-brand-muted transition-colors duration-150 hover:bg-brand-light hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
          onClick={() => setIsVisible((current) => !current)}
          type="button"
        >
          {isVisible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
        </button>
      </div>
      {hint ? (
        <p className="text-sm text-brand-muted" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium text-brand-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default PasswordInput;

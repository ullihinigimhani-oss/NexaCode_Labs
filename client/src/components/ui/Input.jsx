import { useId } from 'react';
import { cn } from '../../utils/cn.js';

function Input({
  className = '',
  error,
  hint,
  id,
  inputClassName = '',
  label,
  type = 'text',
  ...props
}) {
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
      <input
        aria-describedby={cn(hintId, errorId) || undefined}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'block h-11 w-full rounded-brand border bg-white px-3.5 text-sm text-brand-text shadow-soft transition-colors duration-150',
          'placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
          error ? 'border-brand-error' : 'border-brand-border',
          inputClassName,
        )}
        id={inputId}
        type={type}
        {...props}
      />
      {hint ? <p className="text-sm text-brand-muted" id={hintId}>{hint}</p> : null}
      {error ? <p className="text-sm font-medium text-brand-error" id={errorId}>{error}</p> : null}
    </div>
  );
}

export default Input;

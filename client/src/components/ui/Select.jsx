import { useId } from 'react';
import { cn } from '../../utils/cn.js';

function Select({
  children,
  className = '',
  error,
  hint,
  id,
  label,
  selectClassName = '',
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <label className="block text-sm font-semibold text-brand-text" htmlFor={selectId}>
          {label}
        </label>
      ) : null}
      <select
        aria-describedby={cn(hintId, errorId) || undefined}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'block h-11 w-full rounded-brand border bg-white px-3.5 text-sm text-brand-text shadow-soft transition-colors duration-150',
          'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
          error ? 'border-brand-error' : 'border-brand-border',
          selectClassName,
        )}
        id={selectId}
        {...props}
      >
        {children}
      </select>
      {hint ? <p className="text-sm text-brand-muted" id={hintId}>{hint}</p> : null}
      {error ? <p className="text-sm font-medium text-brand-error" id={errorId}>{error}</p> : null}
    </div>
  );
}

export default Select;

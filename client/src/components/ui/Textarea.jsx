import { useId } from 'react';
import { cn } from '../../utils/cn.js';

function Textarea({
  className = '',
  error,
  hint,
  id,
  label,
  textareaClassName = '',
  ...props
}) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <label className="block text-sm font-semibold text-brand-text" htmlFor={textareaId}>
          {label}
        </label>
      ) : null}
      <textarea
        aria-describedby={cn(hintId, errorId) || undefined}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'block min-h-32 w-full resize-y rounded-brand border bg-white px-3.5 py-3 text-sm text-brand-text shadow-soft transition-colors duration-150',
          'placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20',
          error ? 'border-brand-error' : 'border-brand-border',
          textareaClassName,
        )}
        id={textareaId}
        {...props}
      />
      {hint ? <p className="text-sm text-brand-muted" id={hintId}>{hint}</p> : null}
      {error ? <p className="text-sm font-medium text-brand-error" id={errorId}>{error}</p> : null}
    </div>
  );
}

export default Textarea;

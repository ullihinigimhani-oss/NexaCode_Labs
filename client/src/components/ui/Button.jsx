import { cn } from '../../utils/cn.js';

const variants = {
  primary:
    'bg-brand-primary text-white shadow-soft hover:bg-blue-700 focus-visible:ring-brand-primary',
  secondary:
    'bg-brand-dark text-white shadow-soft hover:bg-slate-800 focus-visible:ring-brand-cyan',
  outline:
    'border border-brand-border bg-white text-brand-text hover:border-brand-primary hover:bg-brand-light hover:text-brand-primary focus-visible:ring-brand-primary',
  ghost:
    'text-brand-text hover:bg-brand-light hover:text-brand-primary focus-visible:ring-brand-primary',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

function Button({
  children,
  className = '',
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-brand font-semibold transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

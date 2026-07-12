import { cn } from '../../utils/cn.js';

const variants = {
  default: 'bg-brand-light text-brand-text ring-brand-border',
  accent: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  primary: 'bg-blue-50 text-brand-primary ring-blue-100',
  success: 'bg-green-50 text-brand-success ring-green-100',
  error: 'bg-red-50 text-brand-error ring-red-100',
  outline: 'bg-white text-brand-muted ring-brand-border',
};

function Badge({ children, className = '', variant = 'default' }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;

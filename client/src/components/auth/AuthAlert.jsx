import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const variants = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-900',
    iconClassName: 'text-brand-success',
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-200 bg-red-50 text-red-900',
    iconClassName: 'text-brand-error',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-200 bg-amber-50 text-amber-900',
    iconClassName: 'text-amber-600',
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-900',
    iconClassName: 'text-brand-primary',
  },
};

function AuthAlert({ children, className = '', title, variant = 'info' }) {
  const config = variants[variant] || variants.info;
  const Icon = config.icon;
  const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';

  return (
    <div
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={cn(
        'flex gap-3 rounded-brand border p-4 text-sm leading-6',
        config.className,
        variant === 'error' && 'auth-shake-once',
        className,
      )}
      role={role}
    >
      <Icon aria-hidden="true" className={cn('mt-0.5 shrink-0', config.iconClassName)} size={18} />
      <div className="space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default AuthAlert;

import { cn } from '../../utils/cn.js';

function Card({
  as: Component = 'div',
  children,
  className = '',
  interactive = false,
  ...props
}) {
  return (
    <Component
      className={cn(
        'rounded-brand border border-brand-border bg-white p-6 shadow-soft',
        interactive && 'transition-colors duration-150 hover:border-brand-primary hover:shadow-premium',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;

import { cn } from '../../utils/cn.js';

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
};

function Container({
  as: Component = 'div',
  children,
  className = '',
  size = 'default',
  ...props
}) {
  return (
    <Component
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;

import { cn } from '../../utils/cn.js';

function AuthCard({ children, className = '' }) {
  return (
    <section
      className={cn(
        'auth-fade-in relative z-10 w-full rounded-[1rem] border border-brand-border bg-white p-5 shadow-soft sm:p-7 xl:p-8',
        className,
      )}
    >
      {children}
    </section>
  );
}

export default AuthCard;

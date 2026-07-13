import { cn } from '../../utils/cn.js';

function AuthBackgroundShapes({ className = '' }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(37,99,235,0.07) 1px, transparent 1px), linear-gradient(180deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="auth-shape-drift absolute -left-16 top-16 h-48 w-48 rounded-[2rem] border border-blue-100 bg-white/50 rotate-12" />
      <div className="auth-shape-drift absolute -right-20 bottom-20 h-56 w-56 rounded-[2rem] border border-cyan-100 bg-cyan-50/45 -rotate-12 [animation-delay:1.2s]" />
      <div className="absolute left-10 top-1/3 h-2 w-28 rounded-full bg-brand-primary/10" />
      <div className="absolute bottom-16 right-12 h-2 w-20 rounded-full bg-brand-cyan/20" />
    </div>
  );
}

export default AuthBackgroundShapes;

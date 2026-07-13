import { cn } from '../../utils/cn.js';

function AuthHeader({ align = 'left', eyebrow, title, description }) {
  return (
    <header className={cn('space-y-3', align === 'center' ? 'text-center' : 'text-left')}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-normal text-brand-text sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm leading-6 text-brand-muted sm:text-base">{description}</p>
        ) : null}
      </div>
    </header>
  );
}

export default AuthHeader;

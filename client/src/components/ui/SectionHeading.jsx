import { cn } from '../../utils/cn.js';

const alignments = {
  left: 'items-start text-left',
  center: 'items-center text-center',
};

function SectionHeading({
  align = 'left',
  className = '',
  description,
  eyebrow,
  title,
  titleAs: TitleTag = 'h2',
}) {
  return (
    <div className={cn('flex max-w-3xl flex-col gap-3', alignments[align], className)}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
          {eyebrow}
        </p>
      ) : null}
      <TitleTag className="text-2xl font-bold tracking-normal text-brand-text sm:text-3xl">
        {title}
      </TitleTag>
      {description ? (
        <p className="text-base leading-7 text-brand-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

export default SectionHeading;

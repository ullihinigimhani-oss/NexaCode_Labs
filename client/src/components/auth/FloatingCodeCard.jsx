import { Braces, Terminal } from 'lucide-react';
import { cn } from '../../utils/cn.js';

function FloatingCodeCard({
  className = '',
  compact = false,
  lines = ['const access = secure();', 'deploy.toCloud(project);', 'return growth;'],
  title = 'auth-flow.js',
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-[0.9rem] border border-white/15 bg-white/10 p-4 text-left text-white shadow-premium backdrop-blur-sm',
        compact ? 'w-48' : 'w-72',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Terminal size={15} />
          {title}
        </div>
        <Braces className="text-brand-cyan" size={16} />
      </div>
      <div className="space-y-2 font-mono text-[11px] leading-5 text-slate-200">
        {lines.map((line, index) => (
          <div className="flex gap-3" key={`${line}-${index}`}>
            <span className="w-4 shrink-0 text-slate-500">{index + 1}</span>
            <span>
              <span className="text-brand-cyan">{line.split(' ')[0]}</span>
              {line.includes(' ') ? ` ${line.split(' ').slice(1).join(' ')}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FloatingCodeCard;

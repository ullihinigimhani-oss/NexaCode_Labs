import { Database, Server } from 'lucide-react';
import { cn } from '../../utils/cn.js';

function FloatingDatabaseCard({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-[0.9rem] border border-white/15 bg-white/10 p-4 text-white shadow-premium backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Database className="text-brand-cyan" size={16} />
          Data layer
        </div>
        <Server className="text-slate-300" size={16} />
      </div>
      <svg className="mt-4 h-20 w-full" fill="none" viewBox="0 0 220 92" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="110" cy="18" fill="#22D3EE" fillOpacity="0.22" rx="74" ry="16" />
        <path d="M36 18v46c0 8.8 33.1 16 74 16s74-7.2 74-16V18" stroke="#A5F3FC" strokeOpacity="0.85" strokeWidth="3" />
        <ellipse cx="110" cy="18" rx="74" ry="16" stroke="#A5F3FC" strokeOpacity="0.9" strokeWidth="3" />
        <path d="M36 41c0 8.8 33.1 16 74 16s74-7.2 74-16" stroke="#93C5FD" strokeOpacity="0.65" strokeWidth="3" />
        <path d="M36 63c0 8.8 33.1 16 74 16s74-7.2 74-16" stroke="#93C5FD" strokeOpacity="0.65" strokeWidth="3" />
      </svg>
    </div>
  );
}

export default FloatingDatabaseCard;

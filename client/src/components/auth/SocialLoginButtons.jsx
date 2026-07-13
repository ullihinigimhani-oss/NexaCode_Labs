import { ExternalLink, Globe } from 'lucide-react';

const providers = [
  { label: 'Google', icon: Globe },
  { label: 'GitHub', icon: ExternalLink },
];

function SocialLoginButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {providers.map(({ icon: Icon, label }) => (
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-brand border border-brand-border bg-white px-4 text-sm font-semibold text-brand-muted shadow-soft opacity-70"
          disabled
          key={label}
          type="button"
        >
          <Icon aria-hidden="true" size={18} />
          <span>{label}</span>
          <span className="text-xs font-medium text-slate-400">Coming soon</span>
        </button>
      ))}
    </div>
  );
}

export default SocialLoginButtons;

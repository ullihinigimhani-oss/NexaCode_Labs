function AuthDivider({ label = 'or continue with' }) {
  return (
    <div className="flex items-center gap-3" role="separator">
      <span className="h-px flex-1 bg-brand-border" />
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
        {label}
      </span>
      <span className="h-px flex-1 bg-brand-border" />
    </div>
  );
}

export default AuthDivider;

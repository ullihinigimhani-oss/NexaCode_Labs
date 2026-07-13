import { Cloud, Cpu, LockKeyhole, Network, ShieldCheck } from 'lucide-react';
import FloatingCodeCard from './FloatingCodeCard.jsx';
import FloatingDatabaseCard from './FloatingDatabaseCard.jsx';

const tags = ['Secure access', 'Cloud ready', 'Scalable systems'];

function AuthVisualPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-brand-dark text-white lg:flex">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 16px 16px, rgba(34,211,238,0.18) 1px, transparent 1.5px), linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(11,18,32,0) 42%)',
          backgroundSize: '34px 34px, auto',
        }}
      />
      <div aria-hidden="true" className="absolute right-0 top-0 h-full w-2/3 bg-brand-primary/10" />
      <div aria-hidden="true" className="auth-shape-drift absolute -right-16 top-20 h-64 w-64 rounded-[3rem] border border-brand-cyan/20 bg-brand-cyan/5 rotate-12" />
      <div aria-hidden="true" className="auth-shape-drift absolute bottom-12 left-16 h-44 w-44 rounded-[2rem] border border-blue-400/20 bg-blue-500/10 -rotate-12 [animation-delay:1.1s]" />

      <div className="relative z-10 flex min-h-screen w-full flex-col justify-between px-10 py-10 xl:px-14">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-cyan">
            NexaCode Labs platform
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-normal xl:text-5xl">
            Build. Connect. Grow.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            Secure digital solutions designed for modern businesses.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto my-8 h-[520px] w-full max-w-3xl xl:h-[600px]" aria-hidden="true">
          <svg className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 720 560" xmlns="http://www.w3.org/2000/svg">
            <path d="M124 388C184 284 281 245 415 270C514 289 578 244 636 146" stroke="#22D3EE" strokeOpacity="0.28" strokeWidth="3" />
            <path d="M126 187C226 157 323 177 418 246C486 295 548 308 608 285" stroke="#93C5FD" strokeOpacity="0.2" strokeWidth="3" />
            {[126, 236, 418, 608, 636].map((cx, index) => (
              <circle className="auth-pulse-node" cx={cx} cy={[388, 310, 246, 285, 146][index]} fill="#22D3EE" key={cx} r="6" />
            ))}
          </svg>

          <div className="absolute left-12 top-24 w-[420px] rounded-[1.1rem] border border-white/15 bg-white text-brand-text shadow-premium xl:left-20 xl:w-[480px]">
            <div className="flex h-12 items-center justify-between rounded-t-[1.1rem] border-b border-brand-border bg-brand-light px-4">
              <div className="flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-error" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-brand-success" />
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-muted ring-1 ring-brand-border">
                <ShieldCheck size={14} className="text-brand-primary" />
                Auth console
              </div>
            </div>
            <div className="grid gap-4 p-5">
              <div className="rounded-brand border border-brand-border bg-brand-dark p-4 text-left font-mono text-xs leading-6 text-slate-200">
                <p><span className="text-brand-cyan">POST</span> /identity/session</p>
                <p><span className="text-green-300">status</span>: verified</p>
                <p><span className="text-blue-300">role</span>: user</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-brand bg-blue-50 p-3">
                  <LockKeyhole className="text-brand-primary" size={20} />
                  <p className="mt-2 text-xs font-semibold text-brand-text">Protected</p>
                </div>
                <div className="rounded-brand bg-cyan-50 p-3">
                  <Cloud className="text-cyan-600" size={20} />
                  <p className="mt-2 text-xs font-semibold text-brand-text">Deployed</p>
                </div>
                <div className="rounded-brand bg-slate-100 p-3">
                  <Network className="text-slate-700" size={20} />
                  <p className="mt-2 text-xs font-semibold text-brand-text">Connected</p>
                </div>
              </div>
            </div>
          </div>

          <FloatingCodeCard className="auth-float-slow absolute right-6 top-10 xl:right-12" />
          <FloatingDatabaseCard className="auth-float-slower absolute bottom-16 right-10 w-64 xl:right-16" />
          <FloatingCodeCard
            className="auth-float-slower absolute bottom-20 left-0 xl:left-8"
            compact
            lines={['token.verify();', 'sync.projects();', 'ship.release();']}
            title="workflow.ts"
          />

          <div className="auth-float-slow absolute right-40 bottom-4 flex h-20 w-20 items-center justify-center rounded-[1rem] border border-white/15 bg-brand-cyan/15 text-brand-cyan shadow-premium [animation-delay:0.8s]">
            <Cpu size={32} />
          </div>
        </div>

        <p className="max-w-lg text-sm leading-6 text-slate-400">
          Original interface artwork built with lightweight CSS, SVG and React components.
        </p>
      </div>
    </aside>
  );
}

export default AuthVisualPanel;

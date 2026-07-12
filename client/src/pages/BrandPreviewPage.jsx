import Logo from '../components/common/Logo.jsx';
import markLogoUrl from '../assets/logo/nexacode-mark.svg';

const iconSizes = [24, 32, 48, 64, 128];

const brandColours = [
  { name: 'Deep Navy', hex: '#0B1220' },
  { name: 'Primary Blue', hex: '#2563EB' },
  { name: 'Cyan Accent', hex: '#22D3EE' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Slate Text', hex: '#64748B' },
];

function BrandPreviewPage() {
  return (
    <section className="space-y-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Brand Preview
        </p>
        <h1 className="mt-3 text-3xl font-semibold">NexaCode Labs Logo</h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Full Logo</h2>
        <div className="border border-slate-200 bg-white p-8">
          <Logo className="w-72" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Light Logo</h2>
        <div className="bg-[#0B1220] p-8">
          <Logo className="w-72" variant="light" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Icon Sizes</h2>
        <div className="flex flex-wrap items-end gap-8 border border-slate-200 bg-white p-8">
          {iconSizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <img
                src={markLogoUrl}
                alt={`NexaCode Labs mark at ${size}px`}
                style={{ width: `${size}px`, height: `${size}px` }}
              />
              <span className="text-sm text-slate-500">{size}px</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Colour Palette</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {brandColours.map((colour) => (
            <div key={colour.hex} className="border border-slate-200 bg-white">
              <div
                className="h-20 border-b border-slate-200"
                style={{ backgroundColor: colour.hex }}
              />
              <div className="p-4">
                <p className="font-medium">{colour.name}</p>
                <p className="mt-1 text-sm text-slate-500">{colour.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandPreviewPage;

import Logo from '../components/common/Logo.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Container from '../components/ui/Container.jsx';
import Input from '../components/ui/Input.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Select from '../components/ui/Select.jsx';
import Textarea from '../components/ui/Textarea.jsx';

const brandColours = [
  { name: 'Background', hex: '#FFFFFF' },
  { name: 'Dark Background', hex: '#0B1220' },
  { name: 'Primary Blue', hex: '#2563EB' },
  { name: 'Cyan Accent', hex: '#22D3EE' },
  { name: 'Main Text', hex: '#0F172A' },
  { name: 'Secondary Text', hex: '#64748B' },
  { name: 'Light Background', hex: '#F8FAFC' },
  { name: 'Border', hex: '#E2E8F0' },
  { name: 'Success', hex: '#16A34A' },
  { name: 'Error', hex: '#DC2626' },
];

const buttonVariants = ['primary', 'secondary', 'outline', 'ghost'];
const buttonSizes = ['sm', 'md', 'lg'];
const spacingSteps = [
  { name: 'xs', className: 'w-2' },
  { name: 'sm', className: 'w-4' },
  { name: 'md', className: 'w-6' },
  { name: 'lg', className: 'w-8' },
  { name: 'xl', className: 'w-12' },
];

function UiPreviewPage() {
  return (
    <div className="bg-brand-background py-12 sm:py-16">
      <Container className="space-y-14">
        <div className="flex flex-col gap-6 border-b border-brand-border pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <Logo className="w-64" />
            <SectionHeading
              description="A focused component foundation for future NexaCode Labs pages."
              eyebrow="UI Design System"
              title="Premium, practical interface primitives"
              titleAs="h1"
            />
          </div>
          <Badge variant="primary">Loop 03 Preview</Badge>
        </div>

        <section className="space-y-6">
          <SectionHeading
            description="Inter is used for clear hierarchy, dense professional layouts, and comfortable reading across devices."
            eyebrow="Typography"
            title="Hierarchy"
          />
          <Card className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
                Eyebrow Label
              </p>
              <h1 className="mt-3 text-3xl font-bold text-brand-text sm:text-4xl">
                Build reliable software products
              </h1>
              <h2 className="mt-4 text-2xl font-bold text-brand-text sm:text-3xl">
                Strategy, design and engineering
              </h2>
              <h3 className="mt-4 text-xl font-semibold text-brand-text">
                Web, mobile and consulting delivery
              </h3>
            </div>
            <p className="max-w-3xl text-base leading-7 text-brand-muted">
              NexaCode Labs uses a measured visual system with strong contrast,
              restrained spacing and clean interaction states for international client work.
            </p>
          </Card>
        </section>

        <section className="space-y-6">
          <SectionHeading eyebrow="Buttons" title="Variants and sizes" />
          <Card className="space-y-6">
            {buttonVariants.map((variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-3">
                {buttonSizes.map((size) => (
                  <Button key={`${variant}-${size}`} size={size} variant={variant}>
                    {variant} {size}
                  </Button>
                ))}
              </div>
            ))}
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading eyebrow="Badges" title="Status labels" />
            <Card className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="accent">Cyan Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="outline">Outline</Badge>
            </Card>
          </div>

          <div className="space-y-6">
            <SectionHeading eyebrow="Spacing" title="Scale examples" />
            <Card className="space-y-4">
              {spacingSteps.map((step) => (
                <div key={step.name} className="flex items-center gap-4">
                  <span className="w-10 text-sm font-medium text-brand-muted">{step.name}</span>
                  <span className={`${step.className} h-3 rounded-full bg-brand-primary`} />
                </div>
              ))}
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading eyebrow="Cards" title="Content surfaces" />
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <Badge variant="primary">Discovery</Badge>
              <h3 className="mt-4 text-lg font-semibold text-brand-text">Product clarity</h3>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                Structure requirements, risks and timelines before engineering begins.
              </p>
            </Card>
            <Card interactive>
              <Badge variant="accent">Delivery</Badge>
              <h3 className="mt-4 text-lg font-semibold text-brand-text">Modern builds</h3>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                Responsive web applications with consistent interface behavior.
              </p>
            </Card>
            <Card className="bg-brand-dark text-white">
              <Badge variant="accent">Premium</Badge>
              <h3 className="mt-4 text-lg font-semibold">Technical consulting</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Clear guidance for architecture, UI quality and delivery planning.
              </p>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading eyebrow="Forms" title="Input controls" />
          <Card>
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Full name" placeholder="Jane Fernando" />
              <Input label="Email address" placeholder="jane@example.com" type="email" />
              <Select label="Project type" defaultValue="">
                <option value="" disabled>
                  Select a project type
                </option>
                <option>Web application</option>
                <option>Mobile application</option>
                <option>UI/UX solution</option>
                <option>Technical consulting</option>
              </Select>
              <Input
                error="Please enter a valid budget range."
                label="Estimated budget"
                placeholder="USD 2,500"
              />
              <Textarea
                className="md:col-span-2"
                hint="Keep it short; detailed quote flows come later."
                label="Project summary"
                placeholder="Tell us what you want to build..."
              />
            </div>
          </Card>
        </section>

        <section className="space-y-6">
          <SectionHeading eyebrow="Colours" title="Brand palette" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {brandColours.map((colour) => (
              <Card key={colour.hex} className="p-0">
                <div
                  className="h-20 rounded-t-brand border-b border-brand-border"
                  style={{ backgroundColor: colour.hex }}
                />
                <div className="p-4">
                  <p className="font-semibold text-brand-text">{colour.name}</p>
                  <p className="mt-1 text-sm text-brand-muted">{colour.hex}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}

export default UiPreviewPage;

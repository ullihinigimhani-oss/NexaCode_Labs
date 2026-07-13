import { ExternalLink, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import Container from '../ui/Container.jsx';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const serviceLinks = [
  'Web Application Development',
  'Mobile Application Development',
  'UI/UX Solutions',
  'Technical Consulting',
  'Freelance Project Development',
];

const socialLinks = [
  { icon: ExternalLink, label: 'LinkedIn', to: '#' },
  { icon: Globe, label: 'GitHub', to: '#' },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.8fr_1fr_0.9fr]">
          <div className="max-w-sm">
            <Link className="inline-block rounded-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-brand-dark" to="/">
              <Logo className="w-56" variant="light" />
            </Link>
            <p className="mt-5 text-sm leading-6 text-slate-300">
              Premium software development, web applications, mobile solutions and
              technical consulting for Sri Lankan and international clients.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, label, to }) => (
                <a
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-brand border border-white/10 text-slate-300 transition-colors duration-150 hover:border-brand-cyan hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                  href={to}
                  key={label}
                >
                  <Icon aria-hidden="true" size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-cyan">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link className="transition-colors duration-150 hover:text-white" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-cyan">
              Services
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link className="transition-colors duration-150 hover:text-white" to="/services">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-cyan">
              Contact
            </h2>
            <ul className="mt-4 space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <Mail aria-hidden="true" className="mt-0.5 text-brand-cyan" size={17} />
                <span>hello@nexacodelabs.com</span>
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden="true" className="mt-0.5 text-brand-cyan" size={17} />
                <span>+94 XX XXX XXXX</span>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 text-brand-cyan" size={17} />
                <span>Sri Lanka, serving clients worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
            <p>Copyright {currentYear} NexaCode Labs. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <span>Developer: Lihini Gimhani</span>
              <span>Strategic Sponsor: Pradeep Chamil</span>
            </div>
            <div className="flex gap-5">
              <Link className="transition-colors duration-150 hover:text-white" to="#">
                Privacy Policy
              </Link>
              <Link className="transition-colors duration-150 hover:text-white" to="#">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;

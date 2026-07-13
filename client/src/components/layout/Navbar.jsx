import { ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import Container from '../ui/Container.jsx';
import { cn } from '../../utils/cn.js';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-150',
        isScrolled ? 'border-b border-brand-border shadow-soft' : 'border-b border-transparent',
      )}
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link className="shrink-0 rounded-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4" to="/">
            <Logo className="w-48 sm:w-56" />
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'rounded-brand px-3 py-2 text-sm font-semibold transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-blue-50 text-brand-primary'
                      : 'text-brand-muted hover:bg-brand-light hover:text-brand-text',
                  )
                }
                end={link.to === '/'}
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-brand bg-brand-primary px-4 text-sm font-semibold text-white shadow-soft transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              to="/contact"
            >
              Request a Quote
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label="Open navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-brand border border-brand-border bg-white text-brand-text shadow-soft transition-colors duration-150 hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 lg:hidden"
            onClick={() => setIsMenuOpen(true)}
            type="button"
          >
            <Menu aria-hidden="true" size={22} />
          </button>
        </div>
      </Container>

      {isMenuOpen ? (
        <div className="border-t border-brand-border bg-white lg:hidden" id="mobile-navigation">
          <Container className="py-5">
            <div className="mb-5 flex items-center justify-between">
              <Logo className="w-44" />
              <button
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-brand border border-brand-border bg-white text-brand-text transition-colors duration-150 hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
                type="button"
              >
                <X aria-hidden="true" size={22} />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="grid gap-2">
              {navLinks.map((link) => (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'rounded-brand px-3 py-3 text-base font-semibold transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-blue-50 text-brand-primary'
                        : 'text-brand-muted hover:bg-brand-light hover:text-brand-text',
                    )
                  }
                  end={link.to === '/'}
                  key={link.to}
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-brand bg-brand-primary px-4 text-sm font-semibold text-white shadow-soft transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                to="/contact"
              >
                Request a Quote
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;

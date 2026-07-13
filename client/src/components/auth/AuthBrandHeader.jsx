import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';

function AuthBrandHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between gap-4">
      <Link
        className="inline-flex rounded-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4"
        to="/"
      >
        <Logo className="w-44 sm:w-52" />
      </Link>
      <Link
        className="inline-flex items-center gap-2 rounded-brand px-2 py-2 text-sm font-semibold text-brand-muted transition-colors duration-150 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        to="/"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Home
      </Link>
    </header>
  );
}

export default AuthBrandHeader;

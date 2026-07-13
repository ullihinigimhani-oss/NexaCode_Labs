import { Outlet } from 'react-router-dom';
import AuthBackgroundShapes from '../components/auth/AuthBackgroundShapes.jsx';
import AuthBrandHeader from '../components/auth/AuthBrandHeader.jsx';
import AuthCard from '../components/auth/AuthCard.jsx';
import AuthVisualPanel from '../components/auth/AuthVisualPanel.jsx';

function AuthLayout() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-brand-light text-brand-text lg:grid lg:grid-cols-[42%_58%]">
      <main className="relative flex min-h-screen flex-col overflow-hidden px-4 py-5 sm:px-7 lg:px-10 xl:px-14">
        <AuthBackgroundShapes className="lg:hidden" />

        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col">
          <AuthBrandHeader />

          <div className="flex flex-1 items-center py-7 sm:py-10 lg:py-8">
            <AuthCard>
              <Outlet />
            </AuthCard>
          </div>

          <footer className="relative z-10 pb-2 text-center text-xs text-brand-muted sm:text-sm">
            Copyright {currentYear} NexaCode Labs. All rights reserved.
          </footer>
        </div>
      </main>

      <AuthVisualPanel />
    </div>
  );
}

export default AuthLayout;

import { Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AuthStatusPage from '../pages/auth/AuthStatusPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage.jsx';
import VerifyOtpPage from '../pages/auth/VerifyOtpPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import BrandPreviewPage from '../pages/BrandPreviewPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import PortfolioPage from '../pages/PortfolioPage.jsx';
import ServicesPage from '../pages/ServicesPage.jsx';
import UiPreviewPage from '../pages/UiPreviewPage.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="auth/status" element={<AuthStatusPage />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="brand-preview" element={<BrandPreviewPage />} />
        <Route path="ui-preview" element={<UiPreviewPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

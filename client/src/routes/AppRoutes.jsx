import { Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout.jsx';
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

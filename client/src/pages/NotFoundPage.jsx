import { Link } from 'react-router-dom';
import Container from '../components/ui/Container.jsx';

function NotFoundPage() {
  return (
    <Container className="py-16 sm:py-20">
      <section>
        <h1 className="text-3xl font-semibold text-brand-text">Page not found</h1>
        <p className="mt-4 text-brand-muted">The page you are looking for does not exist.</p>
        <Link className="mt-6 inline-block font-medium text-brand-primary" to="/">
          Return home
        </Link>
      </section>
    </Container>
  );
}

export default NotFoundPage;

import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section>
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-4 text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link className="mt-6 inline-block font-medium text-slate-900" to="/">
        Return home
      </Link>
    </section>
  );
}

export default NotFoundPage;

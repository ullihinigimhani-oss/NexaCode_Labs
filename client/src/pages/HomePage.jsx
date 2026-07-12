import Container from '../components/ui/Container.jsx';

function HomePage() {
  return (
    <Container className="py-16 sm:py-20">
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-brand-primary">
          Software Development Agency
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-brand-text">Vertex Solutions</h1>
        <p className="mt-4 max-w-2xl text-brand-muted">
          Initial homepage placeholder for the Vertex Solutions website.
        </p>
      </section>
    </Container>
  );
}

export default HomePage;

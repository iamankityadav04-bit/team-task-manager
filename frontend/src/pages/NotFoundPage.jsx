import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
    <div className="max-w-md text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-muted">The page you are looking for does not exist or you do not have access to it.</p>
      <Link to="/dashboard" className="btn-primary mt-6">
        Go to dashboard
      </Link>
    </div>
  </main>
);

export default NotFoundPage;

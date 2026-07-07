import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold text-charcoal mb-4">Something Went Wrong</h2>
        <p className="text-charcoal-light mb-2">{error?.statusText || error?.message || 'An unexpected error occurred.'}</p>
        <Link to="/" className="inline-block mt-4 bg-accent text-primary px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-dark no-underline transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

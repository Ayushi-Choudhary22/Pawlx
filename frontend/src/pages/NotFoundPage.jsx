import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Button from '@/components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-7xl font-bold text-primary-light">404</span>
      <h1 className="text-xl font-bold text-ink mt-4 mb-2">Page not found</h1>
      <p className="text-sm text-ink-muted mb-6 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link to="/">
        <Button icon={<FiArrowLeft />}>Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;

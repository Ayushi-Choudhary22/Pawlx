import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            P
          </span>
          <span className="text-xl font-bold text-ink">PAWLX</span>
        </Link>
        <div className="card p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

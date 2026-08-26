import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiBell, FiUser, FiSearch } from 'react-icons/fi';
import { NAV_LINKS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import GlobalSearchBar from '@/components/layout/GlobalSearchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
            P
          </span>
          <span className="text-lg font-bold text-ink tracking-tight">PAWLX</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-primary bg-primary-light' : 'text-ink-muted hover:text-ink hover:bg-surface'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-lg text-ink-muted hover:bg-surface hover:text-ink transition-colors"
          >
            <FiSearch size={18} />
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/notifications')}
                className="p-2 rounded-lg text-ink-muted hover:bg-surface hover:text-ink transition-colors"
              >
                <FiBell size={18} />
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="p-2 rounded-lg text-ink-muted hover:bg-surface hover:text-ink transition-colors"
              >
                <FiShoppingCart size={18} />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-surface transition-colors"
              >
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="h-7 w-7 rounded-full bg-primary-light text-primary flex items-center justify-center">
                    <FiUser size={14} />
                  </span>
                )}
                <span className="text-sm font-medium text-ink">{user?.name?.split(' ')[0]}</span>
              </button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </>
          )}
        </div>

        <button className="lg:hidden text-ink" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {isSearchOpen && <GlobalSearchBar onClose={() => setIsSearchOpen(false)} />}

      {isOpen && (
        <div className="lg:hidden border-t border-border px-5 py-4 space-y-1 bg-white">
          <button
            onClick={() => { setIsSearchOpen(true); setIsOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-ink hover:bg-surface"
          >
            <FiSearch size={16} /> Search
          </button>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-ink hover:bg-surface"
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-3 flex gap-2">
            {isAuthenticated ? (
              <Button className="flex-1" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button className="flex-1" variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button className="flex-1" variant="primary" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiHeart,
  FiCalendar,
  FiShoppingBag,
  FiUser,
  FiSettings,
  FiMessageCircle,
  FiClipboard,
  FiClipboard as FiQueue,
  FiUsers,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/constants';

const Sidebar = () => {
  const { user } = useAuth();
  const isProfessional = [ROLES.VETERINARIAN, ROLES.PET_SITTER, ROLES.GROOMER].includes(user?.role);

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: FiGrid },
  ];

  if (isProfessional) {
    links.push({ label: 'My Queue', path: '/my-queue', icon: FiQueue });
  }

  links.push(
    { label: 'My Pets', path: '/pet-care', icon: FiHeart },
    { label: 'Calendar', path: '/calendar', icon: FiCalendar },
    { label: 'Appointments', path: '/appointments', icon: FiCalendar },
    { label: 'Orders', path: '/orders', icon: FiShoppingBag },
    { label: 'My Applications', path: '/my-applications', icon: FiClipboard },
    { label: 'Temporary Adoption', path: '/temporary-adoption', icon: FiUsers },
    { label: 'AI Assistant', path: '/ai-assistant', icon: FiMessageCircle },
    { label: 'Profile', path: '/profile', icon: FiUser },
    { label: 'Settings', path: '/settings', icon: FiSettings }
  );

  return (
    <aside className="hidden md:block w-60 shrink-0 border-r border-border bg-white min-h-[calc(100vh-4rem)] py-6 px-3">
      <nav className="space-y-1">
        {links.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-light text-primary' : 'text-ink-muted hover:bg-surface hover:text-ink'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

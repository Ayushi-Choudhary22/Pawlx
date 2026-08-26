import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const FOOTER_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Blog', path: '/blog' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Vet Booking', path: '/vets' },
      { label: 'Pet Sitters', path: '/pet-sitters' },
      { label: 'Grooming', path: '/grooming' },
      { label: 'Adoption', path: '/adoption' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', path: '/help' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Privacy Policy', path: '/privacy' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
              P
            </span>
            <span className="text-lg font-bold text-ink">PAWLX</span>
          </Link>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            Everything your pet needs, in one trusted ecosystem.
          </p>
          <div className="flex gap-3 text-ink-muted">
            <FiInstagram size={16} className="hover:text-primary cursor-pointer transition-colors" />
            <FiTwitter size={16} className="hover:text-primary cursor-pointer transition-colors" />
            <FiFacebook size={16} className="hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-ink mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-ink-muted hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border py-5">
        <p className="text-center text-xs text-ink-muted">
          © {new Date().getFullYear()} PAWLX. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

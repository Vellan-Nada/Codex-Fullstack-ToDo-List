import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  { label: 'Product', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pricing', href: '/upgrade' }
];

function Navbar() {
  const location = useLocation();
  const { user, plan, signOut } = useAuth();

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#f8fafc' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
          TaskForge
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                fontWeight: 600,
                color: location.pathname === link.href ? 'var(--color-primary)' : 'inherit'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <span className="chip">{plan === 'premium' ? 'Premium' : 'Free'}</span>
              <button className="btn btn-outline" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

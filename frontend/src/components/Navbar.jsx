import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Navbar() {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('access')) {
      api.get('me/').then(r => setMe(r.data)).catch(() => {});
    }
  }, [location.pathname]);

  if (!localStorage.getItem('access') || !me) return null;

  const isAdmin = me.is_superuser || me.roles.includes('admin');
  const isWaiter = me.roles.includes('waiter');
  const isCook = me.roles.includes('cook');

  const links = [
    ...(isAdmin ? [{ to: '/dishes', label: 'Plats' }] : []),
    ...(isAdmin ? [{ to: '/categories', label: 'Catégories' }] : []),
    ...(isAdmin || isWaiter ? [{ to: '/tables', label: 'Tables' }] : []),
    ...(isAdmin || isWaiter || isCook ? [{ to: '/orders', label: 'Commandes' }] : []),
    ...(isAdmin || isWaiter ? [{ to: '/orders/new', label: 'Nouvelle commande' }] : []),
    ...(isAdmin ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ];

  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 28,
      padding: '20px 40px', borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-bg)',
    }}>
      <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-gold-light)' }}>
        Le Restaurant
      </Link>
      <div style={{ display: 'flex', gap: 24, marginLeft: 20 }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em',
            color: location.pathname === l.to ? 'var(--color-gold)' : 'var(--color-text-muted)',
          }}>
            {l.label}
          </Link>
        ))}
      </div>
      <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: 12 }}>
        {me.username} ({me.roles.join(', ') || 'admin'})
        <button onClick={logout} style={{ padding: '6px 14px' }}>Logout</button>
      </span>
    </nav>
  );
}
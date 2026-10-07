import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';

export default function RoleProtected({ children, roles }) {
  const [me, setMe] = useState(undefined); // undefined = loading

  useEffect(() => {
    if (!localStorage.getItem('access')) { setMe(null); return; }
    api.get('me/').then(r => setMe(r.data)).catch(() => setMe(null));
  }, []);

  if (!localStorage.getItem('access')) return <Navigate to="/login" />;
  if (me === undefined) return <div className="page"><p>Chargement...</p></div>;
  if (me === null) return <Navigate to="/login" />;

  const allowed = me.is_superuser || me.roles.some(r => roles.includes(r));
  if (!allowed) return <div className="page"><h1>Accès refusé</h1><p>Vous n'avez pas la permission de voir cette page.</p></div>;

  return children;
}
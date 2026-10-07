import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => {
    const load = () => api.get('dashboard/').then(r => setS(r.data));
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  if (!s) return <div className="page"><p>Chargement...</p></div>;

  return (
    <div className="page">
      <h1>Tableau de bord</h1>
      <div className="stats-grid">
        <div className="stat-box"><h2>{s.revenue_today} DH</h2><p>Chiffre d'affaires</p></div>
        <div className="stat-box"><h2>{s.orders_today}</h2><p>Commandes aujourd'hui</p></div>
        <div className="stat-box"><h2>{s.active_orders}</h2><p>En cours</p></div>
        <div className="stat-box"><h2>{s.occupied_tables}/{s.total_tables}</h2><p>Tables occupées</p></div>
      </div>
    </div>
  );
}
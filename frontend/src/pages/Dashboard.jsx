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

  if (!s) return <p>Loading...</p>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      <div><h2>{s.revenue_today} DH</h2><p>Chiffre d'affaires</p></div>
      <div><h2>{s.orders_today}</h2><p>Commandes aujourd'hui</p></div>
      <div><h2>{s.active_orders}</h2><p>En cours</p></div>
      <div><h2>{s.occupied_tables}/{s.total_tables}</h2><p>Tables occupées</p></div>
    </div>
  );
}
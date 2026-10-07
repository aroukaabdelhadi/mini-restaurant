import { useEffect, useState } from 'react';
import api from '../api/axios';

const NEXT = { pending: 'preparing', preparing: 'served', served: 'paid' };
const LABEL = { pending: 'En attente', preparing: 'En préparation', served: 'Servie', paid: 'Payée' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get('orders/').then(r => setOrders(r.data));

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const advance = async (o) => {
    try {
      await api.patch(`orders/${o.id}/set_status/`, { status: NEXT[o.status] });
      load();
    } catch (e) { alert(e.response?.data?.detail || 'Erreur'); }
  };

  return (
    <div className="page">
      <h1>Commandes en cours</h1>
      <div style={{ display: 'grid', gap: 16 }}>
        {orders.filter(o => o.status !== 'paid').map(o => (
          <div key={o.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
                Commande #{o.id} — Table {o.table}
              </span>
              <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {o.items.map(i => <li key={i.id}>{i.quantity} × {i.dish_name || `plat #${i.dish}`}</li>)}
              </ul>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge badge-${o.status}`}>{LABEL[o.status]}</span>
              <p style={{ color: 'var(--color-gold-light)', fontSize: '1.1rem', margin: '8px 0' }}>{o.total} DH</p>
              {NEXT[o.status] && <button onClick={() => advance(o)}>→ {LABEL[NEXT[o.status]]}</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('orders/');
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les commandes.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Commandes</h1>

      {error && <p>{error}</p>}

      {orders.length === 0 ? (
        <p>Aucune commande.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '10px',
            }}
          >
            <h3>Commande #{order.id}</h3>
            <p>Table: {order.table}</p>
            <p>Status: {order.status}</p>
            <p>Total: {order.total} DH</p>
          </div>
        ))
      )}
    </div>
  );
}

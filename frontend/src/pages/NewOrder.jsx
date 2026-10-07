import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NewOrder() {
  const [tables, setTables] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [table, setTable] = useState('');
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get('tables/').then(r => setTables(r.data));
    api.get('dishes/').then(r => setDishes(r.data.filter(d => d.available)));
  }, []);

  const add = (id) => setCart({ ...cart, [id]: (cart[id] || 0) + 1 });
  const sub = (id) => {
    const q = (cart[id] || 0) - 1;
    const c = { ...cart };
    if (q <= 0) delete c[id]; else c[id] = q;
    setCart(c);
  };

  const total = dishes.reduce((s, d) => s + (cart[d.id] || 0) * Number(d.price), 0);

  const submit = async () => {
    if (!table || Object.keys(cart).length === 0) return alert('Choisir table w plats');
    await api.post('orders/', {
      table,
      items: Object.entries(cart).map(([dish, quantity]) => ({ dish: Number(dish), quantity })),
    });
    navigate('/orders');
  };

  return (
    <div className="page">
      <h1>Nouvelle commande</h1>
      <div className="form-row">
        <select value={table} onChange={e => setTable(e.target.value)}>
          <option value="">— Choisir une table —</option>
          {tables.filter(t => !t.is_occupied).map(t => <option key={t.id} value={t.id}>Table {t.number}</option>)}
        </select>
      </div>

      <ul className="item-list">
        {dishes.map(d => (
          <li key={d.id}>
            <span className="name">{d.name}</span>
            <span className="price">{d.price} DH</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => sub(d.id)}>−</button>
              <span>{cart[d.id] || 0}</span>
              <button onClick={() => add(d.id)}>+</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="card" style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Total: {total} DH</h2>
        <button onClick={submit}>Envoyer la commande</button>
      </div>
    </div>
  );
}
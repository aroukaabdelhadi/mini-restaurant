import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState(4);

  const load = () => api.get('tables/').then(r => setTables(r.data));
  useEffect(() => { load(); }, []);

  const add = async () => { await api.post('tables/', { number, capacity }); setNumber(''); load(); };
  const remove = async (id) => { await api.delete(`tables/${id}/`); load(); };

  return (
    <div className="page">
      <h1>Les Tables</h1>
      <div className="form-row card">
        <input type="number" placeholder="N° table" value={number} onChange={e => setNumber(e.target.value)} />
        <input type="number" placeholder="Capacité" value={capacity} onChange={e => setCapacity(e.target.value)} />
        <button onClick={add}>Ajouter</button>
      </div>

      <div className="table-grid">
        {tables.map(t => (
          <div key={t.id} className={`table-box ${t.is_occupied ? 'occupied' : 'free'}`}>
            <b>N° {t.number}</b>
            <p>{t.capacity} places</p>
            <p style={{ color: t.is_occupied ? 'var(--color-danger)' : 'var(--color-success)' }}>
              {t.is_occupied ? 'Occupée' : 'Libre'}
            </p>
            <button onClick={() => remove(t.id)}>Suppr.</button>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get('categories/').then(r => setCategories(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) await api.patch(`categories/${editingId}/`, { name });
    else await api.post('categories/', { name });
    setName(''); setEditingId(null); load();
  };
  const edit = (c) => { setEditingId(c.id); setName(c.name); };
  const remove = async (id) => { if (confirm('Supprimer ?')) { await api.delete(`categories/${id}/`); load(); } };

  return (
    <div className="page">
      <h1>Catégories</h1>
      <form onSubmit={submit} className="form-row card">
        <input placeholder="Nom de la catégorie" value={name} onChange={e => setName(e.target.value)} required />
        <button>{editingId ? 'Modifier' : 'Ajouter'}</button>
      </form>

      <ul className="item-list">
        {categories.map(c => (
          <li key={c.id}>
            <span className="name">{c.name}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => edit(c)}>Modifier</button>
              <button onClick={() => remove(c.id)}>Suppr.</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
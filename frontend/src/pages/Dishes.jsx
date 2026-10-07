import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '', image: null });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const [d, c] = await Promise.all([api.get('dishes/'), api.get('categories/')]);
    setDishes(d.data);
    setCategories(c.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', form.price);
    fd.append('category', form.category);
    if (form.image) fd.append('image', form.image);
    if (editingId) await api.patch(`dishes/${editingId}/`, fd);
    else await api.post('dishes/', fd);
    setForm({ name: '', price: '', category: '', image: null });
    setEditingId(null);
    load();
  };

  const edit = (d) => { setEditingId(d.id); setForm({ name: d.name, price: d.price, category: d.category, image: null }); };
  const remove = async (id) => { if (confirm('Supprimer ?')) { await api.delete(`dishes/${id}/`); load(); } };
  const toggle = async (d) => { await api.patch(`dishes/${d.id}/`, { available: !d.available }); load(); };

  return (
    <div className="page">
      <h1>La Carte</h1>
      <form onSubmit={submit} className="form-row card">
        <input placeholder="Nom du plat" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input type="number" step="0.01" placeholder="Prix" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
          <option value="">Catégorie</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
        <button>{editingId ? 'Modifier' : 'Ajouter'}</button>
      </form>

      <ul className="item-list">
        {dishes.map(d => (
          <li key={d.id}>
            <span className="name">{d.name}</span>
            <span className="price">{d.price} DH</span>
            <span className={`badge ${d.available ? 'badge-served' : 'badge-pending'}`}>
              {d.available ? 'Disponible' : 'Indisponible'}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => edit(d)}>Modifier</button>
              <button onClick={() => toggle(d)}>Dispo</button>
              <button onClick={() => remove(d.id)}>Suppr.</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
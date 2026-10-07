import { useState } from 'react';
import axios from 'axios';

export default function Reservation() {
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', guests: 2, note: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/reservations/', form);
      setSent(true);
    } catch {
      setError('Une erreur est survenue, réessayez.');
    }
  };

  if (sent) {
    return (
      <div className="page" style={{ textAlign: 'center' }}>
        <h1 style={{ border: 'none' }}>Merci !</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Votre demande de réservation a été envoyée. Nous vous contacterons pour confirmer.
        </p>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 480 }}>
      <h1>Réserver une table</h1>
      <form onSubmit={submit} className="card" style={{ display: 'grid', gap: 14 }}>
        <input placeholder="Nom complet" required value={form.name}
               onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Téléphone" required value={form.phone}
               onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input type="date" required value={form.date}
               onChange={e => setForm({ ...form, date: e.target.value })} />
        <input type="time" required value={form.time}
               onChange={e => setForm({ ...form, time: e.target.value })} />
        <input type="number" min="1" placeholder="Nombre de personnes" value={form.guests}
               onChange={e => setForm({ ...form, guests: e.target.value })} />
        <textarea placeholder="Note (optionnel)" rows={3} value={form.note}
               onChange={e => setForm({ ...form, note: e.target.value })}
               style={{ background: 'var(--color-bg-light)', border: '1px solid var(--color-border)', color: 'var(--color-text)', padding: 10, borderRadius: 2, fontFamily: 'var(--font-sans)' }} />
        {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
        <button>Confirmer la réservation</button>
      </form>
    </div>
  );
}
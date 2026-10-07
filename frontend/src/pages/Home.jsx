import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/menu/').then(r => setMenu(r.data));
  }, []);

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* HERO */}
      <header style={{
        textAlign: 'center', padding: '80px 24px 60px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{
          width: 64, height: 64, margin: '0 auto 20px',
          border: '1px solid var(--color-gold)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-gold-light)',
        }}>
          LR
        </div>
        <h1 style={{ fontSize: '2.8rem', border: 'none', display: 'inline-block' }}>
          Le Restaurant
        </h1>
        <p style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
          Cuisine raffinée · Service attentionné
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/login"><button>Espace équipe</button></Link>
        </div>
      </header>

      {/* HORAIRES */}
      <section style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        <p>Déjeuner 12h00 – 14h00 &nbsp;·&nbsp; Dîner 19h30 – 22h00</p>
        <p>Fermé le dimanche</p>
      </section>

      {/* MENU */}
      <main className="page" style={{ maxWidth: 900 }}>
        {menu.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            La carte sera bientôt disponible.
          </p>
        )}

        {menu.map(cat => (
          <section key={cat.id} style={{ marginBottom: 48 }}>
            <h2 style={{
              textAlign: 'center', fontSize: '1.4rem', marginBottom: 28,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {cat.name}
            </h2>
            <div style={{ display: 'grid', gap: 20 }}>
              {cat.dishes.map(d => (
                <div key={d.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  borderBottom: '1px dotted var(--color-border)', paddingBottom: 10,
                }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-cream)' }}>
                    {d.name}
                  </span>
                  <span style={{ flex: 1, borderBottom: '1px dotted var(--color-border)', margin: '0 10px', transform: 'translateY(-4px)' }} />
                  <span style={{ color: 'var(--color-gold-light)' }}>{d.price} DH</span>
                </div>
              ))}
              {cat.dishes.length === 0 && (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                  Aucun plat disponible pour le moment.
                </p>
              )}
            </div>
          </section>
        ))}
      </main>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center', padding: '40px 24px', borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)', fontSize: '0.8rem',
      }}>
        © {new Date().getFullYear()} Le Restaurant — Tous droits réservés
      </footer>
    </div>
  );
}
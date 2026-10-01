import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NewOrder() {
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const { data } = await api.get('dishes/');
        setDishes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDish) {
      alert('Choisissez un plat.');
      return;
    }

    try {
      await api.post('orders/', {
        items: [
          {
            dish: Number(selectedDish),
            quantity: Number(quantity),
          },
        ],
      });

      alert('Commande créée avec succès.');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la commande.');
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h1>Nouvelle commande</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <label>Plat</label>

        <select
          value={selectedDish}
          onChange={(e) => setSelectedDish(e.target.value)}
          required
        >
          <option value="">-- Choisir un plat --</option>

          {dishes.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.name} - {dish.price} DH
            </option>
          ))}
        </select>

        <label>Quantité</label>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">
          Créer la commande
        </button>
      </form>
    </div>
  );
}
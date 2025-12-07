import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../../components/ButtonComponents/Button.tsx';
import CategoryTile from '../../components/TileComponents/CategoryTile.tsx';
import type { DishType } from './CustomerDish';
import type { Dish } from '../any/MenuBoard.tsx';
import './CustomerHome.css';

const API_BASE = import.meta.env.VITE_API_BASE;

function CustomerHome() {
  const navigate = useNavigate();

  const goToDishPage = (dishType: DishType, entreeCount?: number) => {
    navigate('/Customer/CustomerDish', {
      state: { dishType, entreeCount },
    });
  };

  const goToCheckout = () => {
    navigate('/Customer/CustomerCheckout');
  };

  const [seasonal, setSeasonal] = useState<Dish[]>([]);
  
    useEffect(() => {
      async function load() {
        try{
          const res = await fetch(`${API_BASE}/api/dishes`);
          const all: Dish[] = await res.json();
          setSeasonal(all.filter(d => d.type.toLowerCase() === "seasonal"));
        } catch(err){
          console.error("Failed to fetch menu:", err);
        }
      }
      load();
    }, []);

  return (
    <div className="customer-home">
      <h1 className="mission-title">Agent, Choose Your Operation</h1>
        <div className="tile-grid">
          <CategoryTile title="Bowl" subtitle="1 Entrée + Side" onClick={() => goToDishPage('entree', 1)} />
          <CategoryTile title="Plate" subtitle="2 Entrées + Side" onClick={() => goToDishPage('entree', 2)} />
          <CategoryTile title="Big Plate" subtitle="3 Entrées + Side" onClick={() => goToDishPage('entree', 3)} />

          <CategoryTile title="Appetizers" image="/assets/rangoon.png" onClick={() => goToDishPage('appetizer')} />
          <CategoryTile title="Sides" image="/assets/ricefried.png" onClick={() => goToDishPage('side')} />
          <CategoryTile title="Drinks" image="/assets/coke.png" onClick={() => goToDishPage('drink')} />

          {seasonal.length > 0 && (
          <CategoryTile
            title="Seasonal Operations"
            subtitle="⚠ Limited Time Mission  ⚠"
            highlight
            onClick={() => goToDishPage('season')}
          />)}
        </div>

        <div className="checkout-buttons">
            <Button name="Mission Briefing (Checkout)" onClick={goToCheckout} />
        </div>
    </div>
  );
}

export default CustomerHome;

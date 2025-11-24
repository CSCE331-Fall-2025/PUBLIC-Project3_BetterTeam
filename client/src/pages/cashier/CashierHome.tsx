import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ButtonComponents/Button.tsx';
import type { Dish } from './CashierDish';
import { useEffect, useState } from 'react';
import './CashierHome.css';

type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

interface LocationState {
  cart?: Dish[];
}

interface IngredientOption{
  inventory_id: number;
  name: string;
}

function CashierHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const cart: Dish[] = state?.cart || [];
  const total = cart.reduce((sum, d) => sum + d.price, 0);
  const [ingredientNames, setIngredientNames] = useState<Record<number, Record<number, string>>>({});


  useEffect(() => {
    async function loadIngredients(){
      const map: Record<number, Record<number, string>> = {};

      for(const dish of cart){
        try{
          const res = await fetch(
            `http://localhost:4000/api/dishes/${dish.dish_id}/ingredients`
          );
          if(!res.ok) continue;

          const ingList: IngredientOption[] = await res.json();

          map[dish.dish_id] = {};
          for(const ing of ingList){
            map[dish.dish_id][ing.inventory_id] = ing.name;
          }
        } catch(err){
          console.error("Error loading ingredients:", err);
        }
      }
      setIngredientNames(map);
    }

    if(cart.length > 0) loadIngredients();
  }, [cart]);

  const grammerLevel = (level: string) => {
    if(level === "none") return "No";
    if(level === "extra") return "Extra";
    return "";
  };

  const goToDishPage = (type: DishType, entreeCount = 1) => {
    navigate('/Cashier/CashierDish', { state: { type, entreeCount, cart } });
  };

  const handleClearCart = () => {
    if (window.confirm("Cancel this order?")) {
      navigate('/Cashier/CashierHome', { state: { cart: [] } });
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await fetch("http://localhost:4000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          fk_customer: 11,
          fk_employee: 15
        }),
      });

      alert("Order placed!");
      navigate('/Cashier/CashierHome', { state: { cart: [] } });

    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="cashier-home">
      <div className="button-container">
        <Button name="Bowl" onClick={() => goToDishPage('entree', 1)} />
        <Button name="Plate" onClick={() => goToDishPage('entree', 2)} />
        <Button name="Big Plate" onClick={() => goToDishPage('entree', 3)} />
        <Button name="Appetizer" onClick={() => goToDishPage('appetizer')} />
        <Button name="Sides" onClick={() => goToDishPage('side')} />
        <Button name="Drinks" onClick={() => goToDishPage('drink')} />
      </div>

      <div className="receipt-section">
        <h2>Current Order</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cart.map((dish, i) => (
                <li key={i}>
                  <span>{dish.name}</span> - ${dish.price.toFixed(2)}

                  {dish.customization && (
                    <ul className="customization-list">
                      {Object.entries(dish.customization).map(([invIdStr, level]) => {
                        const invId = Number(invIdStr);
                        const ingName = ingredientNames[dish.dish_id]?.[invId];
                        if(level === "normal") return null;

                        return(
                          <li key={invId} className="custom-line">
                            {grammerLevel(level)} {ingName}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <h3>Total: ${total.toFixed(2)}</h3>
          </>
        )}

        <div className="checkout-buttons">
          <Button name="Clear Order" onClick={handleClearCart} disabled={cart.length === 0} />
          <Button name="Place Order" onClick={handlePlaceOrder} disabled={cart.length === 0} />
        </div>
      </div>
    </div>
  );
}

export default CashierHome;

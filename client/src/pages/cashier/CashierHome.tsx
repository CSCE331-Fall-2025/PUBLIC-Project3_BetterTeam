import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ButtonComponents/Button.tsx';
import type { Dish } from './CashierDish';
import { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext.tsx";
import CategoryTile from '../../components/TileComponents/CategoryTile.tsx';

import './CashierHome.css';

const API_BASE = import.meta.env.VITE_API_BASE;

import type { Order } from '../../components/KitchenComponents/OrderCard.tsx';


type DishType = 'entree' | 'appetizer' | 'drink' | 'side' | 'season';

interface LocationState {
  cart?: Dish[];
}

interface IngredientOption{
  inventory_id: number;
  name: string;
}

interface DishTyped{
  dish_id: number;
  name: string;
  price: number;
  type: string;
  image_url: string;
}

function groupIntoMeals(cart : Dish[]): Dish[][] {
  const meals: Dish[][] = [];
  let current: Dish[] = [];

  for(const dish of cart){
    current.push(dish);

    if(dish.type === "side"){
      meals.push(current);
      current = [];
    }
  }

  if(current.length > 0){
    meals.push(current);
  }

  return meals;
}

function getMealName(meal: Dish[]){
    const types = meal.map(d => d.type);
    const entreeCount = types.filter(t => t === "entree").length;

    if(entreeCount === 1) return "Bowl";
    if(entreeCount === 2) return "Plate";
    if(entreeCount === 3) return "Big Plate";

    if(types.includes("appetizer")) return "App";
    if(types.includes("drink")) return "Drink";
    if(types.includes("side")) return "Side";
    if(types.includes("season")) return "Seasonal";
    return "Meal";
}

function CashierHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const cart: Dish[] = state?.cart || [];
  const meals = groupIntoMeals(cart);
  const total = cart.reduce((sum, d) => sum + Number(d.price), 0);
  const [ingredientNames, setIngredientNames] = useState<Record<number, Record<number, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useAuth();
  const employeeID = user?.id ?? 29;

  useEffect(() => {
    async function loadIngredients(){
      const map: Record<number, Record<number, string>> = {};

      for(const dish of cart){
        try{
          const res = await fetch(
            `${API_BASE}/api/dishes/${dish.dish_id}/ingredients`
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
    if(isProcessing) return;
    setIsProcessing(true);

    try {

      const response = await fetch(`${API_BASE}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          fk_customer: 26,
          fk_employee: employeeID
        }),
      });

      const data = await response.json();

      if(!response.ok){
        alert(data.error || "Failed to place order.");
        return;
      }
      
      const transactionId = data.transaction_id;

      if(!transactionId){
        alert("Error: No transaction ID returned.");
        return;
      }

      alert(`Order placed! Order Number: #${transactionId}`);

      //retrieve orders
      const storedOrders = localStorage.getItem("orders");
      let parsedOrders: Order[] = [];
      if (storedOrders){ parsedOrders = JSON.parse(storedOrders);}
      //push new order to orders
      let john = (Math.random()).toString();//uhhhh randomized id for now
      const newOrder: Order = {name:john, slot:0, items:cart};//name should be unique id somehow
      parsedOrders.push(newOrder);
      localStorage.setItem("orders",JSON.stringify(parsedOrders));
      //log for potential debugging
      console.log(parsedOrders);

      navigate('/Cashier/CashierHome', { state: { cart: [] } });

    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

    const [seasonal, setSeasonal] = useState<DishTyped[]>([]);
    
      useEffect(() => {
        async function load() {
          try{
            const res = await fetch(`${API_BASE}/api/dishes`);
            const all: DishTyped[] = await res.json();
            setSeasonal(all.filter(d => d.type.toLowerCase() === "seasonal"));
          } catch(err){
            console.error("Failed to fetch menu:", err);
          }
        }
        load();
      }, []);

    return (
      <div className="cashier-home-layout">
        <div className="cashier-button-panel">
          <h1 className="cashier-title">Cashier Menu</h1>

          <div className="cashier-tile-grid">
            <CategoryTile title="Bowl" subtitle="1 Entrée + Side" onClick={() => goToDishPage('entree', 1)} />
            <CategoryTile title="Plate" subtitle="2 Entrées + Side" onClick={() => goToDishPage('entree', 2)} />
            <CategoryTile title="Big Plate" subtitle="3 Entrées + Side" onClick={() => goToDishPage('entree', 3)} />

            <CategoryTile title="Appetizers" onClick={() => goToDishPage('appetizer')} />
            <CategoryTile title="Sides" onClick={() => goToDishPage('side')} />
            <CategoryTile title="Drinks" onClick={() => goToDishPage('drink')} />

            {seasonal.length > 0 && (
            <CategoryTile
              title="Seasonal Ops"
              subtitle="⚠ Limited Time ⚠"
              highlight
              onClick={() => goToDishPage('season')}
            />)}
          </div>
        </div>
        <div className="cashier-receipt-panel">
          <h2>Current Order</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul>
                {meals.map((meal, mealIndex) => (
                  <li key={mealIndex}>
                    <h3>{getMealName(meal)}</h3>
                    <ul>
                      {meal.map((dish, idx) => (
                        <li key={idx}>
                          {dish.name} - ${dish.price}

                          {dish.customization && (
                            <ul className="customization-list">
                              {Object.entries(dish.customization).map(([invIdStr, level]) => {
                                const invId = Number(invIdStr);
                                const ingName = ingredientNames[dish.dish_id]?.[invId];

                                if(level === "normal") return null;

                                return (
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
                  </li>
                ))}
              </ul>

              <h3>Total: ${total}</h3>
            </>
          )}

          <div className="checkout-buttons">
            <Button name="Clear Order" onClick={handleClearCart} disabled={cart.length === 0 || isProcessing} />
            <Button name="Place Order" onClick={handlePlaceOrder} disabled={cart.length === 0 || isProcessing} />
          </div>
        </div>
      </div>
    );

}

export default CashierHome;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ButtonComponents/Button.tsx';
import type { Dish } from './CashierDish';
import './CashierHome.css';

type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

interface LocationState {
  cart?: Dish[];
}

function CashierHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const cart: Dish[] = state?.cart || [];

  const total = cart.reduce((sum, dish) => sum + dish.price, 0);

  const goToDishPage = (type: DishType, entreeCount = 1) => {
    navigate('/Cashier/CashierDish', { state: { type, entreeCount, cart } });
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to cancel your order?')) {
      navigate('/Cashier/CashierHome', { state: { cart: [] } });
    }
  };

  const handlePlaceOrder = () => {
    alert('Order placed!');
    navigate('/Cashier/CashierHome', { state: { cart: [] } });
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
                  <span>{dish.name}</span> - <span>${dish.price.toFixed(2)}</span>
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

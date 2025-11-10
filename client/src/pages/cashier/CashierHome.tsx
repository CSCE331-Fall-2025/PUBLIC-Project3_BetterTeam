import React, { useState } from 'react';
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx';
import Button from '../../components/ButtonComponents/Button.tsx';
import type { Dish } from '../customer/CustomerDish';
import CustomerDish from '../customer/CustomerDish';
import './CashierHome.css';

type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

function CashierHome() {
  const [dishType, setDishType] = useState<DishType>('entree');
  const [entreeCount, setEntreeCount] = useState(1);
  const [cart, setCart] = useState<Dish[]>([]);
  const [selectingDish, setSelectingDish] = useState(false);

  const handleAddToCart = (selectedDishes: Dish[]) => {
    setCart((prev) => [...prev, ...selectedDishes]);
    setSelectingDish(false);
  };

  const handleClearCart = () => setCart([]);
  const total = cart.reduce((sum, dish) => sum + dish.price, 0);
/* Basically all copied over from CustomerCheckout and CustomerHome and combined
Will theoretically send data to kitchen and manager page */
  return (
    <div className="cashier-home">
      <StaffHeader name="Cashier Home" />

      {!selectingDish ? (
        <>
          <div className="button-container">
            <Button name="Bowl" onClick={() => { setDishType('entree'); setEntreeCount(1); setSelectingDish(true); }} />
            <Button name="Plate" onClick={() => { setDishType('entree'); setEntreeCount(2); setSelectingDish(true); }} />
            <Button name="Big Plate" onClick={() => { setDishType('entree'); setEntreeCount(3); setSelectingDish(true); }} />
            <Button name="Appetizer" onClick={() => { setDishType('appetizer'); setSelectingDish(true); }} />
            <Button name="Sides" onClick={() => { setDishType('side'); setSelectingDish(true); }} />
            <Button name="Drinks" onClick={() => { setDishType('drink'); setSelectingDish(true); }} />
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
              <Button
                name="Place Order"
                onClick={() => {
                  alert('Order placed!');
                  setCart([]);
                }}
                disabled={cart.length === 0}
              />
            </div>
          </div>
        </>
      ) : (
        <CustomerDish
          type={dishType}
          entreeCount={entreeCount}
          onBack={() => setSelectingDish(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

export default CashierHome;

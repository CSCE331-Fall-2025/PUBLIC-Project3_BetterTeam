import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ButtonComponents/Button.tsx';
import type { Dish, DishType } from './CustomerDish';
import './CustomerHome.css';

interface LocationState {
  cart?: Dish[];
}

function CustomerHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const cart: Dish[] = state?.cart ?? [];

  const goToDishPage = (dishType: DishType, entreeCount?: number) => {
    navigate('/Customer/CustomerDish', {
      state: { cart, dishType, entreeCount },
    });
  };

  const goToCheckout = () => {
    navigate('/Customer/CustomerCheckout', { state: { cart } });
  };

  return (
    <div className="customer-home">
        <div className="button-container">
            <Button name="Bowl" onClick={() => goToDishPage('entree', 1)} />
            <Button name="Plate" onClick={() => goToDishPage('entree', 2)} />
            <Button name="Big Plate" onClick={() => goToDishPage('entree', 3)} />
            <Button name="Appetizer" onClick={() => goToDishPage('appetizer')} />
            <Button name="Sides" onClick={() => goToDishPage('side')} />
            <Button name="Drinks" onClick={() => goToDishPage('drink')} />
        </div>

        <div className="checkout-buttons">
            <Button name="Checkout" onClick={goToCheckout} />
        </div>
    </div>
  );
}

export default CustomerHome;

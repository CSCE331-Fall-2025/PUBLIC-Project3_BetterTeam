import { useNavigate } from 'react-router-dom';
import Button from '../../components/ButtonComponents/Button.tsx';
import type { DishType } from './CustomerDish';
import './CustomerHome.css';

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

  return (
    <div className="customer-home">
        <div className="button-container">
            <Button name="Bowl" onClick={() => goToDishPage('entree', 1)} />
            <Button name="Plate" onClick={() => goToDishPage('entree', 2)} />
            <Button name="Big Plate" onClick={() => goToDishPage('entree', 3)} />
            <Button name="Appetizer" onClick={() => goToDishPage('appetizer')} />
            <Button name="Sides" onClick={() => goToDishPage('side')} />
            <Button name="Drinks" onClick={() => goToDishPage('drink')} />
            <Button name="Seasonal" onClick={() => goToDishPage('season')}/>
        </div>

        <div className="checkout-buttons">
            <Button name="Checkout" onClick={goToCheckout} />
        </div>
    </div>
  );
}

export default CustomerHome;

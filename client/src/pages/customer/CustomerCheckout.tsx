import Button from '../../components/ButtonComponents/Button.tsx'
import type { Dish } from './CustomerDish';
import { useLocation, useNavigate } from 'react-router-dom';
import './CustomerCheckout.css'

interface LocationState{
    cart: Dish[];
}

function CustomerCheckout(){
    const location = useLocation();
    const navigate = useNavigate();
    const { cart = [] } = location.state as LocationState;

    const total = cart.reduce((sum, dish) => sum + dish.price, 0);

    const handlePlaceOrder = () => {
        alert('Order Placed!');
        navigate('/Customer/CustomerHome', { state: { cart: [] } });

        // TODO make transactionDish update after the model and controller stuff
    };

    const handleCancelOrder = () => {
        if(window.confirm('Are you sure you want to cancel your order?')){
            navigate('/Customer/CustomerHome', { state: { cart: [] } });
        }
    };

    const handleBack = () => {
        navigate('/Customer/CustomerHome', {state: { cart } })
    };

    return(
        <div className="checkout-page">
            <div className="receipt">
                {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <>
                        <h2>Receipt</h2>
                        <ul>
                            {cart.map((dish, index) => (
                                <li key={index}>
                                    <span>{dish.name}</span> - <span>${dish.price.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <h3>Total: ${total.toFixed(2)}</h3>
                    </>
                )}
            </div>
            <div className="checkout-buttons">
                <Button name="Back" onClick={handleBack} />
                <Button
                    name="Cancel Order"
                    onClick={handleCancelOrder}
                    disabled={cart.length === 0}
                />
                <Button
                    name="Place Order"
                    onClick={handlePlaceOrder}
                    disabled={cart.length === 0}
                />
            </div>
        </div>
    )
}

export default CustomerCheckout;

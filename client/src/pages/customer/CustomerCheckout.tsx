import React from 'react'
import Button from '../../components/ButtonComponents/Button.tsx'
import type { Dish } from './CustomerDish';
import './CustomerCheckout.css'

interface CustomerCheckoutProps{
    cart: Dish[];
    onBack: () => void;
    onClearCart: () => void;
}

function CustomerCheckout({cart, onBack, onClearCart}: CustomerCheckoutProps){
	console.log(cart);
    const total = cart.reduce((sum, dish) => sum + dish.price, 0);

    const handlePlaceOrder = () => {
        alert('Order placed!');
        onClearCart();
        onBack();
    };

    const handleCancelOrder = () => {
        if(window.confirm('Are you sure you want to cancel your order?')){
            onClearCart();
            onBack();
        }
    };

    return(
        <div className="checkout-page">
            <div className="receipt">
                {cart.length === 0 ? (
                    <p> Your Cart is empty lil bro.</p>
                ) : (
                    <>
                    <h2>Receipt</h2>
                    <ul>
                        {cart.map((dish, index) => (
                            <li key = {index}>
                                <span>{dish.name}</span> - <span>${dish.price.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: ${total.toFixed(2)}</h3>
                    </>
                )}
            </div>
            <div className="checkout-buttons">
                <Button name="Back" onClick={onBack}/>
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
    );
}

export default CustomerCheckout;

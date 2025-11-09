import React, { useState} from 'react';
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx';
import Button from '../../components/ButtonComponents/Button.tsx';
import CustomerDish from './CustomerDish';
import type { Dish } from './CustomerDish';
import CustomerCheckout from './CustomerCheckout';
import './CustomerHome.css';

type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

function CustomerHome() {
    const [page, setPage] = useState<'home' | 'dish' | 'checkout'>('home');
    const [dishType, setDishType] = useState<DishType>('entree');
    const [entreeCount, setEntreeCount] = useState(1);
    const [cart, setCart] = useState<Dish[]>([]);

    const handleAddToCart = (selectedDishes: Dish[]) => {
        setCart(prev => [...prev, ...selectedDishes]);
        setPage('home');
    };

    if(page == 'dish'){
        return(
            <CustomerDish
                type={dishType}
                entreeCount={entreeCount}
                onBack={() => setPage('home')}
                onAddToCart = {handleAddToCart}
            />
        );
    }

    if(page == 'checkout'){
        return(
            <CustomerCheckout 
                cart={cart}
                onBack={() => setPage('home')}
                onClearCart={() => setCart([])}/>
        );
    }
    return(
        <div className="customer-home">
            <GuestHeader name="Guest Page" />
            <div className="button-container">
                <Button name="Bowl" onClick={() => { setDishType('entree'); setEntreeCount(1); setPage('dish'); }} />
                <Button name="Plate" onClick={() => { setDishType('entree'); setEntreeCount(2); setPage('dish'); }} />
                <Button name="Big Plate" onClick={() => { setDishType('entree'); setEntreeCount(3); setPage('dish'); }} />
                <Button name="Appetizer" onClick={() => { setDishType('appetizer');  setPage('dish'); }} />
                <Button name="Sides" onClick={() => { setDishType('side'); setPage('dish'); }} />
                <Button name="Drinks" onClick={() => { setDishType('drink'); setPage('dish'); }} />
            </div>

            <div className="checkout-button">
                <Button name="Checkout" onClick={() => setPage('checkout')} />
            </div>
        </div>
    );
}

export default CustomerHome;
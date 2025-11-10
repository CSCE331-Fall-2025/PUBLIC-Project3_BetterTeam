import React, { useState} from 'react';
import Button from '../../components/ButtonComponents/Button.tsx';
import CustomerDish from './CustomerDish';
import './CustomerHome.css';

type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

function CustomerHome() {
    const [page, setPage] = useState<'home' | 'dish'>('home');
    const [dishType, setDishType] = useState<DishType>('entree');
    const [entreeCount, setEntreeCount] = useState(1);

    if(page == 'dish'){
        return(
            <CustomerDish
                type={dishType}
                entreeCount={entreeCount}
                onBack={() => setPage('home')}
            />
        );
    }
    return(
        <div className="customer-home">
            <div className="button-container">
                <Button name="Bowl" onClick={() => { setDishType('entree'); setEntreeCount(1); setPage('dish'); }} />
                <Button name="Plate" onClick={() => { setDishType('entree'); setEntreeCount(2); setPage('dish'); }} />
                <Button name="Big Plate" onClick={() => { setDishType('entree'); setEntreeCount(3); setPage('dish'); }} />
                <Button name="Appetizer" onClick={() => { setDishType('appetizer');  setPage('dish'); }} />
                <Button name="Sides" onClick={() => { setDishType('side'); setPage('dish'); }} />
                <Button name="Drinks" onClick={() => { setDishType('drink'); setPage('dish'); }} />
            </div>
        </div>
    )
}

export default CustomerHome;

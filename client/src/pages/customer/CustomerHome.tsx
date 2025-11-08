import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx';
import Button from '../../components/ButtonComponents/Button.tsx';
import './CustomerHome.css';


const page = {
    name: 'Guest Page',
    user: 'Customer',
};

function CustomerHome() {
    const navigate = useNavigate();


    const handleClick = (type: 'entree' | 'appetizer' | 'drink', entreeCount?: number) => {
        navigate('/customer/dish', {state: { type, entreeCount}});
    };
    
    return(
        <div className="customer-home">
            <GuestHeader name={page.name} />
            <div className="button-container">
                <Button name="Bowl" onClick={() => handleClick('entree', 1)}/>
                <Button name="Plate" onClick={() => handleClick('entree', 2)}/>
                <Button name="Big Plate" onClick={() => handleClick('entree', 3)}/>
                <Button name="Appetizer or Side" onClick={() => handleClick('appetizer')}/>
                <Button name="Drinks" onClick={() => handleClick('drink')}/>
            </div>
        </div>
    );
}

export default CustomerHome;
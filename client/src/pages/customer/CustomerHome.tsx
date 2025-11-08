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


    const handleClick = (mealType: 'bowl' | 'plate' | 'bigplate')
    return(
        <div className="customer-home">
            <GuestHeader name={page.name} />
            <div className="button-container">
                <Button name="Bowl" onClick={handleClick}/>
                <Button name="Plate" onClick={handleClick}/>
                <Button name="Big Plate" onClick={handleClick}/>
                <Button name="Appetizer or Side" onClick={handleClick}/>
                <Button name="Drinks" onClick={handleClick}/>
            </div>
        </div>
    );
}

export default CustomerHome;
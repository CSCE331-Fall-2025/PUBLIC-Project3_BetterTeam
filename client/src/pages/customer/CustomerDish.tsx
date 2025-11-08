import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import './CustomerDish.css';

interface Dish {
    name: string;
    price: number;
    imageUrl?: string;
}

const allEntrees: Dish[] = [
  { name: "Orange Chicken", price: 7, imageUrl: "../../../assets/orangechick.PNG" },
  { name: "Beijing Beef", price: 7, imageUrl: "../../../assets/beijing.PNG" },
  { name: "Honey Walnut Shrimp", price: 8, imageUrl: "../../../assets/shrimp.PNG" },
  { name: "Broccoli Beef", price: 6, imageUrl: "../../../assets/brocbeef.PNG" },
  { name: "Kung Pao Chicken", price: 7, imageUrl: "../../../assets/kungpao.PNG" }
];

const allSides: Dish[] = [
  { name: "Fried Rice", price: 4, imageUrl: "../../../assets/ricefried.PNG" },
  { name: "Chow Mein", price: 4, imageUrl: "../../../assets/chowmein.PNG" },
];

const allDrinks: Dish[] = [
  { name: "Coke", price: 4, imageUrl: "../../../assets/coke.PNG" },
  { name: "Dr. Pepper", price: 3, imageUrl: "../../../assets/drp.PNG" },
];

const allApps: Dish[] = [
  { name: "Cream Cheese Rangoon", price: 3, imageUrl: "../../../assets/rangoon.PNG" },
  { name: "Veggie Spring Roll", price: 3, imageUrl: "../../../assets/veggieroll.PNG" },
];

function CustomerDish() {
    const location = useLocation();
    const navigate = useNavigate();

    const { type, entreeCount = 1 } = (location.state || {}) as {
        type?: 'entree' | 'appetizer' | 'drink';
        entreeCount?: number;
    };

    if(!type){
        return(
            <div>
                <GuestHeader name="Menu" />
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                    Please go through the main menu first.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <button onClick={() => navigate('/customer')}> Back to Menu </button>
                </div>
            </div>
        )
    }

    const handleDishSelect = (dish: Dish) => {
        console.log("Selected Dish:", dish.name);
    };

    let title = '';
    let dishBoxes: React.ReactNode[] = [];

    if (type === 'entree') {
        title = 'Build Your Meal';
        const entreeBoxes = Array.from({ length: entreeCount }, (_, i) => (
            <DishBox
                key={`entree-${i}`}
                title={`Entree ${i + 1}`}
                dishes={allEntrees}
                onSelect={handleDishSelect}
            />
        ));

        dishBoxes = [
            ...entreeBoxes,
            <DishBox
                key="side"
                title="Choose Your Side"
                dishes={allSides}
                onSelect={handleDishSelect}
            />
        ];
    } else if (type === 'appetizer') {
        title = 'Choose Your Appetizer';
        dishBoxes = [
            <DishBox
                key="appetizers"
                title="Appetizers & Sides"
                dishes={allApps}
                onSelect={handleDishSelect}
            />
        ];
    } else if (type === 'drink') {
        title = 'Choose Your Drink';
        dishBoxes = [
            <DishBox
                key="drinks"
                title="Drinks"
                dishes={allDrinks}
                onSelect={handleDishSelect}
            />
        ];
    } else {
        title = 'Menu';
    }

    return (
        <div>
            <GuestHeader name={title} />
            <div className="meal-builder-wrapper">
                {dishBoxes}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                <button onClick={() => navigate('/customer')} style={{ padding: '1rem 2rem' }}>
                    Back to Menu
                </button>
            </div>
        </div>
    );
}

export default CustomerDish;

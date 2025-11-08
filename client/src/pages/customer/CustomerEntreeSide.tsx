import React, { useState } from 'react';
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import './CustomerEntreeSide.css'

const page = {
    name: 'Entree-Side',
    user: 'Customer',
};


/* this is just brute force added things to avoid database nonsense rn */
const allEntrees: { name: string; price: number; imageUrl?: string }[] = [
  { name: "Orange Chicken", price: 7, imageUrl: "../../../assets/orangechick.PNG" },
  { name: "Beijing Beef", price: 7, imageUrl: "../../../assets/beijing.PNG" },
  { name: "Honey Walnut Shrimp", price: 8, imageUrl: "../../../assets/shrimp.PNG" },
  { name: "Broccoli Beef", price: 6, imageUrl: "../../../assets/brocbeef.PNG" },
  { name: "Kung Pao Chicken", price: 7, imageUrl: "../../../assets/kungpao.PNG" }
];

const allSides: { name: string; price: number; imageUrl?: string }[] = [
    { name: "Fried Rice", price: 4, imageUrl: "../../../assets/ricefried.PNG" },
    { name: "Chow Mein", price: 3000, imageUrl: "../../../assets/chowmein.PNG" },
];

const allDrinks: { name: string; price: number; imageUrl?: string }[] = [
    { name: "Coke", price: 4, imageUrl: "../../../assets/coke.PNG" },
    { name: "Dr. Pepper", price: 3, imageUrl: "../../../assets/drp.PNG" },
];

const allApps: { name: string; price: number; imageUrl?: string }[] = [
    { name: "Cream Cheese Rangoon", price: 3, imageUrl: "../../../assets/rangoon.PNG" },
    { name: "Veggie Spring Roll", price: 3, imageUrl: "../../../assets/veggieroll.PNG" },
];





interface Dish { name: string; price: number; imageUrl?: string }

/* This is to get a visual on how the bowl/plate/big plate will look */

function CustomerEntreeSide() {
    const [entreeCount, setEntreeCount] = useState(1);
    const setMealType = (type: 'bowl' | 'plate' | 'bigplate') => {
        if (type === 'bowl') setEntreeCount(1);
        else if (type === 'plate') setEntreeCount(2);
        else if (type === 'bigplate') setEntreeCount(3);
    };

    const handleDishSelect = (dish: Dish) => {
        console.log("Selected Dish:", dish.name);
    };

    const entreeBoxes = [...Array(entreeCount)].map((_, index) => (
        <DishBox
            key={`entree-${index}`}
            title={`Entree ${index + 1}`}
            dishes={allEntrees}
            onSelect={handleDishSelect}
        />
    ));

    return (
        /* This will be moved over to CustomerHome at some point */
        <div>
            <GuestHeader name={page.name} />
            <div style={{ padding: '10rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setMealType('bowl')}>Bowl (1 Entree)</button>
                <button onClick={() => setMealType('plate')}>Plate (2 Entrees)</button>
                <button onClick={() => setMealType('bigplate')}>Big Plate (3 Entrees)</button>
            </div>
            <div className="meal-builder-wrapper"> 
                {entreeBoxes} 
                <DishBox
                    title="Choose Your Side"
                    dishes={allSides}
                    onSelect={handleDishSelect}
                />
                </div>
        </div>
    );
}

export default CustomerEntreeSide;

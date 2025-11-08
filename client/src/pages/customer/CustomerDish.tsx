import React from 'react';
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import './CustomerDish.css';

export type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

export interface Dish{
    name: string;
    price: number;
    imageUrl?: string;
}

interface CustomerDishProps{
    type: DishType;
    entreeCount?: number;
    onBack: () => void;
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

function CustomerDish({ type, entreeCount = 1, onBack }: CustomerDishProps){
    const handleSelect = (dish: Dish) => {
        console.log("Selected Dish:", dish.name);
    };

    let title = '';
    let boxes: React.ReactNode[] = [];

    if(type == 'entree'){
        title = 'Build your Meal';
        const entreeBoxes = Array.from({ length: entreeCount }).map((_, i) => (
            <DishBox
            key={`entree-${i}`}
            title={`Entree ${i + 1}`}
            dishes={allEntrees}
            onSelect={handleSelect}
            />
        ));

        boxes = [
            ...entreeBoxes,
            <DishBox key="side" title="Choose your Side" dishes={allSides} onSelect={handleSelect} />
        ];
    } else if (type == 'appetizer'){
        title = 'Choose Appeitizer';
        boxes = [<DishBox key="apps" title="Appetizers" dishes={allApps} onSelect={handleSelect} />];
    } else if (type == 'side'){
        title = 'Choose Side';
        boxes = [<DishBox key="sides" title="Sides" dishes={allSides} onSelect={handleSelect} />];
    } else if (type === 'drink') {
        title = 'Choose Drink';
        boxes = [<DishBox key="drinks" title="Drinks" dishes={allDrinks} onSelect={handleSelect} />];
    }

    return(
        <div className="meal-builder-wrapper">
            <GuestHeader name={title}/>
            {boxes}
            <button onClick={onBack} style = {{ marginTop: '2rem', padding: '1rem 2rem'}}>
                Back to Menu
            </button>
        </div>
    );
}

export default CustomerDish;

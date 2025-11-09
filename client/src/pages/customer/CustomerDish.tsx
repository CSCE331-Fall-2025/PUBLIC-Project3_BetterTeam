import React, { useState } from 'react';
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import Button from "../../components/ButtonComponents/Button.tsx";
import './CustomerDish.css';

export type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

export interface Dish{
    name: string;
    price: number;
    imageUrl?: string;
}

type SelectedDish = Dish & { _slot?: string };

interface CustomerDishProps{
    type: DishType;
    entreeCount?: number;
    onBack: () => void;
    onAddToCart: (dishes: Dish[]) => void;
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

function CustomerDish({ type, entreeCount = 1, onBack, onAddToCart }: CustomerDishProps){
    const [selected, setSelected] = useState<SelectedDish[]>([]);

    const handleSelect = (dish: Dish, slot?: string) => {
        setSelected(prev => {
            const isSelected = prev.find(d => d.name === dish.name && d._slot === slot);
            if(isSelected){
                return prev.filter(d => !(d.name === dish.name && d._slot === slot));
            }
            if(slot){
                const filtered = prev.filter(d => d._slot !== slot);
                return [...filtered, {...dish, _slot: slot}];
            }

            const alreadySelected = prev.find(d => d.name === dish.name);
            return alreadySelected ? prev.filter(d => d.name !== dish.name): [...prev, {...dish}];
        });
    };

    let title = '';
    let boxes: React.ReactNode[] = [];

    if(type === 'entree'){
        title = 'Build your Meal';
        const entreeBoxes = Array.from({ length: entreeCount }).map((_, i) => (
        
            <DishBox
                key={`entree-${i}`}
                title={`Entree ${i + 1}`}
                dishes={allEntrees}
                onSelect={(dish) => handleSelect(dish, `Entree ${i + 1}`)}
                selectedDishes = {selected.filter(d => d._slot === `Entree ${i + 1}`)}
            />
        ));
            const sideBox = (
                <DishBox
                    key="side"
                    title="Choose your Side"
                    dishes={allSides}
                    onSelect={(dish) => handleSelect(dish, 'Side')}
                    selectedDishes={selected.filter(d => d._slot === 'Side')}
                />
            );

        boxes = [...entreeBoxes, sideBox];

    } else if (type == 'appetizer'){
        title = 'Choose Appeitizer';
        boxes = [<DishBox key="apps" title="Appetizers" dishes={allApps} onSelect={(dish) => handleSelect(dish, 'App')} selectedDishes={selected.filter(d => d._slot === 'App')} />];
    } else if (type == 'side'){
        title = 'Choose Side';
        boxes = [<DishBox key="sides" title="Sides" dishes={allSides} onSelect={(dish) => handleSelect(dish, 'Side')} selectedDishes={selected.filter(d => d._slot === 'Side')} />];
    } else if (type === 'drink') {
        title = 'Choose Drink';
        boxes = [<DishBox key="drinks" title="Drinks" dishes={allDrinks} onSelect={(dish) => handleSelect(dish, 'Drink')} selectedDishes={selected.filter(d => d._slot === 'Drink')} />];
    }

    return(
        <div className="meal-builder-wrapper">
            <GuestHeader name={title}/>
            <div className="dish-box-row">
                {boxes}
            </div>
            <div className="button-row">
                <Button name="Cancel" onClick={(e) => onBack()}/>
                <Button name="Add to Cart" onClick={(e) => onAddToCart(selected)}/>
            </div>
        </div>
    );
}

export default CustomerDish;

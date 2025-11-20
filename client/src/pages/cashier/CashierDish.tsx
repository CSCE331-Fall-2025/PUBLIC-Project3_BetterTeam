import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import Button from "../../components/ButtonComponents/Button.tsx";

export type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

export interface Dish {
    name: string;
    price: number;
    imageUrl?: string;
}

type SelectedDish = Dish & { _slot?: string };

interface LocationState {
    type: DishType;
    entreeCount?: number;
    cart: Dish[];
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

function CashierDish() {
    const navigate = useNavigate();
    const location = useLocation();
    const { type, entreeCount = 1, cart } = (location.state as LocationState) || {};

    const [selected, setSelected] = useState<SelectedDish[]>([]);

    const handleSelect = (dish: Dish, slot?: string) => {
        setSelected(prev => {
            const isSelected = prev.find(d => d.name === dish.name && d._slot === slot);
            if (isSelected) return prev.filter(d => !(d.name === dish.name && d._slot === slot));
            
            if (slot) {
                const filtered = prev.filter(d => d._slot !== slot);
                return [...filtered, { ...dish, _slot: slot }];
            }

            const alreadySelected = prev.find(d => d.name === dish.name);
            return alreadySelected ? prev.filter(d => d.name !== dish.name) : [...prev, { ...dish }];
        });
    };

    const handleAddToCart = () => {
        const newCart = [...cart, ...selected];
        navigate('/Cashier/CashierHome', { state: { cart: newCart } });
    };

    const handleBack = () => {
        navigate('/Cashier/CashierHome', { state: { cart } });
    };

    let boxes: React.ReactNode[] = [];

    if (type === 'entree') {
        const entreeBoxes = Array.from({ length: entreeCount }).map((_, i) => (
            <DishBox
                key={`entree-${i}`}
                title={`Entree ${i + 1}`}
                dishes={allEntrees}
                onSelect={(dish) => handleSelect(dish, `Entree ${i + 1}`)}
                selectedDishes={selected.filter(d => d._slot === `Entree ${i + 1}`)}
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
    } else if (type === 'appetizer') {
        boxes = [<DishBox key="apps" title="Appetizers" dishes={allApps} onSelect={(dish) => handleSelect(dish, 'App')} selectedDishes={selected.filter(d => d._slot === 'App')} />];
    } else if (type === 'side') {
        boxes = [<DishBox key="sides" title="Sides" dishes={allSides} onSelect={(dish) => handleSelect(dish, 'Side')} selectedDishes={selected.filter(d => d._slot === 'Side')} />];
    } else if (type === 'drink') {
        boxes = [<DishBox key="drinks" title="Drinks" dishes={allDrinks} onSelect={(dish) => handleSelect(dish, 'Drink')} selectedDishes={selected.filter(d => d._slot === 'Drink')} />];
    }

    return (
        <div className="meal-builder-wrapper">
            <div className="dish-box-row">{boxes}</div>
            <div className="button-row">
                <Button name="Cancel" onClick={handleBack} />
                <Button name="Add to Cart" onClick={handleAddToCart} />
            </div>
        </div>
    );
}

export default CashierDish;

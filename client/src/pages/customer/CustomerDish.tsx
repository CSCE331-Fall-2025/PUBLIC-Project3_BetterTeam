import React, { useState, useEffect } from 'react';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import Button from "../../components/ButtonComponents/Button.tsx";
import './CustomerDish.css';

export type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

export interface Dish {
    name: string;
    price: number;
    type?: string;
}

type SelectedDish = Dish & { _slot?: string };

interface CustomerDishProps {
    type: DishType;
    entreeCount?: number;
    onBack: () => void;
    onAddToCart: (dishes: Dish[]) => void;
}

function CustomerDish({ type, entreeCount = 1, onBack, onAddToCart }: CustomerDishProps) {
    const [selected, setSelected] = useState<SelectedDish[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);

    useEffect(() => {
        async function loadDishes() {
            try {
                if (type === "entree") {
                    const entreeRes = await fetch(`http://localhost:4000/api/dishes/entree`);
                    const entreeData = await entreeRes.json();
                    const sideRes = await fetch(`http://localhost:4000/api/dishes/side`);
                    const sideData = await sideRes.json();
                    setDishes([...entreeData, ...sideData]);
                } else {
                    const res = await fetch(`http://localhost:4000/api/dishes/${type}`);
                    const data = await res.json();
                    setDishes(data);
                }
            } catch (err) {
                console.error("Failed to load dishes:", err);
            }
        }

        loadDishes();
        setSelected([]);
    }, [type]);

    const handleSelect = (dish: Dish, slot?: string) => {
        setSelected(prev => {
            const isSelected = prev.find(d => d.name === dish.name && d._slot === slot);
            if (isSelected) {
                return prev.filter(d => !(d.name === dish.name && d._slot === slot));
            }
            if (slot) {
                const filtered = prev.filter(d => d._slot !== slot);
                return [...filtered, { ...dish, _slot: slot }];
            }

            const alreadySelected = prev.find(d => d.name === dish.name);
            return alreadySelected
                ? prev.filter(d => d.name !== dish.name)
                : [...prev, { ...dish }];
        });
    };

    let boxes: React.ReactNode[] = [];

    if (type === 'entree') {
        const entreeBoxes = Array.from({ length: entreeCount }).map((_, i) => (
            <DishBox
                key={`entree-${i}`}
                title={`Entree ${i + 1}`}
                dishes={dishes.filter(d => d.type === "entree")}
                onSelect={(dish) => handleSelect(dish, `Entree ${i + 1}`)}
                selectedDishes={selected.filter(d => d._slot === `Entree ${i + 1}`)}
            />
        ));

        const sideBox = (
            <DishBox
                key="side"
                title="Choose your Side"
                dishes={dishes.filter(d => d.type === "side")}
                onSelect={(dish) => handleSelect(dish, "Side")}
                selectedDishes={selected.filter(d => d._slot === "Side")}
            />
        );

        boxes = [...entreeBoxes, sideBox];
    } else {
        boxes = [
            <DishBox
                key={type}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                dishes={dishes}
                onSelect={(dish) => handleSelect(dish, type)}
                selectedDishes={selected.filter(d => d._slot === type)}
            />
        ];
    }

    return (
        <div className="meal-builder-wrapper">
            <div className="dish-box-row">
                {boxes}
            </div>

            <div className="button-row">
                <Button name="Cancel" onClick={onBack} />
                <Button name="Add to Cart" onClick={() => onAddToCart(selected)} />
            </div>
        </div>
    );
}

export default CustomerDish;

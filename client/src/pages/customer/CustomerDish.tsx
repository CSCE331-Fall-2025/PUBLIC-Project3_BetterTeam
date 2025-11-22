import React, { useState, useEffect } from 'react';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import Button from "../../components/ButtonComponents/Button.tsx";
import { useLocation, useNavigate } from 'react-router-dom';
import './CustomerDish.css';

export type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

export interface Dish {
    name: string;
    price: number;
    type?: string;
}

type SelectedDish = Dish & { _slot?: string };

<<<<<<< HEAD
interface CustomerDishProps {
    type: DishType;
=======
interface LocationState {
    dishType: DishType;
>>>>>>> main
    entreeCount?: number;
    cart: Dish[];
}

<<<<<<< HEAD
function CustomerDish({ type, entreeCount = 1, onBack, onAddToCart }: CustomerDishProps) {
=======
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

function CustomerDish(){
    const location = useLocation();
    const navigate = useNavigate();
    const { dishType, entreeCount = 1, cart } = location.state as LocationState;

>>>>>>> main
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
<<<<<<< HEAD
            return alreadySelected
                ? prev.filter(d => d.name !== dish.name)
                : [...prev, { ...dish }];
=======
            return alreadySelected ? prev.filter(d => d.name !== dish.name) : [...prev, { ...dish }];
>>>>>>> main
        });
    };

    const handleAddToCart = () => {
        navigate('/Customer/CustomerHome', { state: { cart: [...cart, ...selected] }});
    };

    const handleCancel = () => {
        navigate('/Customer/CustomerHome', { state: { cart } });
    };

    let boxes: React.ReactNode[] = [];

<<<<<<< HEAD
    if (type === 'entree') {
=======
    if(dishType === 'entree'){
>>>>>>> main
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
<<<<<<< HEAD
                dishes={dishes.filter(d => d.type === "side")}
                onSelect={(dish) => handleSelect(dish, "Side")}
                selectedDishes={selected.filter(d => d._slot === "Side")}
=======
                dishes={allSides}
                onSelect={(dish) => handleSelect(dish, 'Side')}
                selectedDishes={selected.filter(d => d._slot === 'Side')}
>>>>>>> main
            />
        );

        boxes = [...entreeBoxes, sideBox];
<<<<<<< HEAD
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
=======
    } else if (dishType === 'appetizer'){
        boxes = [
            <DishBox
                key="apps"
                title="Appetizers"
                dishes={allApps}
                onSelect={(dish) => handleSelect(dish, 'App')}
                selectedDishes={selected.filter(d => d._slot === 'App')}
            />
        ];
    } else if (dishType === 'side'){
        boxes = [
            <DishBox
                key="sides"
                title="Sides"
                dishes={allSides}
                onSelect={(dish) => handleSelect(dish, 'Side')}
                selectedDishes={selected.filter(d => d._slot === 'Side')}
            />
        ];
    } else if (dishType === 'drink'){
        boxes = [
            <DishBox
                key="drinks"
                title="Drinks"
                dishes={allDrinks}
                onSelect={(dish) => handleSelect(dish, 'Drink')}
                selectedDishes={selected.filter(d => d._slot === 'Drink')}
            />
        ];
    }
    return(
>>>>>>> main
        <div className="meal-builder-wrapper">
            <div className="dish-box-row">
                {boxes}
            </div>

            <div className="button-row">
<<<<<<< HEAD
                <Button name="Cancel" onClick={onBack} />
                <Button name="Add to Cart" onClick={() => onAddToCart(selected)} />
=======
                <Button name="Cancel" onClick={handleCancel}/>
                <Button name="Add to Cart" onClick={handleAddToCart}/>
>>>>>>> main
            </div>
        </div>
    );
}

export default CustomerDish;

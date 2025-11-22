import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import Button from "../../components/ButtonComponents/Button.tsx";

export type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

export interface Dish {
    dish_id: number;
    name: string;
    price: number;
    type?: string;
}

type SelectedDish = Dish & { _slot?: string };

interface LocationState {
    type: DishType;
    entreeCount?: number;
    cart: Dish[];
}

function CashierDish(){
    const navigate = useNavigate();
    const location = useLocation();
    const { type, entreeCount = 1, cart } = (location.state as LocationState) || {};
    const [selected, setSelected] = useState<SelectedDish[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);

    useEffect(() => {
        async function loadDishes(){
            try{
                if(type === "entree"){
                    const entreeRes = await fetch("http://localhost:4000/api/dishes/entree");
                    const entreeData = await entreeRes.json();
                    const sideRes = await fetch("http://localhost:4000/api/dishes/side");
                    const sideData = await sideRes.json();

                    setDishes([...entreeData, ...sideData]);
                } else {
                    const res = await fetch(`http://localhost:4000/api/dishes/${type}`);
                    const data = await res.json();
                    setDishes(data);
                }
            } catch(err){
                console.error("Failed to load dishes:", err);
            }
        }
        loadDishes();
        setSelected([]);
    }, [type]);

    const handleSelect = (dish: Dish, slot?: string) => {
        setSelected(prev => {
            const isSelected = prev.find(d => d.dish_id === dish.dish_id && d._slot === slot);

            if(isSelected){
                return prev.filter(d => !(d.dish_id === dish.dish_id && d._slot === slot));
            }
            if(slot){
                const filtered = prev.filter(d => d._slot !== slot);
                return [...filtered, { ...dish, _slot: slot }];
            }

            const already = prev.find(d => d.dish_id === dish.dish_id);
            return already ? prev.filter(d => d.dish_id !== dish.dish_id) : [...prev, { ...dish }];
        });
    };

    const handleAddToCart = () => {
        const newCart = [...cart, ...selected];
        navigate('/Cashier/CashierHome', { state: { cart: newCart } });
    };

    const handleBack = () => navigate('/Cashier/CashierHome', { state: { cart } });

    let boxes: React.ReactNode[] = [];

    if(type === 'entree'){
        const entreeBoxes = Array.from({ length: entreeCount }).map((_, i) => (
            <DishBox
                key={`entree-${i}`}
                title={`Entree ${i+1}`}
                dishes={dishes.filter(d => d.type === "entree")}
                onSelect={(dish) => handleSelect(dish, `Entree ${i + 1}`)}
                selectedDishes={selected.filter(d => d._slot === `Entree ${i + 1}`)}
            />
        ));

        const sideBox = (
            <DishBox
                key="side"
                title="Choose Your Side"
                dishes={dishes.filter(d => d.type === "side")}
                onSelect={(dish) => handleSelect(dish, 'Side')}
                selectedDishes={selected.filter(d => d._slot === 'Side')}
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

    return(
        <div className="meal-builder-wrapper">
            <div className="dish-box-row">{boxes}</div>
            <div className="button-row">
                <Button name="Cancel" onClick={handleBack}/>
                <Button name="Add to Cart" onClick={handleAddToCart}/>
            </div>
        </div>
    );
}

export default CashierDish;

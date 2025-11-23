import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import Button from "../../components/ButtonComponents/Button.tsx";
import type { IngredientOption, CustomLevel, CustomizationChoice } from '../../components/DishComponents/DishCard.tsx';

export type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

export interface Dish {
    dish_id: number;
    name: string;
    price: number;
    type?: string;
    customization?: Record<number, CustomLevel>;
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
    const [ingredientsByDish, setIngredientsByDish] = useState<Record<number, IngredientOption[]>>({});
    const [customization, setCustomization] = useState<Record<number, Record<number, CustomLevel>>>({});

    useEffect(() => {
        async function loadDishesAndIngredients(){
            try{
                let loadedDishes: Dish[] = [];

                if(type === "entree"){
                    const entreeRes = await fetch("http://localhost:4000/api/dishes/entree");
                    const entreeData = await entreeRes.json();
                    const sideRes = await fetch("http://localhost:4000/api/dishes/side");
                    const sideData = await sideRes.json();

                    loadedDishes = [...entreeData, ...sideData];
                } else {
                    const res = await fetch(`http://localhost:4000/api/dishes/${type}`);
                    const data = await res.json();
                    loadedDishes = data;
                }

                setDishes(loadedDishes);
                setSelected([]);

                const ingredientMap: Record<number, IngredientOption[]> = {};
                await Promise.all(
                    loadedDishes.map(async (dish) => {
                        try {
                            const res = await fetch(
                                `http://localhost:4000/api/dishes/${dish.dish_id}/ingredients`
                            );
                            if(!res.ok) return;
                            const ingData: IngredientOption[] = await res.json();
                            ingredientMap[dish.dish_id] = ingData;
                        } catch (err) {
                            console.error(
                                `Failed to load ingredients for dish ${dish.dish_id}:`,
                                err
                            );
                        }
                    })
                );
                setIngredientsByDish(ingredientMap);
                setCustomization({});
            } catch(err){
                console.error("Failed to load dishes:", err);
            }
        }
        loadDishesAndIngredients();
    }, [type]);

    const handleSelect = (dish: Dish, slot?: string) => {
        setSelected(prev => {
            const isSelected = prev.find((d) => d.dish_id === dish.dish_id && d._slot === slot);

            if(isSelected){
                return prev.filter((d)=> !(d.dish_id === dish.dish_id && d._slot === slot));
            }
            if(slot){
                const filtered = prev.filter((d) => d._slot !== slot);
                return [...filtered, { ...dish, _slot: slot }];
            }

            const already = prev.find((d) => d.dish_id === dish.dish_id);
            return already ? prev.filter((d) => d.dish_id !== dish.dish_id) : [...prev, { ...dish }];
        });
    };


    const handleCustomizeChange = (
        dish_id: number,
        choice: CustomizationChoice
    ) => {
        setCustomization((prev) => {
            const prevDish = prev[dish_id] || {};
            return {
                ...prev,
                [dish_id]: {
                    ...prevDish,
                    [choice.inventory_id]: choice.level,
                },
            };
        });
    };

    const handleAddToCart = () => {
        const selectedWithCustomization: Dish[] = selected.map((d) => ({
            ...d,
            customization: customization[d.dish_id] || {},
        }));
        const newCart = [...cart, ...selectedWithCustomization];
        navigate('/Cashier/CashierHome', { state: { cart: newCart } });
    };

    const handleBack = () => navigate('/Cashier/CashierHome', { state: { cart } });

    let boxes: React.ReactNode[] = [];

    if(type === 'entree'){
        const entreeBoxes = Array.from({ length: entreeCount }).map((_, i) => (
            <DishBox
                key={`entree-${i}`}
                title={`Entree ${i+1}`}
                dishes={dishes.filter((d) => d.type === "entree")}
                onSelect={(dish) => handleSelect(dish, `Entree ${i + 1}`)}
                selectedDishes={selected.filter((d) => d._slot === `Entree ${i + 1}`)}
                ingredientsByDish={ingredientsByDish}
                customization={customization}
                onCustomizeChange={handleCustomizeChange}
            />
        ));

        const sideBox = (
            <DishBox
                key="side"
                title="Choose Your Side"
                dishes={dishes.filter((d) => d.type === "side")}
                onSelect={(dish) => handleSelect(dish, 'Side')}
                selectedDishes={selected.filter((d) => d._slot === 'Side')}
                ingredientsByDish={ingredientsByDish}
                customization={customization}
                onCustomizeChange={handleCustomizeChange}
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
                selectedDishes={selected.filter((d) => d._slot === type)}
                ingredientsByDish={ingredientsByDish}
                customization={customization}
                onCustomizeChange={handleCustomizeChange}
            />,
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

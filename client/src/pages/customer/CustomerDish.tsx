import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import Button from "../../components/ButtonComponents/Button.tsx";
import type { IngredientOption, CustomLevel, CustomizationChoice } from "../../components/DishComponents/DishCard.tsx";
import { useCart } from '../../context/CartContext.tsx';

import './CustomerDish.css';

const API_BASE = import.meta.env.VITE_API_BASE;
const ICE_ID = 58;

export type DishType = 'entree' | 'appetizer' | 'drink' | 'side' | 'season';

export interface Dish {
    dish_id: number;
    name: string;
    price: number;
    type?: string;
    image_url?: string;
    customization?: Record<number, CustomLevel>;
}

type SelectedDish = Dish & { _slot?: string };

function CustomerDish() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addMeal } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const state = location.state as {
        dishType: DishType;
        entreeCount?: number;
    };
    

    const type = state?.dishType;
    const entreeCount = state?.entreeCount ?? 1;

    const [selected, setSelected] = useState<SelectedDish[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [ingredientsByDish, setIngredientsByDish] = useState<Record<number, IngredientOption[]>>({});
    const [customization, setCustomization] = useState<Record<number, Record<number, CustomLevel>>>({});
    const [mealQty, setMealQty] = useState(1);
    
    if (!type) {
        return <div>Error: No dish type provided.</div>;
    }

    useEffect(() => {
        async function loadDishesAndIngredients() {
            try {
                let loaded: Dish[] = [];

                if (type === "entree") {
                    const entreeRes = await fetch(`${API_BASE}/api/dishes/entree`);
                    const entreeData = await entreeRes.json();

                    const sideRes = await fetch(`${API_BASE}/api/dishes/side`);
                    const sideData = await sideRes.json();

                    loaded = [...entreeData, ...sideData];
                } else {
                    const res = await fetch(`${API_BASE}/api/dishes/${type}`);
                    loaded = await res.json();
                }
                

                setDishes(loaded);

                const ingredientMap: Record<number, IngredientOption[]> = {};

                await Promise.all(
                    loaded.map(async (dish) => {
                        const res = await fetch(
                            `${API_BASE}/api/dishes/${dish.dish_id}/ingredients`
                        );
                        if(!res.ok) return;
                        ingredientMap[dish.dish_id] = await res.json();
                    })
                );

                const iceRes = await fetch(`${API_BASE}/api/inventory/${ICE_ID}`);
                const iceData = iceRes.ok? await iceRes.json() : { current_inventory : 0 };

                loaded.forEach((dish) => {
                    if(dish.type === "drink"){
                        ingredientMap[dish.dish_id] = [
                            {
                                inventory_id: ICE_ID,
                                name: "Ice",
                                current_inventory: iceData.current_inventory
                            }
                        ];
                    }
                });

                setIngredientsByDish(ingredientMap);
                setCustomization({});
                setSelected([]);
            } catch (err) {
                console.error("Failed to load dishes:", err);
            }
        }
        loadDishesAndIngredients();
    }, [type]);

    const handleSelect = (dish: Dish, slot?: string) => {
        setSelected(prev => {
            const isSelected = prev.find(d => d.dish_id === dish.dish_id && d._slot === slot);

            if (isSelected) {
                return prev.filter(d => !(d.dish_id === dish.dish_id && d._slot === slot));
            }

            if (slot) {
                const filtered = prev.filter(d => d._slot !== slot);
                return [...filtered, { ...dish, _slot: slot }];
            }

            const alreadySelected = prev.find(d => d.dish_id === dish.dish_id);
            return alreadySelected
                ? prev.filter(d => d.dish_id !== dish.dish_id)
                : [...prev, { ...dish }];
        });
    };

    const handleCustomizeChange = (
        dish_id: number,
        choice: CustomizationChoice
    ) => {
        setCustomization(prev => ({
            ...prev,
            [dish_id]: {
                ...(prev[dish_id] || {}),
                [choice.inventory_id]: choice.level
            }
        }));
    };

    let boxes: React.ReactNode[] = [];

    if (type === 'entree') {
        const entreeBoxes = Array.from({ length: entreeCount }).map((_, i) => (
            <DishBox
                key={`entree-${i}`}
                title={`Objective ${i + 1}`}
                dishes={dishes.filter(d => d.type === "entree")}
                onSelect={(dish) => handleSelect(dish, `Entree ${i + 1}`)}
                selectedDishes={selected.filter(d => d._slot === `Entree ${i + 1}`)}
                ingredientsByDish={ingredientsByDish}
                customization={customization}
                onCustomizeChange={handleCustomizeChange}
            />
        ));

        const sideBox = (
            <DishBox
                key="side"
                title="Side Mission"
                dishes={dishes.filter(d => d.type === "side")}
                onSelect={(dish) => handleSelect(dish, "Side")}
                selectedDishes={selected.filter(d => d._slot === "Side")}
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
                selectedDishes={selected.filter(d => d._slot === type)}
                ingredientsByDish={ingredientsByDish}
                customization={customization}
                onCustomizeChange={handleCustomizeChange}
            />
        ];
    }

    const handleBack = () => navigate("/Customer/CustomerHome");
    const handleAddToCart = () => {
        if (isAdding) return;
        setIsAdding(true);

        try {
            if (type === "entree") {
                const requiredCount = entreeCount + 1;
                if (selected.length !== requiredCount) {
                    alert("Please select all entrees and a side before adding to cart.");
                    return;
                }
            } else {
                if (selected.length !== 1) {
                    alert("Please select an item before adding to cart.");
                    return;
                }
            }

            for (const dish of selected) {
                if (dish.type !== "drink") {
                    const ing = customization[dish.dish_id];
                    const ingList = ingredientsByDish[dish.dish_id] || [];

                    if (ingList.length > 0) {
                        const allNone = ingList.every((ingObj) => {
                            const level = ing?.[ingObj.inventory_id] || "normal";
                            return level === "none";
                        });

                        if (allNone) {
                            alert(`You cannot set all ingredients of ${dish.name} to None.`);
                            return;
                        }
                    }
                }
            }

            const baseMealItems: Dish[] = selected.map(dish => ({
                ...dish,
                customization: customization[dish.dish_id] || {}
            }));

            for (let i = 0; i < mealQty; i++) {
                addMeal(baseMealItems);
            }

            navigate("/Customer/CustomerHome");

        } finally {
            setIsAdding(false);
        }
    };


    return (
        <div className="meal-builder-wrapper">
            <div className="dish-box-row">
                {boxes}
            </div>
            
            <div className="qty-row">
                <button className="qty-btn" onClick={() => setMealQty(q => Math.max(1, q - 1))}>-</button>
                <span className="qty-num">{mealQty}</span>
                <button className="qty-btn" onClick={() => setMealQty(q => q + 1)}>+</button>
            </div>

            <div className="button-row">
                <Button name="Cancel" onClick={handleBack} disabled={isAdding}/>
                <Button name="Add Mission" onClick={handleAddToCart} disabled={isAdding}/>
            </div>
        </div>
    );
}

export default CustomerDish;

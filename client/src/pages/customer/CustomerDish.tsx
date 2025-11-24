import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DishBox } from "../../components/DishComponents/DishBox.tsx";
import Button from "../../components/ButtonComponents/Button.tsx";
import type { IngredientOption, CustomLevel, CustomizationChoice } from "../../components/DishComponents/DishCard.tsx";
import './CustomerDish.css';

export type DishType = 'entree' | 'appetizer' | 'drink' | 'side';

export interface Dish {
    dish_id: number;
    name: string;
    price: number;
    type?: string;
    customization?: Record<number, CustomLevel>;
}

type SelectedDish = Dish & { _slot?: string };

function CustomerDish() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as {
        dishType: DishType;
        entreeCount?: number;
        cart?: Dish[];
    };

    const type = state?.dishType;
    const entreeCount = state?.entreeCount ?? 1;
    const cart = state?.cart ?? [];
    const [selected, setSelected] = useState<SelectedDish[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [ingredientsByDish, setIngredientsByDish] = useState<Record<number, IngredientOption[]>>({});
    const [customization, setCustomization] = useState<Record<number, Record<number, CustomLevel>>>({});

    
    if (!type) {
        return <div>Error: No dish type provided.</div>;
    }

    useEffect(() => {
        async function loadDishesAndIngredients() {
            try {
                
                let loaded: Dish[] = [];

                if (type === "entree") {
                    const entreeRes = await fetch(`http://localhost:4000/api/dishes/entree`);
                    const entreeData = await entreeRes.json();

                    const sideRes = await fetch(`http://localhost:4000/api/dishes/side`);
                    const sideData = await sideRes.json();

                    loaded = [...entreeData, ...sideData];
                } else {
                    const res = await fetch(`http://localhost:4000/api/dishes/${type}`);
                    loaded = await res.json();
                }

                setDishes(loaded);

                const ingredientMap: Record<number, IngredientOption[]> = {};

                await Promise.all(
                    loaded.map(async (dish) => {
                        const res = await fetch(
                            `http://localhost:4000/api/dishes/${dish.dish_id}/ingredients`
                        );
                        if(!res.ok) return;
                        ingredientMap[dish.dish_id] = await res.json();
                    })
                );
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
                title={`Entree ${i + 1}`}
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
                title="Choose your Side"
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

    const handleBack = () => navigate("/Customer/CustomerHome", { state: { cart } });
    const handleAddToCart = () => {
        const selectedWithCustomization: Dish[] = selected.map(d => ({
            ...d,
            customization: customization[d.dish_id] || {}
        }));
        navigate("/Customer/CustomerHome", {
            state: {
                cart: [...cart, ...selectedWithCustomization]
            }
        });
    };

    return (
        <div className="meal-builder-wrapper">
            <div className="dish-box-row">
                {boxes}
            </div>

            <div className="button-row">
                <Button name="Cancel" onClick={handleBack} />
                <Button name="Add to Cart" onClick={handleAddToCart} />
            </div>
        </div>
    );
}

export default CustomerDish;

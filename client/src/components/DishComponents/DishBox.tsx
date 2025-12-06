import React from "react";
import { DishCard } from "./DishCard";
import type { IngredientOption, CustomLevel, CustomizationChoice  } from "./DishCard";
import type { Dish } from "../../pages/customer/CustomerDish.tsx";
import type { SelectedDish } from "../../pages/cashier/CashierDish.tsx";
import './DishBox.css';

interface DishBoxProps {
    title?: string;
    dishes: Dish[];
    onSelect?: (dish: Dish) => void;
    selectedDishes?: SelectedDish[];
    ingredientsByDish?: Record<number, IngredientOption[]>;
    customization?: Record<number, Record<number, CustomLevel>>;
    onCustomizeChange?: (dish_id: number, choice: CustomizationChoice) => void;
}

export const DishBox: React.FC<DishBoxProps> = ({ title, dishes, onSelect, selectedDishes = [], ingredientsByDish = {}, customization = {}, onCustomizeChange }) => {
    return (
        <div className="dish-box">
            {title && <h2 className="dish-box-title">{title}</h2>}
            <div className="dish-box-grid">
                {dishes.map((dish) => {
                    const ingList = ingredientsByDish[dish.dish_id] ?? [];
                    const disabled = ingList.some(
                        (ing) => ing.current_inventory === 0
                    );

                    return(
                        <DishCard
                            key={dish.dish_id}
                            dish_id={dish.dish_id}
                            name={dish.name}
                            price={dish.price}
                            image_url={dish.image_url}
                            onSelect={() => {
                                if(!disabled) onSelect?.(dish);
                            }}
                            isSelected={selectedDishes?.some(d => d.name === dish.name)}
                            ingredients={ingList}
                            customization={customization[dish.dish_id] ?? {}}
                            onCustomizeChange={onCustomizeChange}
                            disabled={disabled}
                        />
                    );
                })}
            </div>
        </div>
    );
};
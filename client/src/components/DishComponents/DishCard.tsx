import React from "react";
import './DishCard.css';

export interface IngredientOption {
    inventory_id: number;
    name: string;
}

export type CustomLevel = "none" | "normal" | "extra";

export interface CustomizationChoice {
    inventory_id: number;
    level: CustomLevel;
}

interface DishCardProps {
    dish_id: number;
    name: string;
    price: number;
    onSelect?: () => void;
    isSelected?: boolean;

    ingredients?: IngredientOption[];
    customization?: Record<number, CustomLevel>;
    onCustomizeChange?: (dish_id: number, choice: CustomizationChoice) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
    dish_id,
    name,
    price,
    onSelect,
    isSelected,
    ingredients = [],
    customization = {},
    onCustomizeChange
}) => {

    const [showOptions, setShowOptions] = React.useState(false);

    const choose = (inventory_id: number, level: CustomLevel) => {
        onCustomizeChange?.(dish_id, { inventory_id, level });
    };

    return (
        <div className="dish-card-wrapper">
            <div className={`dish-card ${isSelected ? "selected" : ""}`}>
                <div onClick={onSelect}>
                    <h3 className="dish-card-title">{name}</h3>
                    <p className="dish-card-price">${price.toFixed(2)}</p>
                </div>

                <button
                    className="customize-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(!showOptions);
                    }}
                >
                    Customize
                </button>
            </div>
            {showOptions && (
                <div className="custom-panel">
                    <h4 className="custom-panel-title">Ingredients</h4>

                    {ingredients.map((ing) => {
                        const currentLevel = customization[ing.inventory_id] ?? "normal";
                        return(
                            <div
                                key={ing.inventory_id}
                                className="custom-row"
                            >
                                <span className="ing-name">{ing.name}</span>
                                <div className="level-buttons">
                                    {(["none", "normal", "extra"] as CustomLevel[]).map((level) => (
                                        <button
                                            key={level}
                                            className={`level-btn ${
                                                currentLevel === level ? "active" : ""
                                            }`}
                                            onClick={() =>
                                                choose(
                                                    ing.inventory_id,
                                                    level
                                                )
                                            }
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

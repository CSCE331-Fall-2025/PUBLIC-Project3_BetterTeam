import React from "react";
import './DishCard.css';

export interface IngredientOption {
    inventory_id: number;
    name: string;
    current_inventory: number;
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
    image_url?: string;
    onSelect?: () => void;
    isSelected?: boolean;

    ingredients?: IngredientOption[];
    customization?: Record<number, CustomLevel>;
    onCustomizeChange?: (dish_id: number, choice: CustomizationChoice) => void;

    disabled?: boolean;
}

export const DishCard: React.FC<DishCardProps> = ({
    dish_id,
    name,
    price,
    image_url,
    onSelect,
    isSelected,
    ingredients = [],
    customization = {},
    onCustomizeChange,
    disabled = false,
}) => {

    const [showOptions, setShowOptions] = React.useState(false);

    const choose = (inventory_id: number, level: CustomLevel) => {
        onCustomizeChange?.(dish_id, { inventory_id, level });
    };

    return (
        <div className={`dish-card-wrapper ${disabled ? "disabled-card" : ""}`}>
            {disabled && <div className="oos-banner">OUT OF STOCK</div>}

            <div
                className={`dish-card ${isSelected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
                onClick={() => {
                    if (!disabled) onSelect?.();
                }}
                style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            >
                {image_url && (
                    <img
                        src={image_url}
                        alt={name}
                        className="dish-card-image"
                    />
                )}

                <h3 className="dish-card-title">{name}</h3>
                <p className="dish-card-price">${price.toFixed(2)}</p>

                {isSelected && !disabled && (
                    <button
                        className="customize-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowOptions(prev => !prev);
                        }}
                    >
                        Customize
                    </button>
                )}
            </div>

            {showOptions && isSelected && !disabled && (
                <div className="custom-panel">
                    <h4 className="custom-panel-title">Ingredients</h4>

                    {ingredients.map((ing) => {
                        const currentLevel = customization[ing.inventory_id] ?? "normal";
                        return (
                            <div key={ing.inventory_id} className="custom-row">
                                <span className="ing-name">{ing.name}</span>

                                <div className="level-buttons">
                                    {(["none", "normal", "extra"] as CustomLevel[]).map((level) => (
                                        <button
                                            key={level}
                                            className={`level-btn ${currentLevel === level ? "active" : ""}`}
                                            onClick={() => choose(ing.inventory_id, level)}
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

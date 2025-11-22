import React from "react";
import './DishCard.css';

interface DishCardProps {
    dish_id: number;
    name: string;
    price: number;
    onSelect?: () => void;
    isSelected?: boolean;
}

export const DishCard: React.FC<DishCardProps> = ({ dish_id, name, price, onSelect, isSelected }) => {
    return (
        <div 
            className={`dish-card ${isSelected ? "selected" : ""}`} 
            onClick={onSelect}
        >
            <h3 className="dish-card-title">{name}</h3>
            <p className="dish-card-price">${price.toFixed(2)}</p>
        </div>
    );
};

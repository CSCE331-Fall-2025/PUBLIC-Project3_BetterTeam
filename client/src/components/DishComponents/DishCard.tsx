import React from "react";
import './DishCard.css';

interface DishCardProps {
    name: string;
    price: number;
    imageUrl?: string;
    onSelect?: () => void;
    isSelected?: boolean;
}


export const DishCard: React.FC<DishCardProps> = ({name, price, imageUrl, onSelect, isSelected}) => {
    return (
        <div className={`dish-card ${isSelected ? "selected" : ""}`} onClick={onSelect}>
            <img
                src={imageUrl}
                alt={name}
                className="dish-card-image"
            />
            <h3 className="dish-card-title">{name}</h3>
            <p className="dish-card-price">${price.toFixed(2)}</p>
        </div>
    );
};

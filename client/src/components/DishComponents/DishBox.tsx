import React from "react";
import { DishCard } from "./DishCard";
import './DishBox.css';

interface Dish {
    name: string;
    price: number;
    imageUrl?: string;
}

interface DishBoxProps {
    title?: string;
    dishes: Dish[];
    onSelect?: (dishes: Dish) => void;
    selectedDishes?: Dish[];
}

export const DishBox: React.FC<DishBoxProps> = ({title, dishes, onSelect, selectedDishes}) => {
    return (
        <div className="dish-box">
            {title && <h2 className="dish-box-title">{title}</h2>}
            <div className="dish-box-grid">
                {dishes.map((dish, index) => (
                    <DishCard
                        key={index}
                        name={dish.name}
                        price={dish.price}
                        imageUrl={dish.imageUrl}
                        onSelect={() => onSelect?.(dish)}
                        isSelected={selectedDishes?.some(d => d.name === dish.name)}
                    />
                ))}
            </div>
        </div>
    );
};

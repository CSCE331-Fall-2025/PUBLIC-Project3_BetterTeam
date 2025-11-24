import React from "react";
import { MenuCard } from "./MenuCard";
import './MenuBox.css';

interface Dish {
    name: string;
    price: number;
}

interface MenuBoxProps {
    title?: string;
    dishes: Dish[];
}

export const MenuBox: React.FC<MenuBoxProps> = ({title, dishes }) => {
    return (
        <div className="menu-box">
            {title && <h2 className="menu-box-title">{title}</h2>}
            <div className="menu-box-grid">
                {dishes.map((dish, index) => (
                    <MenuCard
                        key={index}
                        name={dish.name}
                        price={dish.price}
                    />
                ))}
            </div>
        </div>
    );
};

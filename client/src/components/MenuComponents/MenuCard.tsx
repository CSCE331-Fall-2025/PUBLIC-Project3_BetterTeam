import React from "react";
import './MenuCard.css';

interface MenuCardProps {
    name: string;
    price: number;
}


export const MenuCard: React.FC<MenuCardProps> = ({ name, price }) => {
    return (
        <div>
            <h3 className="menu-card-title">{name}</h3>
            <p className="menu-card-price">${price}</p>
        </div>
    );
};

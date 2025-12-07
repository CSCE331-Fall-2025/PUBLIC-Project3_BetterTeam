import React from "react";
import './MenuCard.css';

interface MenuCardProps {
    name: string;
    price: number;
    image_url: string;
}


export const MenuCard: React.FC<MenuCardProps> = ({ name, price, image_url }) => {
    return (
        <div className='menu-card'>
            {image_url && (
                <img
                    src={image_url}
                    alt={name}
                    className="dish-card-image"
                />
            )}
            <h3 className="menu-card-title">{name}</h3>
            <p className="menu-card-price">${price}</p>
        </div>
    );
};

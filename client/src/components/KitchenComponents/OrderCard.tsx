import React from "react";
import type { Dish } from '../../pages/customer/CustomerDish';
import './OrderCard.css';

export interface OrderCardProps {
    name: string;//mostly for testing rn
    slot?: number;//0,1,2 for columns L->R
    items: Dish[];//from alexx
}
//export function OrderCard(props: OrderCardProps) {
export const OrderCard: React.FC<OrderCardProps> = ({name, items}) => {
    return (
        <div className="order-card" >
            <h3 className="order-card-title">{name}</h3>
            <ul className="order-card-text">
                {items.map((dish, index) => (
                    <ul key = {index}>
                        {dish.name}
                    </ul>/* list of dishes in items by name */
                ))}
            </ul>
        </div>
    );
};

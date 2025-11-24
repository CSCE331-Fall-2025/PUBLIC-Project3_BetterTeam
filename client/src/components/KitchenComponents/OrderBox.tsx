import React from "react";
import { OrderCard } from "../KitchenComponents/OrderCard";
import type { OrderCardProps } from "../KitchenComponents/OrderCard";
//import type { Dish } from '../../pages/customer/CustomerDish';
import './OrderBox.css';

/*interface Order{
    name: string;//mostly for testing rn
    slot: number;//0,1,2 for columns L->R
    items: Dish[];//from alexx
}*/

interface OrderBoxProps {
    title: string;
    slot: number;
    orders: OrderCardProps[];
    /*onSlotChange: (name: string, newSlot: number) => void;*/
}

export const OrderBox: React.FC<OrderBoxProps> = ({title, orders/*, onSlotChange*/}) => {
    return (
        <div className="order-box">
            {title && <h2 className="order-box-title">{title}</h2>}
            <div className="order-box-grid">
                {orders.map((order, index) => (
                    <OrderCard
                        key={index}
                        slot={order.slot}
                        name={order.name}
                        items={order.items}
                        /*onSlotChange={onSlotChange}*/
                    />
                ))}
            </div>
        </div>
    );
};

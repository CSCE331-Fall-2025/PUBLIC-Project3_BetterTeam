import React from "react";
import { OrderCard } from "../KitchenComponents/OrderCard";
import type { OrderCardProps } from "../KitchenComponents/OrderCard";
import './OrderBox.css';

interface OrderBoxProps {
    title: string;
    slot: number;
    orders: OrderCardProps[];
}

export const OrderBox: React.FC<OrderBoxProps> = ({title, orders}) => {
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
                    />
                ))}
            </div>
        </div>
    );
};

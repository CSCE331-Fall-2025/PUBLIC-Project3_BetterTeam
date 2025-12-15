import React from "react";
import { OrderCard } from "./OrderCard";
import type { Order } from "./OrderCard";
import "./OrderBox.css";

interface OrderBoxProps {
    title: string;
    slot: number;
    orders: Order[];
    onUpdateOrders: (orders: Order[]) => void;
}

export const OrderBox: React.FC<OrderBoxProps> = ({
    title,
    orders,
    onUpdateOrders,
}) => {
    return (
        <div className="order-box">
            {title && <h2 className="order-box-title">{title}</h2>}
            <div className="order-box-grid">
                {orders.map(order => (
                    <OrderCard
                        key={order.name}
                        {...order}
                        onUpdateOrders={onUpdateOrders}
                    />
                ))}
            </div>
        </div>
    );
};


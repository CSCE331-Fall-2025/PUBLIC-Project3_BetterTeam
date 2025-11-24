import React, { useState } from "react";
import type { Dish } from '../../pages/customer/CustomerDish';
import Button from "../ButtonComponents/Button.tsx";
import './OrderCard.css';

export interface OrderCardProps {
    name: string;//mostly for testing rn
    slot: number;//0,1,2 for columns L->R
    items: Dish[];//from alexx
}

//export function OrderCard(props: OrderCardProps) {
export const OrderCard: React.FC<OrderCardProps> = ({name, slot, items}) => {
    const [currentSlot, setCurrentSlot] = useState<number>(Number(slot));
    
    const handleUpSlot = () => {
       setCurrentSlot(prev => prev + 1);
    }

    const handleDownSlot = () => {
       setCurrentSlot(prev => prev - 1);
    }
    /*
    <Button name="Down" onClick={handleDownSlot} />
    <Button name="Up" onClick={handleUpSlot} />
    */

    //const handleUpSlot = () => {slot++;}

    return (
        <div className="order-card" >
            <h3 className="order-card-title">{name}</h3>
            <h3>Slot: {currentSlot}</h3>
            <ul className="order-card-text">
                {items.map((dish, index) => (
                    <h4 key = {index}>
                        {dish.name}
                    </h4>/* list of dishes in items by name */
                ))}
            </ul>

            <Button name="Down" onClick={handleDownSlot} />
            <Button name="Up" onClick={handleUpSlot} />
        </div>
    );
};
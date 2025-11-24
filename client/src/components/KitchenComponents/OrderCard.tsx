//import React, { useState } from "react";
import type { Dish } from '../../pages/customer/CustomerDish';
import Button from "../ButtonComponents/Button.tsx";
import './OrderCard.css';

export interface OrderCardProps {
    name: string;//mostly for testing rn
    slot: number;//0,1,2 for columns L->R
    items: Dish[];//from alexx
}

//export function OrderCard(props: OrderCardProps) {
export const OrderCard: React.FC<OrderCardProps
& {onSlotChange: (name: string, newSlot:number) => void}> 
= ({name, slot, items, onSlotChange}) => {
    
    const handleUpSlot = () => {
        if(slot==2) onSlotChange(name, slot);// removes order if already rightmost
        /*honestly idk why ^ works but im not looking the gifthorse in the mouth*/
        onSlotChange(name, slot + 1);//  go right otherwise
    }

    const handleDownSlot = () => {
        if(slot>0) onSlotChange(name, slot - 1);//go left if possible
        // if someone tries to go left while at 0, we dont care
    }

    return (
        <div className="order-card" >
            <h3 className="order-card-title">{name}</h3>
            <h3>Slot: {slot}</h3>
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
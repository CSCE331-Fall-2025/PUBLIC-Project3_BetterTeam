//import React, { useState } from "react";
import type { Dish } from '../../pages/customer/CustomerDish';
import Button from "../ButtonComponents/Button.tsx";
import './OrderCard.css';

export interface OrderCardProps {
    name: string;//mostly for testing rn
    slot: number;//0,1,2 for columns L->R
    items: Dish[];//from alexx
}

type Order = OrderCardProps;

//export function OrderCard(props: OrderCardProps) {
export const OrderCard: React.FC<OrderCardProps
/*& {onSlotChange: (name: string, newSlot:number) => void}*/> 
= ({name, slot, items/*, onSlotChange*/}) => {
    
    const handleUpSlot = () => {
        //if(slot==2) onSlotChange(name, slot);// removes order if already rightmost
        /*honestly idk why ^ works but im not looking the gifthorse in the mouth*/
        //onSlotChange(name, slot + 1);//  go right otherwise

        if(slot<2){//go right if possible
            //retrieve orders
            const storedOrders = localStorage.getItem("orders");
            let parsedOrders: Order[] = [];
            if (storedOrders){ parsedOrders = JSON.parse(storedOrders);}
            //make new order with 1 higher slot
            const newOrder: Order = {name:name, slot:(slot+1), items:items};
            //make a new orders without the old one
            let newOrders = parsedOrders.filter(order => order.name !== name);
            //add the new order to the new orders
            newOrders.push(newOrder);
            localStorage.setItem("orders",JSON.stringify(newOrders));
            //log for potential debugging
            console.log(newOrders);
            window.location.reload();
        }
        if(slot==2){// removes order if already rightmost
            const storedOrders = localStorage.getItem("orders");
            let parsedOrders: Order[] = [];
            if (storedOrders){ parsedOrders = JSON.parse(storedOrders);}
            //make a new orders without the old one
            parsedOrders = parsedOrders.filter(order => order.name !== name);
            localStorage.setItem("orders",JSON.stringify(parsedOrders));
            //log for potential debugging
            console.log(parsedOrders);
            window.location.reload();
        }
    }

    const handleDownSlot = () => {//could change to be the same function later idc rn
        if(slot>0){//go left if possible
            //retrieve orders
            const storedOrders = localStorage.getItem("orders");
            let parsedOrders: Order[] = [];
            if (storedOrders){ parsedOrders = JSON.parse(storedOrders);}
            //make new order with 1 lower slot
            const newOrder: Order = {name:name, slot:(slot-1), items:items};
            //make a new orders without the old one
            let newOrders = parsedOrders.filter(order => order.name !== name);
            //add the new order to the new orders
            newOrders.push(newOrder);
            localStorage.setItem("orders",JSON.stringify(newOrders));
            //log for potential debugging
            console.log(newOrders);
            window.location.reload();
        }
        // if someone tries to go left while at 0, ignore
    }

    /*
    <h3 className="order-card-title">{name}</h3>
            <h3>Slot: {slot}</h3>
            */
    return (
        <div className="order-card" >
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
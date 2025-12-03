import '../../pages/customer/CustomerDish';
import type { Dish } from '../../pages/customer/CustomerDish';
import Button from "../ButtonComponents/Button.tsx";
import './OrderCard.css';
import { useEffect, useState } from 'react';

export interface OrderCardProps {
    name: string;//mostly for testing rn
    slot: number;//0,1,2 for columns L->R
    items: Dish[];//from alexx
}

interface IngredientOption{
    inventory_id: number;
    name: string;
}

type Order = OrderCardProps;

export const OrderCard: React.FC<OrderCardProps> 
= ({name, slot, items}) => {
    
    const handleSlotChange = (change: number) => {
        const storedOrders = localStorage.getItem("orders");
        let parsedOrders: Order[] = [];
        if (storedOrders){ parsedOrders = JSON.parse(storedOrders);}
        //make new order with 1 lower slot
        const newOrder: Order = {name:name, slot:(slot+change), items:items};
        //make a new orders without the old one
        let newOrders = parsedOrders.filter(order => order.name !== name);
        //add the new order to the new orders
        newOrders.push(newOrder);
        localStorage.setItem("orders",JSON.stringify(newOrders));
        //log for potential debugging
        console.log(newOrders);
        window.location.reload();
    }

    const handleUpSlot = () => {
        if(slot<2){//go right if possible
            handleSlotChange(1);
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

    const [ingredientNames, setIngredientNames] = useState<Record<number, Record<number, string>>>({});

    useEffect(() => {
        async function loadIngredients(){
            const ingredientMap: Record<number, Record<number, string>> = {};
            for(const dish of items){
                if(!dish.dish_id) continue;

                try{
                    const res = await fetch(
                        `http://localhost:4000/api/dishes/${dish.dish_id}/ingredients`
                    );
                    if(!res.ok) continue;

                    const ingList: IngredientOption[] = await res.json();

                    ingredientMap[dish.dish_id] = {};
                    for(const ing of ingList){
                        ingredientMap[dish.dish_id][ing.inventory_id] = ing.name;
                    }
                } catch(err){
                    console.error("Failed to load ingredients for checkout:", err);
                }
            }
            setIngredientNames(ingredientMap);
        }
        if(items.length > 0) loadIngredients();
    }, [items]);

    const grammerLevel = (level : string) => {
        if(level === "none") return "No";
        if(level === "extra") return "Extra";
        return "";
    }
    
    const handleDownSlot = () => {
        if(slot>0){//go left if possible
            handleSlotChange(-1);
        }// if someone tries to go left while at 0, ignore for time being, maybe erro handling in future?
    }

    return (
        <div className="order-card" >
            <ul className="order-card-text">
                <h3 className="order-card-number">ORDER #{name}</h3>
                {items.map((dish, index) => (
                                <li key={index}>
                                    <h3 className="ingredient-title">{dish.name}</h3>

                                    {dish.customization && (
                                        <ul className="customization-list">
                                            {Object.entries(dish.customization).map(([invIdStr, level]) => {
                                                const invId = Number(invIdStr);
                                                const ingName = ingredientNames[dish.dish_id]?.[invId];
                                                
                                                if(level === "normal") return null;
                                                return(
                                                    <li key={invId} className="custom-line">
                                                        {grammerLevel(level)} {ingName}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            ))}
            </ul>
            <div className="order-buttons" >
                <Button name="" onClick={handleDownSlot} className="down"/>
                <Button name="" onClick={handleUpSlot} className="up"/>
            </div>
        </div>
    );
};
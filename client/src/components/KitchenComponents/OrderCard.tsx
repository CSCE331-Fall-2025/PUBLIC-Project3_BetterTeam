import type { Dish } from '../../pages/customer/CustomerDish';
import Button from "../ButtonComponents/Button.tsx";
import './OrderCard.css';
import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

/** Pure order data model */
export interface Order {
    name: string;
    slot: number;
    items: Dish[];
}

/** Component props */
export interface OrderCardProps extends Order {
    onUpdateOrders: (orders: Order[]) => void;
}

interface IngredientOption {
    inventory_id: number;
    name: string;
}

export const OrderCard: React.FC<OrderCardProps> =
({ name, slot, items, onUpdateOrders }) => {

    const handleSlotChange = (change: number) => {
        const stored = localStorage.getItem("orders");
        const parsed: Order[] = stored ? JSON.parse(stored) : [];
        const updatedOrders = parsed
            .filter(order => order.name !== name)
            .concat({ name, slot: slot + change, items });

        onUpdateOrders(updatedOrders);
    };

    const handleUpSlot = () => {
        if (slot < 2) {
            handleSlotChange(1);
        } else {
            const stored = localStorage.getItem("orders");
            const parsed: Order[] = stored ? JSON.parse(stored) : [];
            const updated = parsed.filter(order => order.name !== name);
            onUpdateOrders(updated);
        }
    };

    const handleDownSlot = () => {
        if (slot > 0) {
            handleSlotChange(-1);
        }
    };

    const [ingredientNames, setIngredientNames] =
        useState<Record<number, Record<number, string>>>({});

    useEffect(() => {
        async function loadIngredients() {
        const ingredientMap: Record<number, Record<number, string>> = {};

        for (const dish of items) {
            if (!dish.dish_id) continue;

            try {
                const res = await fetch(
                    `${API_BASE}/api/dishes/${dish.dish_id}/ingredients`
                );
            if (!res.ok) continue;

            const ingList: IngredientOption[] = await res.json();

            ingredientMap[dish.dish_id] = {};
            for (const ing of ingList) {
                ingredientMap[dish.dish_id][ing.inventory_id] = ing.name;
            }
            } catch (err) {
            console.error("Failed to load ingredients:", err);
            }
        }
        setIngredientNames(ingredientMap);
    }

    if (items.length > 0) loadIngredients();
    }, [items]);

    const grammarLevel = (level: string) => {
        if (level === "none") return "No";
        if (level === "extra") return "Extra";
        return "";
    };

    return (
        <div className="order-card">
        <ul className="order-card-text">
        {items.map((dish, index) => (
            <li key={index}>
            <h3 className="ingredient-title">{dish.name}</h3>

            {dish.customization && (
                <ul className="customization-list">
                {Object.entries(dish.customization).map(([invIdStr, level]) => {
                    if (level === "normal") return null;
                    const invId = Number(invIdStr);
                    const ingName = ingredientNames[dish.dish_id]?.[invId];

                    return (
                        <li key={invId} className="custom-line">
                        {grammarLevel(level)} {ingName}
                        </li>
                    );
                })}
                </ul>
            )}
            </li>
        ))}
        </ul>

        <div className="order-buttons">
        <Button name="" onClick={handleDownSlot} className="down" />
        <Button name="" onClick={handleUpSlot} className="up" />
        </div>
        </div>
    );
};

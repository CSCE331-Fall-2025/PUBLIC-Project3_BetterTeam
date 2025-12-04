import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Dish } from "../pages/customer/CustomerDish";

interface CartContextType {
    items: Dish[][];
    addMeal: (meal: Dish[]) => void;
    clearCart: () => void;
    count: number;
}

interface CartProviderProps {
    children: ReactNode;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addMeal: () => {},
    clearCart: () => {},
    count: 0
});

export const CartProvider = ({ children }: CartProviderProps) => {
    const [items, setItems] = useState<Dish[][]>([]);

    const addMeal = (meal: Dish[]) => {
        setItems(prev => [...prev, meal]);
    };

    const clearCart = () => setItems([]);

    const count = items.length;

    return (
        <CartContext.Provider value={{ items, addMeal, clearCart, count }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

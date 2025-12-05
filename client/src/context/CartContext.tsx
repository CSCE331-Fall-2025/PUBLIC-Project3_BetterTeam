import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Dish } from "../pages/customer/CustomerDish";
import { useAuth } from "./AuthContext";

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
    count: 0,
});

export const CartProvider = ({ children }: CartProviderProps) => {
    const { user } = useAuth();
    const [items, setItems] = useState<Dish[][]>([]);

    const storageKey = user
        ? `cart_user_${user.id}`
        : "cart_guest";

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch {
                localStorage.removeItem(storageKey);
            }
        } else {
            setItems([]);
        }
    }, [storageKey]);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey]);

    const addMeal = (meal: Dish[]) => {
        setItems(prev => [...prev, meal]);
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem(storageKey);
    };

    const count = items.length;

    return (
        <CartContext.Provider value={{ items, addMeal, clearCart, count }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

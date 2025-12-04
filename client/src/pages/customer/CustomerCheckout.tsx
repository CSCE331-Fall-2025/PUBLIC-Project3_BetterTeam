import Button from '../../components/ButtonComponents/Button.tsx'
import type { Dish } from './CustomerDish';
import type {OrderCardProps} from '../../components/KitchenComponents/OrderCard.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext.tsx';
import './CustomerCheckout.css'

const API_BASE = import.meta.env.VITE_API_BASE;

type Order = OrderCardProps;

interface IngredientOption{
    inventory_id: number;
    name: string;
}
function getMealName(meal: Dish[]){
    const types = meal.map(d => d.type);
    const entreeCount = types.filter(t => t === "entree").length;

    if(entreeCount === 1) return "Bowl";
    if(entreeCount === 2) return "Plate";
    if(entreeCount === 3) return "Big Plate";

    if(types.includes("appetizer")) return "App";
    if(types.includes("drink")) return "Drink";
    if(types.includes("side")) return "Side";
    if(types.includes("season")) return "Seasonal";
    return "Meal";
}
function CustomerCheckout(){
    const navigate = useNavigate();
    const { items, clearCart } = useCart();
    const cart: Dish[][] = items;
    const total = cart.reduce((sum, meal) => sum + meal.reduce((mSum, d) => mSum + d.price, 0), 0);
    const [ingredientNames, setIngredientNames] = useState<Record<number, Record<number, string>>>({});


    useEffect(() => {
        async function loadIngredients(){
            const ingredientMap: Record<number, Record<number, string>> = {};
            for(const meal of cart){
                for(const dish of meal){
                    if(!dish.dish_id) continue;

                    try{
                        const res = await fetch(
                            `${API_BASE}/api/dishes/${dish.dish_id}/ingredients`
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
            }
            setIngredientNames(ingredientMap);
        }
        if(cart.length > 0) loadIngredients();
    }, [cart]);

    const handlePlaceOrder = async () => {
        try{

            const flatCart = cart.flat();
            const response = await fetch(`${API_BASE}/api/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cart: flatCart,
                    fk_customer: 26,
                    fk_employee: 29
                }),
            });

            const data = await response.json();
            const transactionId = data.transaction_id;

            if(!transactionId){
                alert("Error: No transaction ID returned");
                return;
            }

            alert(`Order Placed! Order Number : #${transactionId}`);

            //retrieve orders
            const storedOrders = localStorage.getItem("orders");
            let parsedOrders: Order[] = [];
            if (storedOrders){ parsedOrders = JSON.parse(storedOrders);}
            //push new order to orders
            let john = (Math.random()).toString();//uhhhh randomized id for now
            const newOrder: Order = {name:john, slot:0, items:cart.flat()};//name should be unique id somehow - Added .flat() to make it work for Dish[] rather than Dish[][]
            parsedOrders.push(newOrder);
            localStorage.setItem("orders",JSON.stringify(parsedOrders));
            //log for potential debugging
            console.log(parsedOrders);

            clearCart();
            navigate("/Customer/CustomerHome");
        } catch(err){
            console.error(err);
            alert("Failed to place order");
        }
    };

    const handleCancelOrder = () => {
        if(window.confirm('Are you sure you want to cancel your order?')){
            clearCart();
            navigate('/Customer/CustomerHome');
        }
    };

    const handleBack = () => {
        navigate('/Customer/CustomerHome');
    };

    const grammerLevel = (level : string) => {
        if(level === "none") return "No";
        if(level === "extra") return "Extra";
        return "";
    }
    return(
        <div className="checkout-page">
            <div className="receipt">
                {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <>
                        <h2>Receipt</h2>
                        <ul>
                            {cart.map((meal, mealIndex) => {
                                const mealName = getMealName(meal);

                                return(
                                    <li key={mealIndex}>
                                        <h3>{mealName}</h3>
                                        <ul>
                                            {meal.map((dish, index) => (
                                                <li key={index}>
                                                    {dish.name} - ${dish.price.toFixed(2)}

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
                                    </li>
                                );
                            })}
                        </ul>
                        <h3>Total: ${total.toFixed(2)}</h3>
                    </>
                )}
            </div>
            <div className="checkout-buttons">
                <Button name="Back" onClick={handleBack} />
                <Button
                    name="Cancel Order"
                    onClick={handleCancelOrder}
                    disabled={cart.length === 0}
                />
                <Button
                    name="Place Order"
                    onClick={handlePlaceOrder}
                    disabled={cart.length === 0}
                />
            </div>
        </div>
    );
}

export default CustomerCheckout;

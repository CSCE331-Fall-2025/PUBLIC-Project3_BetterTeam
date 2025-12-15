import Button from '../../components/ButtonComponents/Button.tsx'
import type { Dish } from './CustomerDish';
import type {OrderCardProps} from '../../components/KitchenComponents/OrderCard.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { PayPalButtons } from '@paypal/react-paypal-js';
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
    const { user } = useAuth();
    const cart: Dish[][] = items;
    const total = cart.reduce((sum, meal) => {
    return (
        sum +
        meal.reduce((mSum, d) => {
            let base = Number(d.price);
            if (d.customization) {
                for (const [invIdStr, lvl] of Object.entries(d.customization)) {
                    const invId = Number(invIdStr);
                    if (lvl === "extra" && invId !== 58) {
                        base += 0.5;
                    }
                }
            }
            return mSum + base;
        }, 0)
    );
}, 0);

    const [ingredientNames, setIngredientNames] = useState<Record<number, Record<number, string>>>({});
    const [isProcessing, setIsProcessing] = useState(false);


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
        if(isProcessing) return;
        setIsProcessing(true);
        try{
            const flatCart = cart.flat();
            const fk_customer = user ? user.id : 26;
            const fk_employee = 29;
            const response = await fetch(`${API_BASE}/api/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cart: flatCart,
                    fk_customer,
                    fk_employee
                }),
            });

            const data = await response.json();

            if(!response.ok){
                alert(data.error || "Order failed.");
                return;
            }
            
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
        } finally {
            setIsProcessing(false);
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

    const handlePayPalCreateOrder = async () => {
        try {
            const flatCart = cart.flat();
            const response = await fetch(`${API_BASE}/api/paypal/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart: flatCart }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create PayPal order");
            }

            const data = await response.json();
            return data.orderId;
        } catch (err) {
            console.error("Error creating PayPal order:", err);
            alert("Failed to create PayPal order. Please try again.");
            throw err;
        }
    };

    const handlePayPalApprove = async (data: { orderID: string }) => {
        try {
            setIsProcessing(true);
            const flatCart = cart.flat();
            const fk_customer = user ? user.id : 26;
            const fk_employee = 29;

            const response = await fetch(`${API_BASE}/api/paypal/capture-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: data.orderID,
                    cart: flatCart,
                    fk_customer,
                    fk_employee
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to capture payment");
            }

            const captureData = await response.json();

            if (captureData.status === "COMPLETED") {
                // so this part is going to retrieve orders and add the new order to the list
                const storedOrders = localStorage.getItem("orders");
                let parsedOrders: Order[] = [];
                if (storedOrders) { parsedOrders = JSON.parse(storedOrders); }
                
                // and this part will push new order to orders list
                const newOrder: Order = {
                    name: data.orderID,
                    slot: 0,
                    items: cart.flat()
                };
                parsedOrders.push(newOrder);
                localStorage.setItem("orders", JSON.stringify(parsedOrders));

                alert(`Payment Successful! Order Number: #${data.orderID}`);
                clearCart();
                navigate("/Customer/CustomerHome");
            } else {
                throw new Error("Payment was not completed");
            }
        } catch (err) {
            console.error("Error capturing PayPal payment:", err);
            alert("Failed to process payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayPalError = (err: any) => {
        console.error("PayPal error:", err);
        alert("An error occurred with PayPal. Please try again.");
    };

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
                                                    {dish.name} - ${Number(dish.price).toFixed(2)}

                                                    {dish.customization && (
                                                        <ul className="customization-list">
                                                            {Object.entries(dish.customization).map(([invIdStr, level]) => {
                                                                const invId = Number(invIdStr);
                                                                const ingName = ingredientNames[dish.dish_id]?.[invId];

                                                                if(level === "normal") return null;
                                                                return(
                                                                    <li key={invId} className="custom-line">
                                                                        {grammerLevel(level)} {ingName} {level === "extra" && invId !== 58 && "(+$0.50)"}
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
                    disabled={cart.length === 0 || isProcessing}
                />
                <Button
                    name="Place Order (No Payment)"
                    onClick={handlePlaceOrder}
                    disabled={cart.length === 0 || isProcessing}
                />
            </div>
            {cart.length > 0 && (
                <div style={{ marginTop: '20px', maxWidth: '500px', margin: '20px auto' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Pay with PayPal</h3>
                    <PayPalButtons
                        createOrder={handlePayPalCreateOrder}
                        onApprove={handlePayPalApprove}
                        onError={handlePayPalError}
                        disabled={isProcessing}
                        style={{ layout: "vertical" }}
                    />
                </div>
            )}
        </div>
    );
}

export default CustomerCheckout;

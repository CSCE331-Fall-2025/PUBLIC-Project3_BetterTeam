import Button from '../../components/ButtonComponents/Button.tsx'
import type { Dish } from './CustomerDish';
import type {OrderCardProps} from '../../components/KitchenComponents/OrderCard.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './CustomerCheckout.css'

const API_BASE = import.meta.env.VITE_API_BASE;

type Order = OrderCardProps;

interface LocationState{
    cart: Dish[];
}

interface IngredientOption{
    inventory_id: number;
    name: string;
}

function CustomerCheckout(){
    const location = useLocation();
    const navigate = useNavigate();
    const { cart = [] } = location.state as LocationState;
    const total = cart.reduce((sum, dish) => sum + dish.price, 0);
    const [ingredientNames, setIngredientNames] = useState<Record<number, Record<number, string>>>({});


    useEffect(() => {
        async function loadIngredients(){
            const ingredientMap: Record<number, Record<number, string>> = {};
            for(const dish of cart){
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
            setIngredientNames(ingredientMap);
        }
        if(cart.length > 0) loadIngredients();
    }, [cart]);

    const handlePlaceOrder = async () => {
        try{
            await fetch(`${API_BASE}/api/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cart,
                    fk_customer: 11,
                    fk_employee: 15
                }),
            });

            alert("Order Placed!");
            
            //retrieve orders
            const storedOrders = localStorage.getItem("orders");
            let parsedOrders: Order[] = [];
            if (storedOrders){ parsedOrders = JSON.parse(storedOrders);}
            //push new order to orders
            let john = (Math.random()).toString();//uhhhh randomized id for now
            const newOrder: Order = {name:john, slot:0, items:cart};//name should be unique id somehow
            parsedOrders.push(newOrder);
            localStorage.setItem("orders",JSON.stringify(parsedOrders));
            //log for potential debugging
            console.log(parsedOrders);

            navigate("/Customer/CustomerHome", { state: { cart: [] } });
        } catch(err){
            console.error(err);
            alert("Failed to place order");
        }
    };

    const handleCancelOrder = () => {
        if(window.confirm('Are you sure you want to cancel your order?')){
            navigate('/Customer/CustomerHome', { state: { cart: [] } });
        }
    };

    const handleBack = () => {
        navigate('/Customer/CustomerHome', {state: { cart } })
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
                            {cart.map((dish, index) => (
                                <li key={index}>
                                    <span>{dish.name}</span> - ${dish.price.toFixed(2)}

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

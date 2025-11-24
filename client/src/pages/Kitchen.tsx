//import {OrderCard} from '../components/KitchenComponents/OrderCard.tsx'
//import { useState } from "react";
import type {OrderCardProps} from '../components/KitchenComponents/OrderCard.tsx'
import {OrderBox} from '../components/KitchenComponents/OrderBox.tsx'
//import type { Dish } from './customer/CustomerDish';
import './Kitchen.css';

type Order = OrderCardProps;

/*const allEntrees: Dish[] = [
  { dish_id: 0, name: "Orange Chicken", price: 7},
  { dish_id: 0, name: "Beijing Beef", price: 7},
  { dish_id: 0, name: "Honey Walnut Shrimp", price: 8},
  { dish_id: 0, name: "Broccoli Beef", price: 6},
  { dish_id: 0, name: "Kung Pao Chicken", price: 7}
];*/

const Orders : Order[] = [
	/*{name: "t00", slot: 0, items: allEntrees},
	{name: "t01", slot: 1, items: allEntrees},
	{name: "t02", slot: 0, items: allEntrees},*/
];
//<OrderBox title={"Completed"} 	slot={2} orders={ordersDone} />
function Kitchen() {
	/*let [orders, setOrders] = useState<Order[]>(Orders);*/
	
	/*const updateOrderSlot = (name:string, newSlot: number) => {
		setOrders(prev =>
			prev.map(order =>
				order.name === name ? { ...order, slot: newSlot } : order
			)
		);
	};*/
	let orders = Orders;
	//retrieve orders
	const storedOrders = localStorage.getItem("orders");
	let parsedOrders: Order[] = [];
	if (storedOrders){ parsedOrders = JSON.parse(storedOrders);}
	orders = parsedOrders;

	return(
	//any kitchenmaxxers out here
	<div className="kitchen-page">
		<div className="slots">
			<OrderBox title={"Not Started"} slot={0} orders={orders.filter(order => order.slot === 0)} /*onSlotChange={updateOrderSlot}*/ />
			<OrderBox title={"Started"} 	slot={1} orders={orders.filter(order => order.slot === 1)} /*onSlotChange={updateOrderSlot}*/ />
			<OrderBox title={"Completed"} 	slot={2} orders={orders.filter(order => order.slot === 2)} /*onSlotChange={updateOrderSlot}*/ />
		</div>
	</div>
	);
}

export default Kitchen;

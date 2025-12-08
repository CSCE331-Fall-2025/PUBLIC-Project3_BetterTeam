import type {OrderCardProps} from '../components/KitchenComponents/OrderCard.tsx'
import {OrderBox} from '../components/KitchenComponents/OrderBox.tsx'
import './kitchen.css';

type Order = OrderCardProps;
const Orders : Order[] = [];

function Kitchen() {
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
			<OrderBox title={"Not Started"} slot={0} orders={orders.filter(order => order.slot === 0)}/>
			<OrderBox title={"Started"} 	slot={1} orders={orders.filter(order => order.slot === 1)}/>
			<OrderBox title={"Completed"} 	slot={2} orders={orders.filter(order => order.slot === 2)}/>
		</div>
	</div>
	);
}

export default Kitchen;

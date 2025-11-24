//import {OrderCard} from '../components/KitchenComponents/OrderCard.tsx'
import type {OrderCardProps} from '../components/KitchenComponents/OrderCard.tsx'
import {OrderBox} from '../components/KitchenComponents/OrderBox.tsx'
import type { Dish } from './customer/CustomerDish';
import './Kitchen.css';

type Order = OrderCardProps;
interface KitchenProps{
	orders: Order[];
}

/*interface OrderCard = {
	name: string;
}*/
const allEntrees: Dish[] = [
  { dish_id: 0, name: "Orange Chicken", price: 7},
  { dish_id: 0, name: "Beijing Beef", price: 7},
  { dish_id: 0, name: "Honey Walnut Shrimp", price: 8},
  { dish_id: 0, name: "Broccoli Beef", price: 6},
  { dish_id: 0, name: "Kung Pao Chicken", price: 7}
];

const ordersNotStarted : Order[] = [
	{name: "t00", slot: 0, items: allEntrees},
	{name: "t01", slot: 0, items: []},
	{name: "t02", slot: 0, items: []},
	{name: "t03", slot: 0, items: []},
];

const ordersStarted : Order[] = [
	{name: "t10", slot: 1, items: []},
	{name: "t11", slot: 1, items: []},
];

const ordersDone : Order[] = [
	{name: "t20", slot: 2, items: []},
	{name: "t21", slot: 2, items: []},
	{name: "t22", slot: 2, items: []},
];

function Kitchen({orders}: KitchenProps) {
	return(
	//any kitchenmaxxers out here
	//<OrderBox title={"test1"} orders={testOrders1} />
	<div className="kitchen-page">
		<div className="slots">
			<OrderBox title={"Not Started"} slot={0} orders={ordersNotStarted} />
			<OrderBox title={"Started"} 	slot={1} orders={ordersStarted} />
			<OrderBox title={"Completed"} 	slot={2} orders={ordersDone} />
		</div>
	</div>
	);
}

export default Kitchen;

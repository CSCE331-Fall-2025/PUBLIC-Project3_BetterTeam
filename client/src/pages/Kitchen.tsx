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
const Orders : Order[] = [
	{name: "t00", slot: 0, items: allEntrees},
	{name: "t01", slot: 0, items: []},
	{name: "t02", slot: 0, items: []},
	{name: "t03", slot: 0, items: []},
	{name: "t10", slot: 1, items: []},
	{name: "t11", slot: 1, items: []},
	{name: "t20", slot: 2, items: []},
	{name: "t21", slot: 2, items: []},
	{name: "t22", slot: 2, items: []},
];
//<OrderBox title={"Completed"} 	slot={2} orders={ordersDone} />
function Kitchen({orders}: KitchenProps) {
	
	return(
	//any kitchenmaxxers out here
	<div className="kitchen-page">
		<div className="slots">
			<OrderBox title={"Not Started"} slot={0} orders={Orders.filter(order => order.slot == 0)} />
			<OrderBox title={"Started"} 	slot={1} orders={Orders.filter(order => order.slot == 1)} />
			<OrderBox title={"Completed"} 	slot={2} orders={Orders.filter(order => order.slot == 2)} />
		</div>
	</div>
	);
}

export default Kitchen;


import './NavLinks.css';

import { Link } from 'react-router-dom';

export function TempHomeLinks() {
	return (
		<div>
			<Link to="/any/home">Home</Link>
			<Link to="/Manager/Dashboard">Dashboard</Link>
			<Link to="/Customer/CustomerHome">CustomerHome</Link>
			<Link to="/Cashier/CashierHome">CashierHome</Link>
			<Link to="/any/Login">Login</Link>
			<Link to="/any/Signup">Sign Up</Link>
			<Link to="/any/MenuBoard">Menu Board</Link>
		</div>
	);
}

export function ManagerLinks() {
	// add whatever manager pages:
	// Ex:
	// "/manager/<page>
	return (
		<div>
			<Link to="/Manager/Dashboard">Dashboard</Link>
			<Link to="/Manager/EmployeeData">Employee Data</Link>
			<Link to="/Manager/OrderTrends">Order Trends</Link>
			<Link to="/Customer/CustomerHome">CustomerHome</Link>
		</div>
	);
}

export function CashierLinks() {
	return (
		<div>
			<Link to="/Cashier/Home">Home</Link>
			<Link to="/Cashier/Checkout">Home</Link>
			{/* <Link to="/Customer/Checkout">Checkout</Link */}
		</div>
	);
}

export function CustomerLinks() {
	return (
		<div>
			<Link to="/Customer/Home">Home</Link>
			<Link to="/Customer/Checkout">Checkout</Link>
			<Link to="/Customer/Profile">Profile</Link>
			{/*<Link to="/Customer">Home</Link>*/}
			{/* <Link to="/Customer/Order">Order</Link */}
			{/* <Link to="/Customer/Profile">Profile</Link */}
		</div>
	);
}


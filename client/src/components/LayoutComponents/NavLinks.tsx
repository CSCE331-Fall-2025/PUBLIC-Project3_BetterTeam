
import './NavLinks.css';

import { Link } from 'react-router-dom';

export function TempHomeLinks() {
	return (
		<div className="nav-links">
			<Link to="/any/home">Home</Link>
			<Link to="/Manager/Dashboard">Manager Dashboard</Link>
			<Link to="/Customer/CustomerHome">Customer Home</Link>
			<Link to="/Cashier/CashierHome">Cashier Home</Link>
			<Link to="/any/Login">Login</Link>
			<Link to="/any/MenuBoard">Menu Board</Link>
		</div>
	);
}

export function ManagerLinks() {
	// add whatever manager pages:
	// Ex:
	// "/manager/<page>
	return (
		<div className="nav-links">
			<Link to="/any/home">Home</Link>
			<Link to="/Manager/Dashboard">Manager Dashboard</Link>
			<Link to="/Manager/EmployeeData">Employee Data</Link>
			<Link to="/Manager/Inventory">Inventory</Link>
			<Link to="/Manager/OrderTrends">Order Trends</Link>
			<Link to="/Kitchen">Kitchen</Link>
			<Link to="/any/login">Logout</Link>
			{/* <Link to="/Customer/CustomerHome">Customer Home</Link>
			<Link to="/Cashier/CashierHome">Cashier Home</Link> */}
		</div>
	);
}

export function CashierLinks() {
	return (
		<div className="nav-links">
			<Link to="/any/home">Home</Link>
			<Link to="/Cashier/CashierHome">Cashier Home</Link>
			{/* <Link to="/Customer/Checkout">Checkout</Link */}
		</div>
	);
}

export function CustomerLinks() {
	return (
		<div className="nav-links">
			<Link to="/any/Home">Home</Link>
			<Link to="/Customer/CustomerHome">Customer Home</Link>
			{/*<Link to="/Customer">Home</Link>*/}
			{/* <Link to="/Customer/Order">Order</Link */}
			{/* <Link to="/Customer/Profile">Profile</Link */}
		</div>
	);
}


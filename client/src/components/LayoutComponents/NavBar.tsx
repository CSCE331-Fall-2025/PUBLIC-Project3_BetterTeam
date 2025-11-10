
import './NavBar.css';

import { ManagerLinks, CashierLinks, CustomerLinks } from './NavLinks';
import { useLocation } from 'react-router-dom';


// TODO: As of now, this navbar will modularly display the relevant links depending on the "login"... however it does so based on the URL
// route.... 
// So http:panda/MANAGER/ will result in showing all manager links. This is fine for now, however once we implement auth, we need to enfore it... 
// so simply typing /manager to the url won't allow a customer to view the manager pages. 


function NavBar() {
	const path = useLocation().pathname;
	
	const isManager = path.startsWith("/Manager");
	const isCashier = path.startsWith("/Cashier");
	const isCustomer = path.startsWith("/Customer");

	// TODO: A logged in Customer & Guest Customer feature *basically* the same links... what to do about that.
	return (
		<div>
			<nav className="navbar">
				{isManager && <ManagerLinks />}
				{isCashier && <CashierLinks />}
				{isCustomer && <CustomerLinks />}
			</nav>
		</div>
	);
}

export default NavBar

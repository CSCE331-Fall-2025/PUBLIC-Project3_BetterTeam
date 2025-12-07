import "./NavLinks.css";
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext.tsx";

type LogoutProps = {
  onLogout: () => void;
};

// -------- Guest (not logged in) --------
export function GuestLinks() {
  const { count } = useCart();

  return (
    <div className="nav">
      <span className="nav-section-title">Guest</span>
      
      <NavLink className="nav-item" to="/any/home">Home</NavLink>
      <NavLink className="nav-item" to="/customer/customerhome">Order</NavLink>
      <NavLink className="nav-item" to="/customer/customercheckout"> Cart{count > 0 ? ` ${count}` : ""} </NavLink>
      <NavLink className="nav-item" to="/any/menuboard">Menu</NavLink>
      <div className="nav-spacer"></div>
      <NavLink className="nav-item" to="/any/login">Login</NavLink>
    </div>
  );
}


// -------- Customer --------
export function CustomerLinks({ onLogout }: LogoutProps) {
  const { count } = useCart();
  return (
    <div className="nav">
      <span className="nav-section-title">Customer</span>

      <NavLink className="nav-item" to="/customer/customerhome">Order</NavLink>
      <NavLink className="nav-item" to="/customer/customercheckout">Cart{count > 0 ? ` ${count}` : ""}</NavLink>
      <NavLink className="nav-item" to="/any/menuboard">Menu</NavLink>

      <div className="nav-spacer"></div>

      <NavLink className="nav-item" to="/customer/profile">Profile</NavLink>
      <button type="button" className="nav-item" onClick={onLogout}>Logout</button>
    </div>
  );
}

// -------- Cashier --------
export function CashierLinks({ onLogout }: LogoutProps) {
  return (
    <div className="nav">
      <span className="nav-section-title">Cashier</span>

      <NavLink className="nav-item" to="/cashier/cashierhome">Home</NavLink>
      <NavLink className="nav-item" to="/kitchen">Kitchen</NavLink>
      <NavLink className="nav-item" to="/any/menuboard">Menu</NavLink>

      <div className="nav-spacer"></div>

      <NavLink className="nav-item" to="/cashier/cashierprofile">Profile</NavLink>
      <button type="button" className="nav-item" onClick={onLogout}>Logout</button>
    </div>
  );
}

// -------- Manager --------
export function ManagerLinks({ onLogout }: LogoutProps) {
  return (
    <div className="nav">
      <span className="nav-section-title">Manager</span>

      <NavLink className="nav-item" to="/manager/dashboard">Dashboard</NavLink>
      <NavLink className="nav-item" to="/manager/employeedata">Employees</NavLink>
      <NavLink className="nav-item" to="/manager/employeemanage">Manage Staff</NavLink>
      <NavLink className="nav-item" to="/manager/inventory">Inventory</NavLink>
      <NavLink className="nav-item" to="/manager/ordertrends">Dishes</NavLink>
      <NavLink className="nav-item" to="/kitchen">Kitchen</NavLink>
      <NavLink className="nav-item" to="/any/menuboard">Menu</NavLink>

      <div className="nav-spacer"></div>

      <NavLink className="nav-item" to="/manager/managerprofile">Profile</NavLink>
      <button type="button" className="nav-item" onClick={onLogout}>Logout</button>
    </div>
  );
}


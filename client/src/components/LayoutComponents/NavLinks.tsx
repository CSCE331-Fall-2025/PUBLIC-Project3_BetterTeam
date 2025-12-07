
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
        <div className="nav-section">
            <p className="nav-section-title">Guest</p>
            <NavLink className="nav-item" to="/any/home">Home Screen</NavLink>
            <NavLink className="nav-item" to="/customer/customerhome">Order</NavLink>
            <NavLink className="nav-item" to="/customer/customercheckout"> Cart{count > 0 ? ` ${count}` : ""} </NavLink>
            <NavLink className="nav-item" to="/any/menuboard">Menu</NavLink>
        </div>

        <div className="nav-section">
            <NavLink className="nav-item" to="/any/login">Login</NavLink>
        </div>
    </div>
  );
}


// -------- Customer --------
export function CustomerLinks({ onLogout }: LogoutProps) {
  const { count } = useCart();
  return (
    <div className="nav">
        <div className="nav-section">
            <p className="nav-section-title">Customer</p>
            <NavLink className="nav-item" to="/customer/customerhome">Order</NavLink>
            <NavLink className="nav-item" to="/customer/customercheckout"> Cart{count > 0 ? ` ${count}` : ""}</NavLink>
            <NavLink className="nav-item" to="/any/menuboard">Menu</NavLink>
        </div>

        <div className="nav-section">
            <p className="nav-section-title">Account</p>
            <NavLink className="nav-item" to="/customer/profile">Profile</NavLink>
            <button type="button" className="nav-item" onClick={onLogout}>Logout</button>
        </div>
    </div>
  );
}

// -------- Cashier --------
export function CashierLinks({ onLogout }: LogoutProps) {
  return (
    <div className="nav">
        <div className="nav-section">
            <p className="nav-section-title">Cashier</p>
            <NavLink className="nav-item" to="/cashier/cashierhome">Cashier Home</NavLink>
            <NavLink className="nav-item" to="/kitchen">Kitchen</NavLink>
            <NavLink className="nav-item" to="/any/menuboard">Menu</NavLink>
        </div>

        <div className="nav-section">
            <p className="nav-section-title">Account</p>
            <NavLink className="nav-item" to="/cashier/cashierprofile">Profile</NavLink>
            <button type="button" className="nav-item" onClick={onLogout}>Logout</button>
        </div>
    </div>
  );
}

// -------- Manager --------
export function ManagerLinks({ onLogout }: LogoutProps) {
  return (
    <div className="nav">
        <div className="nav-section">
            <p className="nav-section-title">Cashier</p>
            <NavLink className="nav-item" to="/manager/dashboard">Manager Dashboard</NavLink>
            <NavLink className="nav-item" to="/manager/employeedata">Employee Data</NavLink>
            <NavLink className="nav-item" to="/manager/employeemanage">Employee Manage</NavLink>
            <NavLink className="nav-item" to="/manager/inventory">Inventory Manage</NavLink>
            <NavLink className="nav-item" to="/manager/ordertrends">Dish Manage</NavLink>
            <NavLink className="nav-item" to="/kitchen">Kitchen</NavLink>
            <NavLink className="nav-item" to="/any/menuboard">Menu</NavLink>
        </div>

        <div className="nav-section">
            <p className="nav-section-title">Account</p>
            <NavLink className="nav-item" to="/manager/managerprofile">Profile</NavLink>
            <button type="button" className="nav-item" onClick={onLogout}>Logout</button>
        </div>
    </div>
  );
}


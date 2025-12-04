
import "./NavLinks.css";
import { NavLink } from "react-router-dom";

type LogoutProps = {
  onLogout: () => void;
};

// -------- Guest (not logged in) --------
export function GuestLinks({ onLogout }: LogoutProps) {
  return (
    <div className="nav">
        <div className="nav-section">
            <p className="nav-section-title">Guest</p>
            <NavLink className="nav-item" to="/customer/customerhome">Order</NavLink>
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
  return (
    <div className="nav">
        <div className="nav-section">
            <p className="nav-section-title">Customer</p>
            <NavLink className="nav-item" to="/customer/customerhome">Order</NavLink>
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
            <NavLink className="nav-item" to="/cashier/profile">Profile</NavLink>
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
            <NavLink className="nav-item" to="/manager/inventory">Inventory</NavLink>
            <NavLink className="nav-item" to="/manager/ordertrends">Order Trends</NavLink>
            <NavLink className="nav-item" to="/kitchen">Kitchen</NavLink>
            <NavLink className="nav-item" to="/any/menuboard">Menu</NavLink>
        </div>

        <div className="nav-section">
            <p className="nav-section-title">Account</p>
            <NavLink className="nav-item" to="/manager/profile">Profile</NavLink>
            <button type="button" className="nav-item" onClick={onLogout}>Logout</button>
        </div>
    </div>
  );
}


import "./NavLinks.css";
import { Link } from "react-router-dom";

type LogoutProps = {
  onLogout: () => void;
};

// -------- Guest (not logged in) --------
export function GuestLinks() {
  return (
    <div className="nav-links">
      <Link to="/any/home">Home</Link>
      <Link to="/customer/customerhome">Customer Home</Link>
      <Link to="/any/login">Login</Link>
      <Link to="/any/menuboard">Menu</Link>
    </div>
  );
}


// -------- Customer --------
export function CustomerLinks({ onLogout }: LogoutProps) {
  return (
    <div className="nav-links">
      <Link to="/any/home">Home</Link>
      <Link to="/customer/customerhome">Customer Home</Link>
      <Link to="/customer/profile">Profile</Link>
      <Link to="/any/menuboard">Menu</Link>
      <button type="button" className="nav-link-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

// -------- Cashier --------
export function CashierLinks({ onLogout }: LogoutProps) {
  return (
    <div className="nav-links">
      <Link to="/any/home">Home</Link>
      <Link to="/cashier/cashierhome">Cashier Home</Link>
      <Link to="/kitchen">Kitchen</Link>
      <Link to="/any/menuboard">Menu</Link>
      <button type="button" className="nav-link-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

// -------- Manager --------
export function ManagerLinks({ onLogout }: LogoutProps) {
  return (
    <div className="nav-links">
      <Link to="/any/home">Home</Link>
      <Link to="/manager/dashboard">Manager Dashboard</Link>
      <Link to="/manager/employeedata">Employee Data</Link>
      <Link to="/manager/employeemanage">Employee Manage</Link>
      <Link to="/manager/inventory">Inventory</Link>
      <Link to="/manager/ordertrends">Order Trends</Link>
      <Link to="/kitchen">Kitchen</Link>
      <Link to="/any/menuboard">Menu</Link>
      <button type="button" className="nav-link-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}



import "./NavBar.css";

import {
  ManagerLinks,
  CashierLinks,
  CustomerLinks,
  GuestLinks,
} from "./NavLinks";
import { GoogleTranslate } from "./Translate";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/any/home");
  };

  return (
      <nav className="navbar">
        {!user && <GuestLinks />}

        {user?.role === "customer" && (
          <CustomerLinks onLogout={handleLogout} />
        )}

        {user?.role === "cashier" && (
          <CashierLinks onLogout={handleLogout} />
        )}

        {user?.role === "manager" && (
          <ManagerLinks onLogout={handleLogout} />
        )}

        <GoogleTranslate />

      </nav>
  );
}

export default NavBar;


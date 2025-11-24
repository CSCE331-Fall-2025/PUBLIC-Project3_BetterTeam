
import "./NavBar.css";

import { ManagerLinks, CashierLinks, CustomerLinks, TempHomeLinks } from "./NavLinks";
import { useAuth } from "../../context/AuthContext";

function NavBar() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div>
        <nav className="navbar">
          <TempHomeLinks />
        </nav>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        {user.role === "manager" && <ManagerLinks />}
        {user.role === "cashier" && <CashierLinks />}
        {user.role === "customer" && <CustomerLinks />}
      </nav>
    </div>
  );
}

export default NavBar;



import './Header.css'
import './TimeUpdate.js'
import { useAuth } from "../../context/AuthContext";

export default function Header() {
    const { user } = useAuth();
    return (
        <header>
            <h1 id="Greeting"> Hello, {user?.name ?? "Guest"} </h1>
            <h1 id="Time"> TIME </h1>
            <img id="Logo" src="../assets/panda.png" title="Panda Express Logo" ></img>
        </header>
  )
}


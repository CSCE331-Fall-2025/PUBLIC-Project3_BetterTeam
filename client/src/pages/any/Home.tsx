import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-wrapper">
            <div className="home-card">
                <img 
                    src="/assets/panda.png" 
                    alt="Agent Red Logo" 
                    className="home-logo"
                />

                <h1 className="home-title">Welcome to Agent Red</h1>
                <p className="home-subtitle">
                    Our Mission:
                    Precision. Flavor. Delivery.
                </p>

                <div className="home-buttons">
                    <button onClick={() => navigate("/Customer/CustomerHome")}>Begin Operation (Order)</button>
                    <button onClick={() => navigate("/any/login")}>Request Clearanace (Login)</button>
                </div>

            </div>
        </div>
    );
}

export default Home;

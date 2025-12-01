
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

const API_BASE = import.meta.env.VITE_API_BASE;

function Login() {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userGoogle, setUserGoogle] = useState<any>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const savedGoogle = localStorage.getItem("google_user");
    if (savedGoogle) setUserGoogle(JSON.parse(savedGoogle));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailInput || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailInput, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to login");
        return;
      }

      // store in global auth context
      login(data.user, data.token);

      // redirect by role
      if (data.user.role === "manager") {
        navigate("/manager/dashboard");
      } else if (data.user.role === "cashier") {
        navigate("/cashier/cashierhome");
      } else {
        navigate("/any/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      setUserGoogle(decoded);
      localStorage.setItem("google_user", JSON.stringify(decoded));
      console.log("Google login success:", decoded);
      // TODO: AHAD, call backend /api/auth/google and then login(data.user, data.token)
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUserGoogle(null);
    localStorage.removeItem("google_user");
    console.log("Google logged out");
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username"> Email</label>
              <input
                type="text"
                id="username"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          {!userGoogle ? (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Google login failed")}
            />
          ) : (
            <button
              type="button"
              className="google-logout-button"
              onClick={handleLogout}
            >
              Logout {userGoogle.name}
            </button>
          )}

          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/any/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


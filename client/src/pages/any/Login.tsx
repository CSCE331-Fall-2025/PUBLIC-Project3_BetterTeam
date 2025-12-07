import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

const API_BASE = import.meta.env.VITE_API_BASE;

function Login() {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  // ------------------------
  // Standard email/password login
  // ------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

      login(data.user, data.token);

      // Redirect based on role
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

  // ------------------------
  // Google Login Flow
  // ------------------------
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse.credential;
    if (!credential) return;

    const decoded: any = jwtDecode(credential);
    const googleEmail = decoded.email;
    const googleName = decoded.name;
    const googleSub = decoded.sub;

    const googlePassword = `GOOGLE-${googleSub}`;

    // 1) Try SIGNUP first
    let response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: googleEmail,
        password: googlePassword,
        name: googleName,
      }),
    });

    let data = await response.json();

    // If user already exists → go to LOGIN instead
    if (response.status === 409) {
      response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleEmail,
          password: googlePassword,
        }),
      });

      data = await response.json();
    }

    if (!response.ok) {
      console.error("Google OAuth backend error:", data.error);
      setError(data.error || "Google login failed.");
      return;
    }

    // 2) AuthContext login
    login(data.user, data.token);

    // 3) Redirect by role
    if (data.user.role === "manager") {
      navigate("/manager/dashboard");
    } else if (data.user.role === "cashier") {
      navigate("/cashier/cashierhome");
    } else {
      navigate("/any/home");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Email</label>
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

          <div className="divider"><span>or</span></div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google login failed")}
          />

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


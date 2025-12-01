
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE;

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      // log in the new customer into global auth context
      login(data.user, data.token);

      navigate("/any/home");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please try again.");
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      setUserGoogle(decoded);
      localStorage.setItem("google_user", JSON.stringify(decoded));
      console.log("Google signup success:", decoded);
      // TODO: later hook into backend /api/auth/google and login()
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUserGoogle(null);
    localStorage.removeItem("google_user");
    console.log("Google logged out");
  };

  return (
    <div className="signup-page-wrapper">
      <div className="signup-container">
        <div className="signup-card">
          <h2>Sign Up</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="signup-button">
              Sign Up
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

          <div className="signup-footer">
            <p>
              Already have an account? <Link to="/any/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;


import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Signup.css'

const page = {
    name: 'Sign Up',
    user: 'Any',
};

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
    };

    return(
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
                    <button type="button" className="google-signup-button" onClick={() => {}}>
                        Sign up with Google
                    </button>
                    <div className="signup-footer">
                        <p>Already have an account? <Link to="/any/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;

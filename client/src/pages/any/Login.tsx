import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to login');
                return;
            }

            
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            setUser(data.user);
            
            
            navigate('/any/home');
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again.');
        }
    };

    const handleGoogleSuccess = (credentialResponse: any) => {
        if (credentialResponse.credential) {
            const decoded: any = jwtDecode(credentialResponse.credential);
            setUser(decoded);
            localStorage.setItem('user', JSON.stringify(decoded));
            console.log('Google login success:', decoded);
        }
    };

    const handleLogout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('user');
        console.log('User logged out');
    };

    return(
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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

                    {!user ? (
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Google login failed')}
                        />
                    ) : (
                        <button
                            type="button"
                            className="google-logout-button"
                            onClick={handleLogout}
                        >
                            Logout {user.name}
                        </button>
                    )}
                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/any/Signup">Sign up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

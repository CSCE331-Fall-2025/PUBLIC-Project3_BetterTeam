import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'
import './Login.css'

const page = {
    name: 'Login',
    user: 'Any',
};

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
    };

    return(
        <div>
            <StaffHeader name={page.name}/>
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
                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
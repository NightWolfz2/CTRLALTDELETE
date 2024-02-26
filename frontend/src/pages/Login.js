import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import './../css/Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h3>Login</h3>
                <label>Email: </label>
                <input 
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <label>Password: </label>
                <input 
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <div className="button-container">
                    <button type="submit" className="auth-button" disabled={isLoading}>Login</button>
                    <Link to="/signup" className="auth-button btn-signup">Sign Up</Link>
                </div>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default Login;

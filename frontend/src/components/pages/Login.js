import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../css/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="login-container">
            <div className="form-container"> {/* Use form-container for styling */}
                <h3>Login</h3>
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    <div className="forgot-password">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <div className="button-container">
                    <button type="submit" className="auth-button" style={{ fontWeight: 'bold', fontSize: '1.2rem' }} disabled={isLoading}>
                    Login
                    </button>
                    <button 
                    className="auth-button btn-signup" 
                    onClick={() => navigate('/signup')} // Using useNavigate from 'react-router-dom'
                    style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                    >
                    Sign Up
                    </button>
                    </div>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default Login;

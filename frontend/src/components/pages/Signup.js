import { useState } from 'react';
import { useSignup } from "../../hooks/useSignup";
import '../../css/Signup.css';
import PasswordStrengthBox from "../PasswordStrengthBox";
import validator from 'validator';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Signup = () => {
    const [fname, setfName] = useState('');
    const [lname, setlName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordStrengthBox, setShowPasswordStrengthBox] = useState(false);
    const { signup, error, isLoading } = useSignup();
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowPasswordStrengthBox(true);

        if(validator.isStrongPassword(password)) {
            await signup(fname, lname, email, password);
        }
    };

    // Event handler for "Back to Login" button
    const handleBackToLogin = () => {
        navigate('/login'); // Navigate to the login page
    };

    return (
        <div className="signup-container">
            <form className="signup-form-container" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <label>First Name:</label>
                <input
                    type="text"
                    onChange={(e) => setfName(e.target.value)}
                    value={fname}
                    required
                />
                <label>Last Name:</label>
                <input
                    type="text"
                    onChange={(e) => setlName(e.target.value)}
                    value={lname}
                    required
                />
                <label>Email: </label>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <label>Password: </label>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <PasswordStrengthBox password={password} display={showPasswordStrengthBox} />
                <button disabled={isLoading}>Sign Up</button>
                {error && <div className="error">{error}</div>}
                <button type="button" onClick={handleBackToLogin} className="back-to-login-button">
                    Back to Login
                </button>
            </form>
        </div>
    );
};

export default Signup;

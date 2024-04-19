import { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useVerify } from '../../hooks/useVerify';
import '../../css/Verification.css';
import { useSendOTP } from '../../hooks/useSendOTP'; // Added for resending OTP

const Verification = () => {
    const { user } = useAuthContext();
    const [OTP, setOTP] = useState('');
    const { verifyEmail, error, isLoading, success } = useVerify();
    const { sendOTP } = useSendOTP(); // Added for resending OTP

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verifyEmail(user.email, OTP);
    };

    const handleResendOTP = async () => { // Function to handle resending OTP
        await sendOTP(user.email);
    };
    
    return (
        <div className="verification-container"> {/* Updated class name to match your style */}
            <form className="verification-form" onSubmit={handleSubmit}> {/* Updated class name to match your style */}
                <h2>Verification</h2>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <label>One Time Passcode:</label>
                <input 
                    type="text" // Changed type to text for OTP
                    onChange={(e) => setOTP(e.target.value)} 
                    value={OTP}
                    required // Ensure OTP is required
                />
                <button disabled={isLoading}>Verify</button> {/* Updated button text to "Verify" */}
                <button type="button" onClick={handleResendOTP} disabled={isLoading}>Resend OTP</button> {/* Added button to resend OTP */}
            </form>
        </div>
    );
};

export default Verification;
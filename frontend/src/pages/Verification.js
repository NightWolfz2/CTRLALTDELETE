import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import {useVerify} from '../hooks/useVerify'
import './../css/Verification.css';
import { useSendOTP } from '../hooks/useSendOTP';

const Verification = () => {
    const {user} = useAuthContext();
    const [OTP, setOTP] = useState('');
    const {verifyEmail, error, isLoading, success} = useVerify()
    const { sendOTP } = useSendOTP(); // Use sendOTP for resending OTP

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verifyEmail(user.email, OTP);
    };
    const handleResendOTP = async () => {
        await sendOTP(user.email); // Call sendOTP with the user's email to resend the OTP
    };
    return (
        <div>
            <form className="create" onSubmit={handleSubmit}>
                <h2>Verification</h2>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <label>One Time Passcode:</label>
                    <input 
                        type="text" // Changed type to "text" for OTP input
                        onChange={(e) => setOTP(e.target.value)}
                        value={OTP}
                    />
                <button disabled={isLoading} type="submit">Verify</button>
                <button type="button" onClick={handleResendOTP} disabled={isLoading}>Resend OTP</button> {/* Resend OTP button */}
            </form>
        </div>
    );
}

export default Verification
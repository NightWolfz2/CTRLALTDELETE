import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import {useVerify} from '../hooks/useVerify'
import './../css/Verification.css';

const Verification = () => {
    const {user} = useAuthContext();
    const [OTP, setOTP] = useState('');
    const {verifyEmail, error, isLoading, success} = useVerify()
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verifyEmail(user.email, OTP);
    };
    
    return (
        
        <div>
            <form className="create" onSubmit={handleSubmit}>
                <h2>Verification</h2>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <label>One Time Passcode:</label>
                    <input 
                        type="OTP"
                        onChange={(e) => setOTP(e.target.value)} 
                        value = {OTP}
                    />
                <button disabled={isLoading}>Sign Up</button>
            </form>
        </div>
    )
}

export default Verification
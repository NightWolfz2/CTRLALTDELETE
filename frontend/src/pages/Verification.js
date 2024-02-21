import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import {useVerify} from '../hooks/useVerify'


const Verification = () => {
    const {user} = useAuthContext();
    const [OTP, setOTP] = useState('');
    const {verifyEmail, error, isLoading} = useVerify()
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verifyEmail(user.email, OTP);
    };
    
    return (
        
        <div>
            <form className="create" onSubmit={handleSubmit}>
                <h2>Verification</h2>
                <label>One Time Passcode:</label>
                    <input 
                        type="OTP"
                        onChange={(e) => setOTP(e.target.value)} 
                        value = {OTP}
                    />
                <button disabled={isLoading}>Sign Up</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default Verification
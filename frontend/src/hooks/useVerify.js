import { useState } from 'react'
import { useAuthContext } from './useAuthContext'


export const useVerify = () => {
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    const verifyEmail = async (email,otp) => {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/user/verify-email', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,otp})
            
        })
        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok) {
            // saves user to local storage
            localStorage.setItem('user', JSON.stringify(json))
            // update context
            setTimeout(() => dispatch({type: 'LOGOUT', payload: json}), 2000); // logout after verifying
            setIsLoading(false)
            setSuccess(json.message);
        }
    }
    return {verifyEmail, isLoading, error, success}
}
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'


export const useUpdatePassword = () => {
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    const updatePassword = async (email,currentPassword,newPassword, otp) => {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/user/update-password', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,currentPassword,newPassword,otp})
            
        })
        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok) {
            setSuccess("You have successfully updated your password!");
            setTimeout(() => {
                // saves user to local storage
                localStorage.setItem('user', JSON.stringify(json))
                // update context
                dispatch({type: 'LOGOUT', payload: json}) // logout after verifying
                setIsLoading(false)
            }, 1500)
        }
    }
    return {updatePassword, isLoading, error, success}
}
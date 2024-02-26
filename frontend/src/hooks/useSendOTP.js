import { useState } from 'react'


export const useSendOTP = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const sendOTP = async (email) => {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/user/send-OTP', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
            
        })
        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok) {
            setIsLoading(false)
            
        }
    }
    const deleteOTP = async (email) => {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/user/delete-OTP', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
            
        })
        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok) {
            setIsLoading(false)
            
        }
    }
    return {sendOTP, deleteOTP, isLoading, error}
}
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'; 

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false) 
    const { dispatch } = useAuthContext()
    const navigate = useNavigate(); 

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) 
            })
            const json = await response.json()

            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
            } else {
                if (json.token && json.expiration) {
                    // Saves user info and token expiration to local storage
                    localStorage.setItem('user', JSON.stringify({
                        ...json,
                        expiration: json.expiration 
                    }))

                    // Update context
                    dispatch({ type: 'LOGIN', payload: json })

                    setIsLoading(false)
                    navigate('/'); // Redirect user to home page or dashboard
                } else {
                    setIsLoading(false)
                    setError("Login response is missing token or expiration data.")
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred during login.")
            setIsLoading(false)
        }
    }

    return { login, isLoading, error }
}
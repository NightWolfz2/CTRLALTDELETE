import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const login = async (email, password) => {    //added verfied
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}) 
            })
            const json = await response.json()

            console.log("Login response:", json);  // Debugging line
           

            if(!response.ok) {
                setIsLoading(false)
                setError(json.error)
            } else {
                // Check if json has necessary user data
                if (json && json.fname && json.lname) {
                    // Saves user to local storage
                    localStorage.setItem('user', JSON.stringify(json))

                    // Update context
                    dispatch({type: 'LOGIN', payload: json})
                } else {
                    setError("Invalid user data received.");
                }

                setIsLoading(false)
            }
        } catch (err) {
            setError("An error occurred during login.");
            setIsLoading(false);
        }
    }
    return { login, isLoading, error }
}

import { useState } from 'react';

export const useForgotPassword = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const forgotPassword = async (email) => {
        setIsLoading(true);
        setError(null);
        setMessage('');

        try {
            const response = await fetch('/api/user/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || 'Could not send password reset email.');
            }

            setMessage('Check your email for the password reset link.');
        } catch (error) {
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return { forgotPassword, isLoading, error, message };
};

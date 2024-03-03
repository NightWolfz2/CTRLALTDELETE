import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'; 

const useTokenExpirationChecker = () => {
  const navigate = useNavigate();
  const { logout } = useLogout(); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User from localStorage:', user); //DEBUG LINE
    if (!user || !user.expiration) return;

    const expirationTime = new Date(user.expiration).getTime();
    const currentTime = Date.now();
    const timeBeforeExpiration = expirationTime - currentTime;

    console.log('User expiration:', user.expiration); //DEBUG LINE
    console.log('Expiration time (ms):', expirationTime); //DEBUG LINE
    console.log('Current time (ms):', currentTime); //DEBUG LINE
    console.log('Time before expiration (ms):', timeBeforeExpiration); //DEBUG LINE

    if (timeBeforeExpiration <= 0) {
      // Proactive measure - if token is expired, log out and redirect to login page
      logout(); 
      navigate('/login');
    } else {
      // Notify user 10 minutes before token expiration
      const notificationTime = 10 * 60 * 1000; // 10 minutes in milliseconds   

      // Calculate when to show the notification so it's shown 10 minutes before token expires
      const showNotificationAfter = timeBeforeExpiration - notificationTime;

      console.log('Notification should show after (ms):', showNotificationAfter); //DEBUG LINE

      if (showNotificationAfter > 0) {
        const timer = setTimeout(() => {
            console.log('Alert should show now'); //DEBUG LINE
            alert('Your session will expire in 10 minutes. For security reasons, we require users to establish a new session every 3 days.'
            + ' Please log out and log back in to continue. If no action is taken, you will be automatically'
            + ' logged out and redirected to the login page.');
        }, showNotificationAfter);

        // Clear the timer when the component unmounts or if the user logs out
        return () => clearTimeout(timer);
      }
    }
  }, [navigate]);
};

export default useTokenExpirationChecker;
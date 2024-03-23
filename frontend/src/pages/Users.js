import React, { useEffect, useState, useContext } from 'react';
import { FaUserAlt, FaEnvelope, FaTrash, FaChevronCircleUp , FaChevronCircleDown , FaCrown } from 'react-icons/fa';
import { useNavigate} from 'react-router-dom';
import './../css/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState('');
  const [loggedUser, setLoggedUser] = useState(null); // Define loggedUser state
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [successMessages, setSuccessMessages] = useState({});

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    console.log('User from localStorage in delete:', userFromLocalStorage);
    if (!userFromLocalStorage || !userFromLocalStorage.expiration) return;
    setLoggedUser(userFromLocalStorage); // Set loggedUser state

    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/employees', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userFromLocalStorage.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const employeesData = await response.json();
        setUsers(employeesData);
      } catch (error) {
        console.error(error);
        setError(error.message || 'Failed to fetch employees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  

  const deleteClick = async (userToDelete) => {
    try {
      const response = await fetch(`/api/user/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${loggedUser.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deletingUser: loggedUser, userToDelete}),
      });
      const json = await response.json()
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error)
      } else {
        // setSuccess(json.success || true);
        setTimeout(() => {
          window.location.reload(); // Reload the page
          navigate('/users'); // Refresh the page after 2 seconds
        }, 1000);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const adminClick = async (userToAdmin) => {
    setError(null)
    
    const response = await fetch('/api/user/assign-admin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: loggedUser, updatingUser: userToAdmin})
        
    })
    const json = await response.json()

    if(!response.ok) {
      setError(json.error)
    }
    if(response.ok) {
      // setSuccess(json.success || true);
      setSuccessMessages({
        [userToAdmin._id]: json.success
      });
      setTimeout(() => {
        window.location.reload(); // Reload the page
        navigate('/users'); // Refresh the page after 2 seconds
      }, 1000);
    }
    
  };

  const deAdminClick = async (userTodeAdmin) => {
    setError(null)
    
    const response = await fetch('/api/user/unassign-admin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: loggedUser, updatingUser: userTodeAdmin})
        
    })
    const json = await response.json();
    console.log('Response:', json); // Add this line to check the response


    if(!response.ok) {
      setError(json.error)
    }
    else {
      setSuccessMessages({
        [userTodeAdmin._id]: json.success
      });
      setTimeout(() => {
        window.location.reload(); // Reload the page
        navigate('/users'); // Refresh the page after 2 seconds
      }, 1000);
    }
  };

  if (isLoading) return <div>Loading...</div>;


  return (
    <div className="users-container">
      <h1>Users</h1>
      <ul>
        {users
          // Filter out users with owner set to true
          .filter(user => !user.owner && loggedUser.role !== "employee" )
          .map(user => (
            <li key={user._id} className="user-item">
              <FaUserAlt className="icon user-icon" />
              <span className="user-info user-name">{user.fname} {user.lname}</span>
              <FaEnvelope className="icon email-icon" />
              <span className="user-info user-email">{user.email}</span>
              {user.role === 'admin' ? (
              <FaCrown className="icon role-icon gold" />
              ) : (
              <FaCrown className="icon role-icon" />
              )}
              <span className="user-info user-email">{user.role}</span>
              {successMessages[user._id] && <div className="success" style={{marginRight: "2em", padding: "0.5em 1.5em"}}>{successMessages[user._id]}</div>}
              { user.email !== loggedUser.email && user.role !== "admin" &&(
                <button className="delete-button" onClick={() => adminClick(user)}>
                  <FaChevronCircleUp className="icon admin-icon" />
                </button>
              )}
              {loggedUser.owner && user.role === "admin" && user.email !== loggedUser.email && (
                <button className="delete-button" onClick={() => deAdminClick(user)}>
                  <FaChevronCircleDown  className="icon deAdmin-icon" />
                </button>
              )}
              {loggedUser.owner &user.email !== loggedUser.email &&(
                <button className="delete-button" onClick={() => deleteClick(user)}>
                  <FaTrash className="icon trash-icon" />
                </button>
              )}
            </li>
          ))}
      </ul>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Users;

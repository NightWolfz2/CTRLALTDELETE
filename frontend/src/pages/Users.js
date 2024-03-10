import React, { useEffect, useState, useContext } from 'react';
import { useAuthContext } from './../hooks/useAuthContext'; // Make sure to import useAuthContext hook
import { FaUserAlt, FaEnvelope, FaTrash } from 'react-icons/fa';
import './../css/Users.css';

const Users = () => {
  const { user } = useAuthContext(); // Getting the user and token from the context
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user) return;

      try {
        const response = await fetch('http://localhost:4000/api/user/employees', { // Make sure this URL is correct
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`, // Getting the token from the user context
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const employeesData = await response.json();
        setUsers(employeesData); // Assuming the response structure is an array of users
      } catch (error) {
        console.error(error);
        setError(error.message || 'Failed to fetch employees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [user]); // Dependency array includes 'user' to re-run the effect when user changes

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="users-container">
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id} className="user-item">
            <FaUserAlt className="icon user-icon" />
            <span className="user-info user-name">{user.fname} {user.lname}</span>
            <FaEnvelope className="icon email-icon" />
            <span className="user-info user-email">{user.email}</span>
            <button className="delete-button">
              <FaTrash className="icon trash-icon" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
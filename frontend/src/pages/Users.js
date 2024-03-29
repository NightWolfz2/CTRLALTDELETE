import React, { useEffect, useState } from 'react';
import { FaUserAlt, FaEnvelope, FaTrash, FaChevronCircleUp, FaChevronCircleDown, FaCrown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './../css/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggedUser, setLoggedUser] = useState(null);
  const [successMessages, setSuccessMessages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    if (!userFromLocalStorage || !userFromLocalStorage.expiration) {
      navigate('/login'); // Redirect to login if no user is found
      return;
    }
    setLoggedUser(userFromLocalStorage);

    const fetchUsers = async () => {
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

    fetchUsers();
  }, [navigate]);

  const adminClick = async (userToAdmin) => {
    setError(null);

    try {
      const response = await fetch('/api/user/assign-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: loggedUser, updatingUser: userToAdmin })
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        setSuccessMessages({
          [userToAdmin._id]: json.success
        });
        const updatedUsers = users.map(user => {
          if (user._id === userToAdmin._id) {
            return { ...user, role: 'admin' };
          }
          return user;
        });
        setUsers(updatedUsers);
      }
    } catch (error) {
      setError(error.message || 'Failed to assign admin role');
    }
  };

  const deAdminClick = async (userToDeAdmin) => {
    setError(null);

    try {
      const response = await fetch('/api/user/unassign-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: loggedUser, updatingUser: userToDeAdmin })
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        setSuccessMessages({
          [userToDeAdmin._id]: json.success
        });
        const updatedUsers = users.map(user => {
          if (user._id === userToDeAdmin._id) {
            return { ...user, role: 'employee' };
          }
          return user;
        });
        setUsers(updatedUsers);
      }
    } catch (error) {
      setError(error.message || 'Failed to remove admin role');
    }
  };

  const deleteClick = async (userToDelete) => {
    setError(null);

    try {
      const response = await fetch(`/api/user/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${loggedUser.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deletingUser: loggedUser, userToDelete }),
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        setSuccessMessages({
          [userToDelete._id]: json.success
        });
        const updatedUsers = users.filter(user => user._id !== userToDelete._id);
        setUsers(updatedUsers);
      }
    } catch (error) {
      setError(error.message || 'Failed to delete user');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="users-container">
      <h1>Users</h1>
      <ul>
        {users
          // Filter out users with owner set to true
          .filter(user => !user.owner && loggedUser.role !== "employee")
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
              {successMessages[user._id] && <div className="success" style={{ marginRight: "2em", padding: "0.5em 1.5em" }}>{successMessages[user._id]}</div>}
              {user.email !== loggedUser.email && user.role !== "admin" && (
                <button className="delete-button" onClick={() => adminClick(user)}>
                  <FaChevronCircleUp className="icon admin-icon" />
                </button>
              )}
              {loggedUser.owner && user.role === "admin" && user.email !== loggedUser.email && (
                <button className="delete-button" onClick={() => deAdminClick(user)}>
                  <FaChevronCircleDown className="icon deAdmin-icon" />
                </button>
              )}
              {loggedUser.owner && user.email !== loggedUser.email && (
                <button className="delete-button" onClick={() => deleteClick(user)}>
                  <FaTrash className="icon trash-icon" />
                </button>
              )}
            </li>
          ))}
      </ul>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Users;

import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import './../css/Navbar.css'; // Import your CSS file
import { useLogout } from '../hooks/useLogout';
import {useAuthContext} from '../hooks/useAuthContext'


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const {user} = useAuthContext()
  const {logout} = useLogout()
  const handleLogOutClick = () => {
    logout()
    setIsMenuOpen(false)
  }
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
    
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.classList.contains('menu')) {
        setIsMenuOpen(false);
       
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, [isMenuOpen]);

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src="CodeNinjasLogo.png" alt="Code Ninjas Logo" />
      </div>
      <div className='navbar-brand'>
        NINJA MANAGER
      </div>
      
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/createTask">Create Task</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/overview">Overview</Link>       
        <Link to="/history">History</Link>
        
      </div>
      {user && (
      <div className="nav-links" style={{ marginLeft: 'auto'}}>
       <div className='nav-username'>
       {user ? `${user.fname} ${user.lname} ${user.role && user.role !== 'employee' ? ` (${user.role})` : ''}` : ''}
       </div>

        <button className={`menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>Menu</button>
        <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`} ref={menuRef}>
          <Link to="/profile" onClick={handleMenuItemClick}>Profile</Link>
          {user && user.role !== 'employee' && ( // Check if user exists and is not an employee
            <Link to="/users" onClick={handleMenuItemClick}>Users</Link>
          )}
          <Link to="/loggedout" onClick={handleLogOutClick}>Logout</Link>
        </div>
      </div>
      )}
    </div>
  );
};

export default Navbar;
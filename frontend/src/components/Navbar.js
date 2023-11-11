import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import './../css/Navbar.css'; // Import your CSS file

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const clickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src="CodeNinjasLogo.png" alt="Code Ninjas Logo" />
      </div>
      <div className='navbar-brand'>
        NINJAS MANAGER
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/createTask">Create Task</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/overview">Overview</Link>       
        <Link to="/history">History</Link>
      </div>
      <div className="nav-links" style={{ marginLeft: 'auto' }}>
        <div className='nav-username' style={{ marginRight: '20px' }}>
          USER NAME
        </div>
        <button className={`menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>Menu</button>
        <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`} ref={menuRef}>
          <a href="/profile">Profile</a>
          <a href="/logout">Logout</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
import { Link } from 'react-router-dom'
import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
    return(
            <div className="navbar">
              <div className="navbar-logo">
                <img src="CodeNinjasLogo.png" alt="Code Ninjas Logo" />
              </div>
              <div className='navbar-brand'>NINJAS MANAGER
              </div>
              <div className="nav-links">
                  <Link to="/">Home</Link>
                  <Link to="/createTask">Create Task</Link>
                  <Link to="/calendar">Calendar</Link>
                  <Link to="/overview">Overview</Link>       
                  <Link to="/history">History</Link>
              </div>
              <div className="nav-links" style={{ marginLeft: 'auto' }}>
                <div className='nav-username' style={{ marginRight: '20px', marginLeft: '20px' }}>
                  USER NAME
                </div>
                <button className="menu" id="openMenu" onClick={toggleMenu}>Menu</button>
              </div>
            </div>
    ) 
}

export default Navbar
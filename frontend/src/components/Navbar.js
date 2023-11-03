import { Link } from 'react-router-dom'
const Navbar = () => {
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
            </div>
    ) 
}

export default Navbar
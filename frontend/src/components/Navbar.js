import { Link } from 'react-router-dom'
const Navbar = () => {
    
    return(
        <header>
            <div className="container">
                <h1>Code Ninjas</h1>
                <nav className="navList">
                    <ul className="ulList">
                        <li className="navItem"><Link to="/">Home</Link></li>
                        <li className="navItem"><Link to="/createTask">Create Task</Link></li>
                        <li className="navItem"><Link to="/calendar">Calendar</Link></li>
                        <li className="navItem"><Link to="/overview">Overview</Link></li>
                        <li className="navItem"><Link to="/history">History</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Navbar
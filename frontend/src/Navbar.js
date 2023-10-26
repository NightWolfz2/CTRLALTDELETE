import { Link } from 'react-router-dom';

const Navbar = () => {
    return ( 
        <nav className="navbar">
             <div className="logo-title-container">
            <img src="https://res.cloudinary.com/micronetonline/image/upload/c_crop,h_362,w_780,x_0,y_0/v1580249584/tenants/f7ad7557-d52d-4af2-bcb5-ec334f8fc6b6/59a7c5ec6587427db30d47fa237c7a85/CN-logo-blk-backgrnd.png" alt="Logo" className="logo" />
            <h1 style={{ marginLeft: '50px' }}>Ninja Manager</h1>

            </div>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/create-task">Create Task</Link>
                <Link to="/calendar">Calendar</Link>
                <Link to="/overview">Overview</Link>
                <Link to="/history">History</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/menu">Menu</Link>
            </div>
        </nav>
     );
}
 
export default Navbar;

//import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';

function App() {
  //const title = "Task Manager";
  //<h1>{title}</h1>
  
  
  return (
    <Router>
      
        <Navbar />
        
      <div className="overview-section">
        <h1>Overview</h1>
        <div className="filter-options">

            <label for="status">Status: 
                <select id="status" name="status">
                    <option value="in-progress">In Progress</option>
                    <option value="past-due">Past Due</option>
                    <option value="completed">Completed</option>
                </select>
            </label>

            <label for="priority">Priority: 
                <select id="priority" name="priority">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </label>

            <label for="dueDate">Due Date: 
                <input type="date" id="dueDate" name="dueDate" />
            </label>

            <label for="search">Search: 
                <input type="search" id="search" name="search" placeholder="Search..." />
            </label>

        </div>

      </div>


        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
      
    </Router>
  );
}

export default App;

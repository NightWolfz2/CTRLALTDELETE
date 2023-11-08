import React, { useState } from "react";
import './../css/Overview.css'; // Import CSS file

const Overview = () => {
  const [priorityLevel, setPriorityLevel] = useState("All");
  const [status, setStatus] = useState("All");
  const [dueDate, setDueDate] = useState(null);
  const [searchBar, setSearch] = useState("All");
  
  const priorityChange = (e) => {
    setPriorityLevel(e.target.value);
  };

  const statusChange = (e) => {
    setStatus(e.target.value);
  };

  const duedateChange = (date) => {
    setDueDate(date);
  };
  const searchbarChange= (e) => {
    setSearch(e.target.value);
  }
  const clearFilters = () => {
    setPriorityLevel("All");
    setStatus("All");
    setDueDate(null);
    setSearch("All");
  };

  return (
    <div className='Overview'>
      <div className="page-title">
        <h2>Overview</h2>
      </div>

      <div className="priority-label">
        <label>Filter by Priority:</label>
        <select className="priority-select" value={priorityLevel} onChange={priorityChange}>
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
  
      <div className="status-label">
        <label>Filter by Status:</label>
        <select className="status-select" value={status} onChange={statusChange}>
          <option value="All">All</option>
          <option value="In Progress">In Progress</option>
          <option value="Past Due">Past Due</option>
        </select>
      </div>

      <div className="due-date-label">
        <label>Filter by Due Date:</label>
        <input className = "date-select" type="date"></input>
      </div> 

      <div className="search-bar-label">
	  			<label>Search Text:</label>
          <input className = "search-bar-select" type="text"></input>
	    
	     	
        </div>
      <div className="clear-button">
        <button onClick={clearFilters}>Clear Filters</button>
    </div>
    </div>
  );
};

export default Overview;

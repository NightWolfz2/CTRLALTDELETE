/*import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"

const Overview = () => { 
    return (
        <h2>Overview</h2>
      )
}

export default Overview

*/
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../src/index.css";
const Overview = () => {
  const [priorityLevel, setPriorityLevel] = useState("All");
  const [status, setStatus] = useState("All");
  const [dueDate, setDueDate] = useState(null);

  const priorityChange = (e) => {
    setPriorityLevel(e.target.value);
  };

  const statusChange = (e) => {
    setStatus(e.target.value);
  };

  const duedateChange = (date) => {
    setDueDate(date);
  };

  const clearFilters = () => {
    setPriorityLevel("All");
    setStatus("All");
    setDueDate(null);
  };

  return (
    <div>
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
      <DatePicker className="due-date-select" selected={dueDate} onChange={duedateChange} />
    </div>
  
    <div className="clear-button">
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  </div>
  

  );
};

export default Overview;

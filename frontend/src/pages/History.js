import React, { useState, } from "react"
import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import "./../css/History.css"

// components
import TaskDetails from "../components/TaskDetails"

const History = () => {
  const [selectedPriority, setSelectedPriority] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { dispatch } = useTasksContext();

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
  };

  const handleTextFilterChange = (event) => {
    setTextFilter(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const clearFilters = () => {
    setSelectedPriority("");
    setTextFilter("");
    setDueDate("");
  };

  const fetchCompletedTasks = async () => {
    const response = await fetch('/api/completed-tasks');
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'SET_TASKS', payload: json });
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, [dispatch]);

  return (
    
    <div>
      <div className="history">
      <div className="page-title">
        <h2>History</h2>
      </div>
    </div>
      <div className="hpriority-label">
        <label >Filter by Priority:</label>
        <select className="text-filter-input"
          value={selectedPriority}
          onChange={handlePriorityChange}
        >
          <option value="">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      
      <div className="hpriority-textlabel">
        <label> Filter by Text:</label>
        <input className="hpriority-textinput"
          type="text"
          value={textFilter}
          onChange={handleTextFilterChange}
        />
      </div>

      <div className="due-date-label">
        <label>Filter by Due Date:</label>
        <input
          className="date-select"
          type="date"
          value={dueDate}
          onChange={handleDueDateChange}
        />
      </div>
      
      <div className="clear-filters-button">
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

    </div>
  );
};

export default History
import React, { useState } from "react"
import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import "./../css/History.css"

const History = () => {
  const [selectedPriority, setSelectedPriority] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
  };

  const handleTextFilterChange = (event) => {
    setTextFilter(event.target.value);
  };

  const duedateChange = (date) => {
    setDueDate(date);
  };

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
          style={{ width: "96px" }}
        />
      </div>

     

    </div>
  );
};

export default History
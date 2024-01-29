import React, { useState } from "react";
import './../css/Overview.css'; // Import CSS file
<<<<<<< Updated upstream
=======
import editIcon from '../images/edit_icon.png';
import { useAuthContext } from '../hooks/useAuthContext';

import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"

import TaskDetails from "../components/TaskDetails"

import { useNavigate } from 'react-router-dom';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth()+1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
>>>>>>> Stashed changes

const Overview = () => {
  const [priorityLevel, setPriorityLevel] = useState("All");
  const [status, setStatus] = useState("All");
<<<<<<< Updated upstream
  const [dueDate, setDueDate] = useState(null);
=======
  const [dueDate, setDueDate] = useState("");
  const [searchBar, setSearch] = useState("");
  const {user} = useAuthContext();
  
  const {tasks, dispatch} = useTasksContext()

  const navigate = useNavigate();
  
    useEffect(() => {
    const fetchTasks = async () => {
      if(!user) {
        return
      }
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization':`Bearer ${user.token}`
        } 
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_TASKS', payload: json})
      }
    }
    if(user) {
      fetchTasks()
    }
    
  }, [dispatch, user])
  
  const currentDate = new Date(); 

  // Filter tasks for In Progress and Past Due
  
  const inProgressTasks = tasks ? tasks.filter(task => new Date(task.date) > currentDate) : [];
  const pastDueTasks = tasks ? tasks.filter(task => new Date(task.date) <= currentDate) : [];
>>>>>>> Stashed changes

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
  
      <div className="clear-button">
        <button onClick={clearFilters}>Clear Filters</button>
      </div>
    </div>
  );
};

export default Overview;

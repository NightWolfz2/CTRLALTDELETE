import React, {useState } from "react";
import './../css/History.css'; // Import CSS file

import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"

import TaskDetails from "../components/TaskDetails"

import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1; // adjust for zero-indexed months
  const year = date.getFullYear();
  return `${month}/${day}/${year}`; // mm/dd/yyyy
};

const Overview = () => {
  const {user} = useAuthContext();
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [dueDate, setDueDate] = useState("");
  const [searchBar, setSearch] = useState("");
  const {tasks, dispatch} = useTasksContext()

  const navigate = useNavigate();
  
    useEffect(() => {
      if(!user) {
        return
      }
    const fetchTasks = async () => {
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

    fetchTasks()
  }, [dispatch, user])
  
  // Filter tasks for In Progress and Past Due
  //placeholder for tags of complete tasks
    
  
  const priorityChange = (e) => {
    setSelectedPriority(e.target.value);
  };
  
  const duedateChange = (e) => {
    setDueDate(e.target.value);
  };
  
  const searchbarChange = (e) => {
    setSearch(e.target.value);
  }

  const toUTCStartOfDay = (localDate) => {
    const date = new Date(localDate);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString();
  };
  
  const resetFilters = () => {
    setSelectedPriority("all");
    setDueDate(""); // Clear the due date by setting it to an empty string
    setSearch(""); // Clear the search bar by setting it to an empty string
  };
  

  const handleEditTask = (taskId) => {
    //console.log(`Editing task with ID ${taskId}`);
    navigate(`/editTask/${taskId}`);
  };

  const convertUTCToLocalDate = (utcDate) => {
    const date = new Date(utcDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  const filterTasks = (taskList) => {
    return (taskList || []).filter(task => {
      const priorityMatch = selectedPriority === 'all' || task.priority.toLowerCase() === selectedPriority;
      const dueDateMatch = !dueDate || toUTCStartOfDay(task.date).split('T')[0] === toUTCStartOfDay(dueDate).split('T')[0];
      const searchMatch = !searchBar || task.title.toLowerCase().includes(searchBar.toLowerCase());
      return priorityMatch && dueDateMatch && searchMatch;
    });
  };
  
  return (
    <div className='History'>
      <div className="page-title">
        <h2>History</h2>
      </div>


      <div className="priority-label">
        <label>Filter by Priority:</label>
        <select className="priority-select" value={selectedPriority} onChange={priorityChange}>
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="due-date-label">
        <label>Filter by Due Date:</label>
        <input
          className="date-select"
          type="date"
          value={dueDate}
          onChange={duedateChange}
        />
      </div> 

      <div className="search-bar-label">
        <label>Search Text:</label>
        <input
          className="searchBar"
          type="text"
          value={searchBar}
          onChange={searchbarChange}
        />
      </div>


      <div className="clear-button"> 
        <button onClick={resetFilters}>Reset Filters</button> 
      </div>
	
		<div className="additional-boxes">
		  {filterTasks(tasks).map((task, index) => (
			<div className="task-box" key={task._id}>

			<div className="box2">
			
        </div>
			
			<div className="box1">
				<p> <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Task - {index + 1} {task.title}</b></p>
				
			</div>
			
			  <div className="box1">
			  
				<div className={`little-box1 ${
          task.priority === 'High' ? 'high-priority-box' :
          task.priority === 'Medium' ? 'medium-priority-box' :
          task.priority === 'Low' ? 'low-priority-box' : '' // No class added if priority is null
        }`}>
          Priority - {task.priority || 'None'}
        </div>


				<div className="little-box1">
					Due Date {formatDate(task.date)}
				
				</div>
			  </div>
			  
			  <div className="box">
				<div className="little-box">
				<p><b>Assigned Employee(s):</b></p>
				<p>{task.employee}</p>
				<p><b>Email:</b>{task.email}</p>
				<p><b>Phone:</b>{task.phone}</p>
				
				</div>
				<div className="little-box">
					<p><b>Task Description:</b></p>
					<p>{task.description}</p>

				
				</div>
				<div className="little-box">
					<p><b>Edit History:</b></p>
					<p>{task.history}</p>


				</div>

			  </div>
			</div>
		  ))}
		</div>
		
    </div>
  );
};

export default Overview;
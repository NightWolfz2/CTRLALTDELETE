import React, { Component,useState } from "react";
import './../css/Overview.css'; // Import CSS file
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

const Overview = () => {
  const [priorityLevel, setPriorityLevel] = useState("All");
  const [status, setStatus] = useState("All");
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

  const priorityChange = (e) => {
    setPriorityLevel(e.target.value);
  };

  const statusChange = (e) => {
    setStatus(e.target.value);
  };

  const duedateChange = (e) => {
    setDueDate(e.target.value);
  };
  
  const searchbarChange = (e) => {
    setSearch(e.target.value);
  }
  
  const resetFilters = () => {
    setPriorityLevel("All");
    setStatus("All");
    setDueDate(""); // Clear the due date by setting it to an empty string
    setSearch(""); // Clear the search bar by setting it to an empty string
  };
  

  const handleEditTask = (taskId) => {
    //console.log(`Editing task with ID ${taskId}`);
    navigate(`/editTask/${taskId}`);
  };

  const getTaskStatus = (task) => {
	  const taskDueDate = new Date(task.date);
	  
	  if (taskDueDate > currentDate) {
		return "In Progress";
	  } else {
		return "Past Due";
	  }
	};
	
	const getPriorityStatus = (priority) => {
    switch (priority) {
      case 'Low':
        return 'Low';
      case 'Medium':
        return 'Medium';
      case 'High':
        return 'High';
      default:
        return 'Unknown';
    }
  };  

const handleButtonClick = (taskId) => {
  setCompletedStates((prevStates) => {
    const newStates = new Map(prevStates);
    newStates.set(taskId, !newStates.get(taskId));
    return newStates;
  });
};

const [completedStates, setCompletedStates] = useState(new Map());

  
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
		  {tasks && tasks.slice(0, 200).map((task, index) => (
			<div className="task-box" key={task._id}>

             <button
                className={`box2`}
                onClick={() => handleButtonClick(task._id)}
				>
                <div className={`little-box2 ${completedStates.get(task._id) ? 'completed' : ''}`}>
                  <b>{completedStates.get(task._id) ? 'Completed' : 'Mark Complete'}</b>
                </div>
              </button>

			<div className="box1">
				<p> <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Task - {index + 1} {task.title}</b></p>
				
				
			</div>
			
			  <div className="box1">
			  
				
				
				<div className="little-box1">
					Status - {getTaskStatus(task)}
				</div>
        <div className={`little-box1 ${task.priority === 'High' ? 'high-priority-box' : task.priority === 'Medium' ? 'medium-priority-box' : 'low-priority-box'}`}>
        Priority - {getPriorityStatus(task.priority)}
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

        <div className="edit-button">
        <button 
          style={{ backgroundImage: `url(${editIcon})` }}
          onClick={() => handleEditTask(task._id)}></button>


          
        </div>
			  </div>
			</div>
		  ))}
		</div>
		
    </div>
  );
};

export default Overview;
import React, { Component, useState } from "react";
import './../css/History.css'; // Import CSS file
import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import TaskDetails from "../components/TaskDetails"
import editIcon from '../images/trash_icon.png';
import trashIcon from '../images/edit_icon.png';
import { useNavigate } from 'react-router-dom';
import { useCustomFetch } from '../hooks/useCustomFetch';
import { useLogout } from '../hooks/useLogout';
import moment from 'moment-timezone';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1; // adjust for zero-indexed months
  const year = date.getFullYear();
  return `${month}/${day}/${year}`; // mm/dd/yyyy
};

const Overview = () => {
  const [priorityLevel, setPriorityLevel] = useState("All");
  const [status, setStatus] = useState("All");
  const [dueDate, setDueDate] = useState("");
  const [searchBar, setSearch] = useState("");

  const { tasks, dispatch } = useTasksContext()

  const navigate = useNavigate();
  const customFetch = useCustomFetch();
  const { logout } = useLogout();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const json = await customFetch('/api/tasks');
        dispatch({ type: 'SET_TASKS', payload: json });
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.message === 'Unauthorized') {
          logout();
          navigate('/login');
        }
      }
    };
    fetchTasks();
  }, []);
  
  const currentDate = new Date(); 
  
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
  
  const deleteClick = async (task) => {
    try {
      await customFetch('/api/tasks/' + task._id, 'DELETE');
      dispatch({ type: 'DELETE_TASK', payload: { _id: task._id } });
      //onClose(); // Close the task details after deletion
    } catch (error) {
      console.error("Error during task deletion:", error);
      if (error.message === 'Unauthorized') {
        logout();
        navigate('/login');
      }
    }
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
  const [completedStates, setCompletedStates] = useState(new Map());
  
  const filterTasks = () => {

    return tasks.filter(task => {
      const priorityMatch = priorityLevel === 'All' || task.priority.toLowerCase() === priorityLevel.toLowerCase();
      const statusMatch = status === 'All' || getTaskStatus(task) === status;
      const dueDateMatch = !dueDate || moment.utc(task.date).tz('America/Los_Angeles').format('YYYY-MM-DD') === dueDate;
      const searchMatch = searchBar === '' || task.title.toLowerCase().includes(searchBar.toLowerCase());
      const isCompleteOrDeleted = task.completed || task.deleted; // Only include completed tasks
      return priorityMatch && statusMatch && dueDateMatch && searchMatch && isCompleteOrDeleted;
    });
  };

  const handleButtonClick = async (taskId) => {
    try {
      // Fetch the data asynchronously
      const response = await customFetch(`/api/tasks/complete-task/${taskId}`, 'PATCH');
      const json = await response.json();

      // Dispatch the action with the updated task data
      dispatch({ type: 'UPDATE_TASK', payload: json });

      // Update the completed states
      setCompletedStates((prevStates) => {
        const newStates = new Map(prevStates);
        newStates.set(taskId, true); // Assuming taskId is the key for the completed state
        return newStates;
      });
    } catch (error) {
      console.error('Error:', error);
      // Handle errors here
    }
  };

  return (
    <div className='History'>
      <div className="page-title">
        <h2>History</h2>
      </div>

      <div className="filters-bar">
        <div className="filter-wrapper">
          <label htmlFor="status">Status:</label>
          <select id="status" className="filter-select" value={status} onChange={statusChange}>
            <option value="All">All</option>
            <option value="Complete">Complete</option>
            <option value="Deleted">Deleted</option>
          </select>
        </div>

        <div className="filter-wrapper">
          <label htmlFor="priority">Priority:</label>
          <select id="priority" className="filter-select" value={priorityLevel} onChange={priorityChange}>
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="filter-wrapper">
          <label htmlFor="due-date">Due Date:</label>
          <input
            id="due-date"
            className="filter-input"
            type="date"
            value={dueDate}
            onChange={duedateChange}
          />
        </div>

        <div className="filter-wrapper search-wrapper">
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            className="filter-input"
            type="text"
            value={searchBar}
            onChange={searchbarChange}
          />
        </div>

        <div className="clear-button">
          <button onClick={resetFilters}>Reset Filters</button>
        </div>
      </div>
	
		<div className="additional-boxes">
		  {filterTasks().map((task, index) => (
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
        <button
                className={`box2`}
                onClick={() => handleButtonClick(task._id)}
				>
                <div className={`little-box2 ${task.deleted ? 'deleted' : completedStates.get(task._id) ? 'completed' : ''}`}>
                <b>{task.deleted ? 'Deleted' : completedStates.get(task._id) ? 'Completed' : 'Complete'}</b>
                </div>
              </button>
			  
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
          <div className="edit-button">
                <button
                  style={{ backgroundImage: `url(${trashIcon})` }}
                  onClick={() => deleteClick(task)}
                ></button>
          </div>
				
				</div>

			  </div>
			</div>
		  ))}
		</div>
		
    </div>
  );
};

export default Overview;
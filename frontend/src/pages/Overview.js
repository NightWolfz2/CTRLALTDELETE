import React, { useState, useEffect } from "react";
import './../css/Overview.css'; // Import CSS file
import editIcon from '../images/edit_icon.png';
import { useTasksContext } from "../hooks/useTasksContext"; 
import TaskDetails from "../components/TaskDetails";
import { useNavigate } from 'react-router-dom';
import { useCustomFetch } from '../hooks/useCustomFetch';
import { useLogout } from '../hooks/useLogout';

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
  const { tasks, dispatch } = useTasksContext(); 
  const customFetch = useCustomFetch(); 
  const navigate = useNavigate(); 
  const { logout } = useLogout(); 
  const [editHistoryMessage, setEditHistoryMessage] = useState('');
  const [taskChanged, setTaskChanged] = useState(false);
  const [showEditHistory, setShowEditHistory] = useState(false); 


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const json = await customFetch('/api/tasks');
        dispatch({type: 'SET_TASKS', payload: json})
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.message === 'Unauthorized') {
          logout(); 
          navigate('/login'); 
        }
      }
    }
    fetchTasks();
  }, []);
  
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
  };

  const resetFilters = () => {
    setPriorityLevel("All");
    setStatus("All");
    setDueDate("");
    setSearch("");
  };
  
  const handleEditTask = (taskId) => {
    const editedTaskIndex = tasks.findIndex(task => task._id === taskId);
    
    if (editedTaskIndex !== -1) {
      const editedTask = tasks[editedTaskIndex];
    
      const updatedTasks = [...tasks];
      dispatch({ type: 'SET_TASKS', payload: updatedTasks });
    
        navigate(`/editTask/${taskId}`);
    } else {
      console.error('Task not found');
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
  const filterTasks = () => {
    return tasks.filter(task => {
      const priorityMatch = priorityLevel === 'All' || task.priority.toLowerCase() === priorityLevel.toLowerCase();
      const statusMatch = status === 'All' || task.status.toLowerCase() === status.toLowerCase();
      const dueDateMatch = dueDate === '' || task.date.includes(dueDate);
      const searchMatch = searchBar === '' || task.title.toLowerCase().includes(searchBar.toLowerCase());
      const notCompleted = !task.completed; // Check if task is not completed
      const notDeleted = !task.deleted; //Check if task is not deleted
    return priorityMatch && statusMatch && dueDateMatch && searchMatch && notCompleted && notDeleted;
    });
  };

  return (
    <div className='Overview'>
      <div className="page-title"> 
        <h2>Overview</h2>
        <div className="filter-container">

          <div className="priority-label">
            <label>Priority: </label>
            <select className="priority-select" value={priorityLevel} onChange={priorityChange}>
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="status-label">
            <label>Status: </label>
            <select className="status-select" value={status} onChange={statusChange}>
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Past Due">Past Due</option>
            </select>
          </div>

          <div className="due-date-label">
            <label>Due Date: </label>
            <input
              className="date-select"
              type="date"
              value={dueDate}
              onChange={duedateChange}
            />
          </div>

          <div className="search-bar-label">
            <label>Search: </label>
            <input
              className="searchBar"
              type="text"
              value={searchBar}
              onChange={searchbarChange}
            />
          </div>
        </div>
        <div className="clear-button">
          <button onClick={resetFilters}>Reset Filters</button>
        </div>
      </div>

      <div className="additional-boxes">
        {filterTasks().map((task, index) => (
          <div className="task-box" key={task._id}>
            <div className="box1">
              <p> <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Task - {index + 1} {task.title}</b></p>
            </div>
            <div className="box1">
              <div className="little-box1">
                Status - {task.status}
              </div>
              <div className={`little-box1 ${task.priority === 'High' ? 'high-priority-box' : task.priority === 'Medium' ? 'medium-priority-box' : 'low-priority-box'}`}>
                Priority - {task.priority}
              </div>
              <div className="little-box1">
                Due Date {formatDate(task.date)}
              </div>
            </div>
            <button
                className={`box2`}
                onClick={() => handleButtonClick(task._id)}
				>
                <div className={`little-box2 ${completedStates.get(task._id) ? 'completed' : ''}`}>
                  <b>{completedStates.get(task._id) ? 'Completed' : 'Mark Complete'}</b>
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
              </div>
              <div className="little-box">
                <p><b>Edit History:</b></p>
                <p><b>- Task was created on</b> {new Date(task.createdAt).toLocaleString()}</p >
                <p><b>- Task was last edited on</b> {new Date(task.updatedAt).toLocaleString()}</p>
                {task.history && (
              <div>
                {task.history.split('\n').map((entry, index) => (
                <p key={index}>{entry}</p>
                ))}
              </div>
                )}
              </div>
              <div className="edit-button">
                <button
                  style={{ backgroundImage: `url(${editIcon})` }}
                  onClick={() => handleEditTask(task._id)}
                ></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
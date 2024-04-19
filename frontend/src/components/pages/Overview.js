import React, { useState, useEffect } from "react";
import '../../css/Overview.css'; // Import CSS file
import editIcon from '../../images/edit_icon.png';
import { useTasksContext } from "../../hooks/useTasksContext"; 
import TaskDetails from "../TaskDetails";
import { useNavigate } from 'react-router-dom';
import { useCustomFetch } from '../../hooks/useCustomFetch';
import { useLogout } from '../../hooks/useLogout';
import moment from 'moment-timezone';
import { useAuthContext } from '../../hooks/useAuthContext';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth()+1;
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
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
  const [employeeNamesMap, setEmployeeNamesMap] = useState({});
  const { user } = useAuthContext();
  const isPastDue = (date) => new Date(date) < new Date();




  const fetchEmployeeNames = async (employeeIds) => {
    const details = await Promise.all(employeeIds.map(async (id) => {
      try {
        const response = await fetch(`http://localhost:4000/api/user/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) throw new Error('Could not fetch employee details');
        const data = await response.json();
        return { name: `${data.fname} ${data.lname}`, email: data.email };
      } catch (error) {
        console.error(error);
        return { name: 'Deleted User', email: 'Deleted Email' };
      }
    }));
    return details.reduce((acc, curr, index) => {
      acc[employeeIds[index]] = curr;
      return acc;
    }, {});
  };

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const allEmployeeIds = tasks.reduce((acc, task) => {
        task.employees.forEach(id => {
          if (!acc.includes(id)) {
            acc.push(id);
          }
        });
        return acc;
      }, []);
  
      fetchEmployeeNames(allEmployeeIds).then(setEmployeeNamesMap);
    }
  }, [tasks]); // Make sure to include tasks as a dependency
  
  

  useEffect(() => {
    const fetchAndUpdateTasks = async () => {
      try {
        // Fetch the latest tasks from the server
        const json = await customFetch('/api/tasks');
        
        // Process the tasks if needed (e.g., update statuses based on current date)
        const updatedTasks = json.map(task => ({
          ...task,
          // Assuming 'isPastDue' is a function to check if the task is past due
          status: isPastDue(task.date) ? 'Past Due' : task.status
        }));
  
        // Update the tasks in the state
        dispatch({ type: 'SET_TASKS', payload: updatedTasks });
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.message === 'Unauthorized') {
          logout(); 
          navigate('/login'); 
        }
      }
    };
  
    // Fetch tasks when the component mounts
    fetchAndUpdateTasks();
  
    // Set up a periodic update every 60 seconds (60000 milliseconds)
    const intervalId = setInterval(fetchAndUpdateTasks, 60000);
  
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [customFetch, dispatch, logout, navigate]);
  
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
      const dueDateMatch = !dueDate || moment.utc(task.date).tz('America/Los_Angeles').format('YYYY-MM-DD') === dueDate;
      const searchMatch = searchBar === '' || task.title.toLowerCase().includes(searchBar.toLowerCase());
      const notCompleted = !task.completed; // Check if task is not completed
      const notDeleted = !task.deleted; //Check if task is not deleted
    return priorityMatch && statusMatch && dueDateMatch && searchMatch && notCompleted && notDeleted;
    });
  };

  return (
    <div className='Overview' style={{ paddingBottom: "4rem" }}>
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
              <p> <b># Task {index + 1} - {task.title}</b></p>
            </div>
            <div className="box1">
              <div className={`little-box1 ${isPastDue(task.date) ? 'past-due-box' : 'in-progress-box'}`}>
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
            <div className="little-box"style={{ wordWrap: 'break-word', overflowY: 'auto' }}>
            <p><b>Assigned Employee(s):</b></p>
            {task.employees && task.employees.length > 0 ? (
              task.employees.map(id => (
                <div key={id}>
                  {employeeNamesMap[id] ? (
                    <>
                      <p>Name: {employeeNamesMap[id].name}</p>
                    </>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              ))
            ) : (
              <p>No one assigned</p>
            )}
          </div>

              <div className="little-box"style={{ wordWrap: 'break-word', overflowY: 'auto' }}>
                <p><b>Task Description:</b></p>
                <p>{task.description}</p>
              </div>
              <div className="little-box"style={{ wordWrap: 'break-word', overflowY: 'auto' }}>
              <p><b>Edit History:</b></p>
                {/* Display message for createdBy user */}
                <p><b>- Task was created on</b> {new Date(task.createdAt).toLocaleString()} <b>by:</b> {task.createdBy ? `${task.createdBy.fname} ${task.createdBy.lname}` : 'a user that no longer exists'}</p>
                
                {/* Display message for updatedBy user if the task has been edited */}
                {task.updatedAt > task.createdAt ? (
                  <p><b>- Task was last edited on</b> {new Date(task.updatedAt).toLocaleString()} <b>by:</b> {task.updatedBy ? `${task.updatedBy.fname} ${task.updatedBy.lname}` : 'a user that no longer exists'}</p>
                ) : (
                  <p><b>- Task has not been edited</b></p>
                )}

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
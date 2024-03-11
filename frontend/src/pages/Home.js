import { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import './../css/Home.css'; // Import your CSS file
import TaskDetails from "../components/TaskDetails";
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom'; 
import { useCustomFetch } from '../hooks/useCustomFetch'; 
import { useLogout } from '../hooks/useLogout'; 
import moment from 'moment-timezone';

const Home = () => {
  const { tasks, dispatch } = useTasksContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDueDate, setSelectedDueDate] = useState("");
  const { user } = useAuthContext();
  const customFetch = useCustomFetch(); 
  const navigate = useNavigate(); 
  const { logout } = useLogout(); 

  useEffect(() => { 
    const fetchTasks = async () => {
      if (!user) return; 
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
  }, [user, customFetch, dispatch, selectedStatus, selectedPriority, selectedDueDate, searchTerm]); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setSelectedDueDate(e.target.value);
  };

  // Adjusted to format UTC date to Pacific Time for display
  const convertUTCToLocalDate = (utcDate) => {
    return moment.utc(utcDate).tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm');
  };

  const filterTasks = (taskList) => {
    return (taskList || []).filter(task => {
      const statusMatch = selectedStatus === 'All' || task.status === selectedStatus;
      const priorityMatch = selectedPriority === 'All' || task.priority.toLowerCase() === selectedPriority.toLowerCase();
      const dueDateMatch = !selectedDueDate || moment.utc(task.date).tz('America/Los_Angeles').format('YYYY-MM-DD') === selectedDueDate;
      const searchMatch = !searchTerm || task.title.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && priorityMatch && dueDateMatch && searchMatch;
    });
  };

  const resetFilters = () => {
    setSelectedPriority("All");
    setSelectedStatus("All");
    setSelectedDueDate(""); 
    setSearchTerm(""); 
  };

  return (
    <div className="home">
      <div className="home-container">
        <div className="page-title">
          <h2>Home</h2>
        </div>

        <div className="filters-bar">
          {/* Filter bar elements */}
          <div className="filter-wrapper">
            {/* Status filter */}
            <label htmlFor="status">Status:</label>
            <select id="status" className="filter-select" value={selectedStatus} onChange={handleStatusChange}>
              <option value="All">All</option>
              <option value="In Progress">In Progress</option>
              <option value="Past Due">Past Due</option>
            </select>
          </div>

          <div className="filter-wrapper">
            {/* Priority filter */}
            <label htmlFor="priority">Priority:</label>
            <select id="priority" className="filter-select" value={selectedPriority} onChange={handlePriorityChange}>
              <option value="All">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-wrapper">
            {/* Due date filter */}
            <label htmlFor="due-date">Due Date:</label>
            <input type="date" id="due-date" className="filter-input" value={selectedDueDate} onChange={handleDueDateChange} />
          </div>

          <div className="filter-wrapper search-wrapper">
            {/* Search filter */}
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              className="filter-input"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="clear-button">
          <button onClick={resetFilters}>Reset Filters</button>
        </div>
        </div>
      </div>

      {/* Task listings */}
      {(selectedStatus === 'All' || selectedStatus === 'In Progress') && (
        <>
          <h3 className="tasks-heading">In Progress</h3>
          <div className="tasks">
            {filterTasks(tasks)
              .filter(task => task.status === 'In Progress')
              .map(task => (
                <TaskDetails 
                  task={{...task, date: convertUTCToLocalDate(task.date).toLocaleString()}}
                  key={task._id} 
                />
              ))}
          </div>
        </>
      )}

      {(selectedStatus === 'All' || selectedStatus === 'Past Due') && (
        <>
          <h3 className="tasks-heading">Past Due</h3>
          <div className="tasks">
            {filterTasks(tasks)
              .filter(task => task.status === 'Past Due')
              .map(task => (
                <TaskDetails 
                  task={{...task, date: convertUTCToLocalDate(task.date).toLocaleString()}}
                  key={task._id} 
                />
              ))}
          </div>
        </>
      )}

      <div><br /><br /></div>
    </div>
  );
};

export default Home;
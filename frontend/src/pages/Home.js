import { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import './../css/Home.css'; // Import your CSS file
import TaskDetails from "../components/TaskDetails";

const Home = () => {
  const { tasks, dispatch } = useTasksContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDueDate, setSelectedDueDate] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks');
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_TASKS', payload: json });
      }
    };

    fetchTasks();
  }, [dispatch]);

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

  const toUTCStartOfDay = (localDate) => {
    const date = new Date(localDate);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const convertUTCToLocalDate = (utcDate) => {
    const date = new Date(utcDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  const filterTasks = (taskList) => {
    return (taskList || []).filter(task => {
      const statusMatch = selectedStatus === 'all' || task.status === selectedStatus;
      const priorityMatch = selectedPriority === 'all' || task.priority.toLowerCase() === selectedPriority;
      const dueDateMatch = !selectedDueDate || 
                           toUTCStartOfDay(task.date).split('T')[0] === toUTCStartOfDay(selectedDueDate).split('T')[0];
      const searchMatch = !searchTerm || task.title.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && priorityMatch && dueDateMatch && searchMatch;
    });
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
            <select id="status" className="filter-select" onChange={handleStatusChange}>
              <option value="all">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Past Due">Past Due</option>
            </select>
          </div>

          <div className="filter-wrapper">
            {/* Priority filter */}
            <label htmlFor="priority">Priority:</label>
            <select id="priority" className="filter-select" onChange={handlePriorityChange}>
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-wrapper">
            {/* Due date filter */}
            <label htmlFor="due-date">Due Date:</label>
            <input type="date" id="due-date" className="filter-input" onChange={handleDueDateChange} />
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
        </div>
      </div>

      {/* Task listings */}
      {(selectedStatus === 'all' || selectedStatus === 'In Progress') && (
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

      {(selectedStatus === 'all' || selectedStatus === 'Past Due') && (
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
    </div>
  );
};

export default Home;

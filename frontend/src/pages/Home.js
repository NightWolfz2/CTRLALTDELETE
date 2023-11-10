import { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import './../css/Home.css'; // Import your CSS file

// components
import TaskDetails from "../components/TaskDetails";

const Home = () => {
  const { tasks, dispatch } = useTasksContext();
  const [searchTerm, setSearchTerm] = useState('');

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
    // Future implementation to dispatch search action or filter tasks
  };

  // Ensure tasks is not null before filtering
  const inProgressTasks = tasks && tasks.filter(task => task.status === 'In Progress');
  const pastDueTasks = tasks && tasks.filter(task => task.status === 'Past Due');

  return (
    <div className="home">
      <div className="home-container">
        <div className="page-title">
          <h2>Home</h2>
        </div>

        <div className="filters-bar">
          <div className="filter-wrapper">
            <label htmlFor="status">Status:</label>
            <select id="status" className="filter-select">
              <option value="all">All Statuses</option>
              <option value="inProgress">In Progress</option>
              <option value="pastDue">Past Due</option>
            </select>
          </div>

          <div className="filter-wrapper">
            <label htmlFor="priority">Priority:</label>
            <select id="priority" className="filter-select">
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-wrapper">
            <label htmlFor="due-date">Due Date:</label>
            <input type="date" id="due-date" className="filter-input" />
          </div>

          <div className="filter-wrapper search-wrapper">
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

      <h3 className="tasks-heading">In Progress</h3>
      <div className="tasks">
        {inProgressTasks && inProgressTasks.map(task => (
          <TaskDetails task={task} key={task._id} />
        ))}
      </div>

      <h3 className="tasks-heading">Past Due</h3>
      <div className="tasks">
        {pastDueTasks && pastDueTasks.map(task => (
          <TaskDetails task={task} key={task._id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
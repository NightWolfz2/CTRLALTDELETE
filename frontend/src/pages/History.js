import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import './../css/History.css'; // Import CSS file

<<<<<<< Updated upstream
const History = () => { 
=======
import TaskDetails from "../components/TaskDetails"

import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Overview = () => {
  const {user} = useAuthContext();
  const [priorityLevel, setPriorityLevel] = useState("All");
  const [status, setStatus] = useState("All");
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
  
  const currentDate = new Date(); 

  // Filter tasks for In Progress and Past Due
  
  const inProgressTasks = tasks ? tasks.filter(task => new Date(task.date) > currentDate) : [];
  const pastDueTasks = tasks ? tasks.filter(task => new Date(task.date) <= currentDate) : [];
  
  const complete = tasks ? tasks.filter(task => new Date(task.date) <= currentDate) : [];
  
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
  
  const clearFilters = () => {
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
    case 0:
      return 'Low';
    case 1:
      return 'Medium';
    case 2:
      return 'High';
    default:
      return 'Unknown';
  }
};

>>>>>>> Stashed changes
  return (
    <div className="history">
      <div className="page-title">
        <h2>History</h2>
      </div>
    </div>
  )
}

export default History
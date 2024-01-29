import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import './../css/Home.css'; // Import your CSS file
<<<<<<< Updated upstream

// components
import TaskDetails from "../components/TaskDetails"

const Home = () => {
  const {tasks, dispatch} = useTasksContext()

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks')
      const json = await response.json()
=======
import TaskDetails from "../components/TaskDetails";
import {useAuthContext} from '../hooks/useAuthContext'

const Home = () => {
  const { tasks, dispatch } = useTasksContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDueDate, setSelectedDueDate] = useState('');
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization':`Bearer ${user.token}`
        }
      });
      const json = await response.json();
>>>>>>> Stashed changes

      if (response.ok) {
        dispatch({type: 'SET_TASKS', payload: json})
      }
<<<<<<< Updated upstream
    }

    fetchTasks()
  }, [dispatch])
=======
    };
    if(user) {
      fetchTasks();
    }
    
  }, [dispatch, user]);

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
>>>>>>> Stashed changes

  return (
    <div className="home">
      <div className="page-title">
        <h2>Home</h2>
      </div>
      <h3>In Progress</h3>
      <div className="tasks">
        {tasks && tasks.map(task => (
          <TaskDetails task={task} key={task._id} />
        ))}
      </div>
      <h3>Past Due</h3>
      <div className="tasks">
        {tasks && tasks.map(task => (
          <TaskDetails task={task} key={task._id} />
        ))}
      </div>
    </div>
  )
}

export default Home
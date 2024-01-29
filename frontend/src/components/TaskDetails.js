import './../css/TaskDetails.css'; // Import your CSS file
<<<<<<< Updated upstream

const TaskDetails = ({ task }) => {
var taskDate = new Date(task.date);
var day = String(taskDate.getDate()).padStart(2, '0'); // Get the day with leading zeros
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var month = monthNames[taskDate.getMonth()]; // Get the month name
var year = taskDate.getFullYear(); // Get the full year
=======
import { useTasksContext } from '../hooks/useTasksContext'
import { useAuthContext } from '../hooks/useAuthContext';

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext();
  const {user} = useAuthContext();
  const deleteClick = async() => { // delete handle click
    if(!user) {
      return
    }
    const response = await fetch('/api/tasks/' + task._id, {
      method: 'DELETE',
      headers: {
        'Authorization':`Bearer ${user.token}`
      }
    })
    const json = await response.json()
    if(response.ok) {
      dispatch({type: 'DELETE_TASK', payload: json})
    }
  };
>>>>>>> Stashed changes

var formattedDate = `${day} ${month} ${year}`;

  
  return (
    

    <div className="task-details">
      <h4>{task.title}</h4>
      <p><strong>Date: </strong>{formattedDate}</p>
      <p><strong>Description: </strong>{task.description}</p>
      <p><strong>Priority: </strong>{task.priority}</p>
      <p>{task.createdAt}</p>
    </div>
  )
}
  
export default TaskDetails
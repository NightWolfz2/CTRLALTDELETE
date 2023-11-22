import './../css/TaskDetails.css'; // Import your CSS file
import { useTasksContext } from '../hooks/useTasksContext'

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext();
  const deleteClick = async() => { // delete handle click
    const response = await fetch('/api/tasks/' + task._id, {
      method: 'DELETE'
    })
    const json = await response.json()
    if(response.ok) {
      dispatch({type: 'DELETE_TASK', payload: json})
    }
  };
  var taskDate = new Date(task.date);
  var day = String(taskDate.getDate()).padStart(2, '0');
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var month = monthNames[taskDate.getMonth()];
  var year = taskDate.getFullYear();
  var formattedDate = `${day} ${month} ${year}`;
  

  const statusClassName = `status-${task.status.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div className="task-details">
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className={`task-status ${statusClassName}`}>{task.status}</span>
      </div>
      <div className="task-info">
        <p><strong>Due Date: </strong>{formattedDate}</p>

        {/* Separate the label and content for description */}
        <p className="description"><strong>Description:</strong></p>
        <p>{task.description}</p>
        <p className="priority"><strong>Priority: </strong>{task.priority}</p>
        <p><strong>Assigned: </strong></p>
        <button type="button" className="delete-button" onClick={deleteClick}><span>delete</span></button>
      </div>
      
    </div>
  );
}
export default TaskDetails;
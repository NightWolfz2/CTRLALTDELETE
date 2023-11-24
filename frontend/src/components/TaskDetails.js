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

  // Extract and format the time components in 12-hour format with AM/PM
  var hours = taskDate.getHours();
  var minutes = taskDate.getMinutes().toString().padStart(2, '0');
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours.toString().padStart(2, '0');

  var day = String(taskDate.getDate()).padStart(2, '0');
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
  var month = monthNames[taskDate.getMonth()];
  var year = taskDate.getFullYear();
  var formattedDate = `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;

  const statusClassName = `status-${task.status.replace(/\s+/g, '-').toLowerCase()}`;
  

  return (
    <div className="task-details">
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className={`task-status ${statusClassName}`}>{task.status}</span>
      </div>
      <div className="task-info">
        <p><strong>Due Date: </strong>{formattedDate}</p>
        <div className="description">
          <strong>Description:</strong>
          <p className="task-desc-text">{task.description}</p> {/* This is the updated part */}
        </div>
        <p className="priority"><strong>Priority: </strong>{task.priority}</p>
        <p><strong>Assigned: </strong></p>
        <button type="button" className="delete-button" onClick={deleteClick}><span>delete</span></button>
      </div>
    </div>
  );
}

export default TaskDetails;
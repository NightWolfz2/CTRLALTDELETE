import React from 'react';
import './../css/TaskDetails.css'; // Import your CSS file
import { useTasksContext } from '../hooks/useTasksContext';
import { useCustomFetch } from '../hooks/useCustomFetch'; // Ensure this is correctly imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useLogout } from '../hooks/useLogout'; // Assuming you have a useLogout hook

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext();
  const customFetch = useCustomFetch();
  const navigate = useNavigate(); // For handling redirection
  const { logout } = useLogout();  // For handling logout

  const deleteClick = async () => {
    try {
      // Attempt to delete the task using customFetch
      await customFetch('/api/tasks/' + task._id, 'DELETE');
      // If deletion is successful, update the state to reflect this change
      dispatch({ type: 'DELETE_TASK', payload: { _id: task._id } });
    } catch (error) {
      console.error("Error during task deletion:", error);
      // If an error occurs, specifically check for unauthorized access
      if (error.message === 'Unauthorized') {
        // Here, call your logout function to clear any auth-related state or storage
        logout();
        // After logout, redirect to login page
        navigate('/login');
      }
      // Optionally, handle other types of errors as needed
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
        <button type="button" className="material-symbols-outlined" onClick={deleteClick}><span>delete</span></button>
      </div>
    </div>
  );
}

export default TaskDetails;
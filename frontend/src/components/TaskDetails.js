import React from 'react';
import './../css/TaskDetails.css'; // Import your CSS file
import { useTasksContext } from '../hooks/useTasksContext';
import { useCustomFetch } from '../hooks/useCustomFetch'; // Ensure this is correctly imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useLogout } from '../hooks/useLogout'; // Assuming you have a useLogout hook
import PropTypes from 'prop-types';

const TaskDetails2 = ({ task, onClose, context }) => {
  const { dispatch } = useTasksContext();
  const customFetch = useCustomFetch();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const deleteClick = async () => {
    try {
      await customFetch('/api/tasks/' + task._id, 'DELETE');
      dispatch({ type: 'DELETE_TASK', payload: { _id: task._id } });
      onClose(); // Close the task details after deletion
    } catch (error) {
      console.error("Error during task deletion:", error);
      if (error.message === 'Unauthorized') {
        logout();
        navigate('/login');
      }
    }
  };

  const closeClick = () => {
    onClose(); // Call the onClose function passed from the parent component
  };

  var taskDate = new Date(task.date);
  var hours = taskDate.getHours();
  var minutes = taskDate.getMinutes().toString().padStart(2, '0');
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours.toString().padStart(2, '0');

  var day = String(taskDate.getDate()).padStart(2, '0');
  var monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
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
        <p>
          <strong>Due Date: </strong>
          {formattedDate}
        </p>
        <div className="description">
          <strong>Description:</strong>
          <p className="task-desc-text">{task.description}</p>
        </div>
        <p className="priority">
          <strong>Priority: </strong>
          {task.priority}
        </p>
        <p>
          <strong>Assigned: </strong>
        </p>
        <div className="task-actions">
          <button type="button" className="delete-task-btn" onClick={deleteClick}>
            Delete
          </button>

        </div>
      </div>
    </div>
  );
};

TaskDetails2.propTypes = {
  task: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  context: PropTypes.string,
};

export default TaskDetails2;

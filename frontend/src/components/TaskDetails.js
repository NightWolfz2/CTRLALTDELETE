import React, { useState, useEffect } from 'react';
import './../css/TaskDetails.css'; // Import your CSS file
import { useTasksContext } from '../hooks/useTasksContext';
import { useCustomFetch } from '../hooks/useCustomFetch'; // Ensure this is correctly imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useLogout } from '../hooks/useLogout'; // Assuming you have a useLogout hook
import PropTypes from 'prop-types';
import { useAuthContext } from '../hooks/useAuthContext';

const TaskDetails2 = ({ task, onClose, context }) => {
  const { dispatch } = useTasksContext();
  const customFetch = useCustomFetch();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  useEffect(() => {
  
    const fetchAssignedEmployees = async () => {
      if (task.employees?.length) {
        const employeeNames = await Promise.all(task.employees.map(async (id) => {
          try {
            const response = await fetch(`http://localhost:4000/api/user/${id}`, {
              headers: {
                'Authorization': `Bearer ${user.token}`
              }
            });
            if (!response.ok) {
              // Handle non-2xx responses as "Deleted User"
              throw new Error('User not found or deleted');
            }
            const data = await response.json();
            return `${data.fname} ${data.lname}`;
          } catch (error) {
            console.error(error);
            return 'Deleted User'; // Placeholder for any IDs that don't fetch properly
          }
        }));
        setAssignedEmployees(employeeNames);
      }
    };
  
    fetchAssignedEmployees();
  }, [task.employees, user.token]);
  

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

  const markTaskAsDel = async () => {
    try {
      // Fetch the data asynchronously
      
      const response = await customFetch(`/api/tasks/mark-task-deleted/${task._id}`, 'PATCH');
      const json = await response.json();
  
      // Dispatch the action with the updated task data
      dispatch({ type: 'UPDATE_TASK', payload: json });
  
    } catch (error) {
      console.error('Error:', error);
      // Handle errors here
    }
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
      <h4 title={task.title}>{task.title}</h4>
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
        <p className="priority"><strong>Priority: </strong>{task.priority}</p>
        <p><strong>Assigned To: </strong>{assignedEmployees.join(', ') || 'No one assigned'}</p>
        <button type="button" className="material-symbols-outlined" onClick={markTaskAsDel}><span>delete</span></button>
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

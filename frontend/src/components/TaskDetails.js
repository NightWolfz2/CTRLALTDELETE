import './../css/TaskDetails.css'; // Import your CSS file

const TaskDetails = ({ task }) => {
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
      </div>
    </div>
  );
}
export default TaskDetails;
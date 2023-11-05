import './../css/TaskDetails.css'; // Import your CSS file

const TaskDetails = ({ task }) => {
var taskDate = new Date(task.date);
var day = String(taskDate.getDate()).padStart(2, '0'); // Get the day with leading zeros
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var month = monthNames[taskDate.getMonth()]; // Get the month name
var year = taskDate.getFullYear(); // Get the full year

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
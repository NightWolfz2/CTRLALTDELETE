import './../css/TaskDetails.css'; // Import your CSS file

const TaskDetails = ({ task }) => {

  return (
    <div className="task-details">
      <h4>{task.title}</h4>
      <p><strong>Date: </strong>{task.date}</p>
      <p><strong>Description: </strong>{task.description}</p>
      <p><strong>Priority: </strong>{task.priority}</p>
      <p>{task.createdAt}</p>
    </div>
  )
}
  
export default TaskDetails
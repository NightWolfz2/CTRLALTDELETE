const TaskBox = ({ status, taskNum, dueDate, description, priority, assigned }) => {
    // Convert the status to a format suitable for CSS class
    const statusClass = status.toLowerCase().replace(' ', '-');
    
    return (
        <div className="task-box">
            <h3>Task {taskNum}: 
                <span className={`status ${statusClass}`}>
                    {status}
                </span>
            </h3>
            <p>Due Date: {dueDate}</p>
            <p>Description: {description}</p>
            <p>Priority: {priority}</p>
            <p>Assigned: {assigned}</p>
        </div>
    );
};

export default TaskBox;

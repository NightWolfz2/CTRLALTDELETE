import React, { useState, useEffect } from 'react';
import { useTasksContext } from '../hooks/useTasksContext'
import './../css/TaskForm.css'; // Import your CSS file
import { useParams } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';


const EditHistory = () => {

    const { dispatch, tasks } = useTasksContext();
    const { _id } = useParams(); // Get the task ID from the URL parameters
    const {user} = useAuthContext();
    
    //console.log("Received taskId:", taskId);

    // State variables for the form fields
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [employees, setEmployees] = useState([{}]); // List of all added employees
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([])

    useEffect(() => {
      if(!user) {
        return
      }
        // Find the task with the matching ID from the URL
        const taskToEdit = tasks.find((task) => task._id === _id);
    
        if (taskToEdit && user) {
          // Populate the form fields with the task details
          setTitle(taskToEdit.title);
          const formattedDate = taskToEdit.date.split('T')[0];
          setDate(formattedDate);
          setDescription(taskToEdit.description);
          setPriority(taskToEdit.priority);
        }
      }, [_id, tasks, user]);

    // Handler for the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const task = { title, date, description, priority };
    
        // Send a PUT request to update the task
        const response = await fetch(`/api/tasks/${_id}`, {
          method: 'PATCH',
          body: JSON.stringify(task),
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${user.token}`
          },
        });
    
        const json = await response.json();
    
        if (!response.ok) {
          setError(json.error);
          setEmptyFields(json.emptyFields)
        }
        else {
          setEmptyFields([])
          setError(null);
          setTitle('');
          setDate('');
          setDescription('');
          setPriority('');
    
          dispatch({ type: 'UPDATE_TASK', payload: json });
          
        }
      };

      const handleTitleChange = (e) => {
        setTitle(e.target.value);
      };

      const handleDateChange = (e) => {
        setDate(e.target.value);
      }

      const handlePriorityChange = (e) => {
        setPriority(e.target.value);
      }

      const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
      }

    return (
      <div>
            {/* Start of the form */}
            <form className="create" onSubmit={handleSubmit}>
                <h3>Edit Task</h3>

                {/* Input field for Task Title */}
                <label>Task Title:</label>
                <input
                    type="text"
                    onChange={handleTitleChange}
                    value={title}
                    className={emptyFields.includes('title') ? 'error' : ''}
                />

                {/* Input field for Due Date */}
                <label>Due Date:</label>
                <input 
                    type="date"
                    onChange={handleDateChange} 
                    value={date}
                    className={emptyFields.includes('date') ? 'error' : ''}
                />

                {/* Dropdown for Priority selection */}
                <label>Priority:</label>
                <select
                    onChange={handlePriorityChange}
                    value={priority}
                >
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                {/* Dropdowns for Employee assignment */}
                {employees.map((employee, index) => (
                    <div key={index}>
                        <label>Assigned Employee #{index + 1}:</label>
                        <select
                            value={employee.name}
                            onChange={(e) => {
                                const newEmployees = [...employees];
                                newEmployees[index] = { name: e.target.value };
                                setEmployees(newEmployees);
                            }}
                        >
                            <option value="">Select Employee</option>
                            {/* Populate this dropdown from backend data in the future */}
                        </select>
                    </div>
                ))}

                {/* Buttons to add and remove employee dropdowns */}
                <button type="button" className="add-employee-btn" onClick={() => setEmployees([...employees, {}])}>
                    <span className="symbol">&#43;</span> Add Employee
                </button>
                {employees.length > 1 && (
                    <button type="button" className="remove-employee-btn" onClick={() => setEmployees(employees.slice(0, -1))}>
                        <span className="symbol">&#8722;</span> Remove Employee
                    </button>
                )}

                {/* Input field for Task Description */}
                <label>Description:</label>
                <textarea
                    rows="10"
                    onChange={handleDescriptionChange}
                    value={description}
                ></textarea>

                {/* Submit button */}
                <button type="submit">Submit</button>
                {error && <div className="error">{error}</div>}
            </form>
            {/* End of the form */}
            </div>
    );
};
export default EditHistory;
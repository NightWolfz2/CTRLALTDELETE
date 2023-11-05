import React, { useState } from 'react';
import { useTasksContext } from '../hooks/useTasksContext'
import './../css/TaskForm.css'; // Import your CSS file

const TaskForm = () => {
    // State variables for the form fields
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [employees, setEmployees] = useState([{}]); // List of all added employees

    // Handler for the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct the task object
        const task = { title, date, description, priority, employees };
    };

    return (
      <div>
            {/* Start of the form */}
            <form className="create" onSubmit={handleSubmit}>
                <h3>Create Task</h3>

                {/* Input field for Task Title */}
                <label>Task Title:</label>
                <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />

                {/* Input field for Due Date */}
                <label>Due Date:</label>
                <input 
                    type="date"
                    onChange={(e) => setDate(e.target.value)} 
                    value={date}
                />

                {/* Dropdown for Priority selection */}
                <label>Priority:</label>
                <select
                    onChange={(e) => setPriority(e.target.value)}
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
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                ></textarea>

                {/* Submit button */}
                <button type="submit">Submit</button>
            </form>
            {/* End of the form */}
            </div>
    );
};
export default TaskForm;
import React, { useState } from 'react';
import { useTasksContext } from '../hooks/useTasksContext';
import './../css/TaskForm.css'; // Import your CSS file
import { useCustomFetch } from '../hooks/useCustomFetch'; 
import { useNavigate } from 'react-router-dom'; 
import { useLogout } from '../hooks/useLogout'; 

const TaskForm = () => {
    const { dispatch } = useTasksContext();
    const customFetch = useCustomFetch(); 
    const navigate = useNavigate(); 
    const { logout } = useLogout(); 
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [employees, setEmployees] = useState([{}]);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    // Autofill function
    const autofill = () => {
      setTitle('TASK TITLE');
      setDate('2024-02-01T12:00'); // Example date and time
      setPriority('high');
      setDescription('AUTOFILLED TASK DESCRIPTION');
      setEmployees([{}]);
    };

    // Convert the local date and time to a UTC string
    const convertToUTC = (localDateTime) => {
        const localDate = new Date(localDateTime);
        localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
        return localDate.toISOString();
    };

    // Handler for the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert the date to UTC before sending
        const utcDate = convertToUTC(date);

        // Construct the task object with the UTC date
        const task = {
            title,
            date: utcDate,
            description,
            priority,
            employees
        };

        try {
            const json = await customFetch('/api/tasks', 'POST', task);
            dispatch({ type: 'CREATE_TASK', payload: json }); // Ensure the correct action type
            // Reset form fields and state
            setTitle('');
            setDate('');
            setDescription('');
            setEmployees([{}]);
            setError(null);
            setEmptyFields([]);
        } catch (error) {
            console.error("Error creating task:", error);
            if (error.message === 'Unauthorized') {
                logout();
                navigate('/login');
            } else {
                setError(error.message);
                setEmptyFields(error.emptyFields || []);
            }
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    return (
        <div>
            <form className="create" onSubmit={handleSubmit}>
                <h3>Create Task</h3>

                <label>Task Title:</label>
                <input
                    type="text"
                    onChange={handleTitleChange}
                    value={title}
                    className={emptyFields.includes('title') ? 'error' : ''}
                />

                <label>Due Date:</label>
                <input 
                    type="datetime-local"
                    onChange={handleDateChange} 
                    value={date}
                    className={emptyFields.includes('date') ? 'error' : ''}
                />

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

                <button type="button" className="add-employee-btn" onClick={() => setEmployees([...employees, {}])}>
                    <span className="symbol">&#43;</span> Add Employee
                </button>
                {employees.length > 1 && (
                    <button type="button" className="remove-employee-btn" onClick={() => setEmployees(employees.slice(0, -1))}>
                        <span className="symbol">&#8722;</span> Remove Employee
                    </button>
                )}

                <label>Description:</label>
                <textarea
                    rows="10"
                    onChange={handleDescriptionChange}
                    value={description}
                ></textarea>

                <button type="submit">Submit</button>
                {error && <div className="error">{error}</div>}
                {/*Autofill button*/}   
                <button type="button" onClick={autofill}>
                  Autofill Form
                </button>
                {/*End Autofill button*/}  
            </form>
        </div>
    );
};

export default TaskForm;
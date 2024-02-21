import React, { useState, useEffect } from 'react';
import { useTasksContext } from '../hooks/useTasksContext';
import './../css/TaskForm.css';
import { useAuthContext } from '../hooks/useAuthContext';

const TaskForm = () => {
    const { dispatch } = useTasksContext();
    const { user } = useAuthContext();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [employees, setEmployees] = useState([]); // To store fetched employee data
    const [currentEmployee, setCurrentEmployee] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]);    
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            if (!user) return;
            
            try {
                // Update the fetch URL to include the correct port
                const response = await fetch('http://localhost:4000/api/user/employees', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Assuming you have user tokens for authorization
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                
                const employees = await response.json();
                // Do something with the fetched employees data, like setting state
                setEmployees(employees);
            } catch (error) {
                console.error(error);
                setError(error.message || 'Failed to fetch employees');
            }
        };
    
        fetchEmployees();
    }, [user]); // Dependency array, if you're using the 'user' state to store user information
    

    const autofill = () => {
        setTitle('TASK TITLE');
        setDate('2024-02-01T12:00');
        setPriority('high');
        setDescription('AUTOFILLED TASK DESCRIPTION');
    };

    const convertToUTC = (localDateTime) => {
        const localDate = new Date(localDateTime);
        localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
        return localDate.toISOString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in');
            return;
        }
        const task = {
            title,
            date: convertToUTC(date),
            description,
            priority,
            assignedTo: selectedEmployees,
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(task),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
                setEmptyFields(json.emptyFields || []);
            } else {
                dispatch({ type: 'CREATE_TASK', payload: json });
                setTitle('');
                setDate('');
                setDescription('');
                setPriority('');
                setSelectedEmployees([]); // Clear selected employees after submission
                setCurrentEmployee(''); // Reset current employee selection
                setError(null);
                setEmptyFields([]);
            }
        } catch (error) {
            console.error("Failed to submit task:", error);
            setError('Failed to submit task');
        }
    };

    // Handlers for form inputs
    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleDateChange = (e) => setDate(e.target.value);
    const handlePriorityChange = (e) => setPriority(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const handleAddEmployee = () => {
        // Prevent adding if no employee is selected or if the employee is already added
        if (currentEmployee && !selectedEmployees.includes(currentEmployee)) {
            setSelectedEmployees(prevSelectedEmployees => [...prevSelectedEmployees, currentEmployee]);
            // Optionally reset currentEmployee to '' if you want to clear the selection after adding
            setCurrentEmployee('');
        }
    };
    
    return (
        <div>
            <form className="create" onSubmit={handleSubmit}>
                <h3>Create Task</h3>
                <label>Task Title:</label>
                <input type="text" onChange={handleTitleChange} value={title} className={emptyFields.includes('title') ? 'error' : ''} />

                <label>Due Date:</label>
                <input type="datetime-local" onChange={handleDateChange} value={date} className={emptyFields.includes('date') ? 'error' : ''} />

                <label>Priority:</label>
                <select onChange={handlePriorityChange} value={priority}>
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                <label>Assign Employee:</label>
                <select value={currentEmployee} onChange={(e) => setCurrentEmployee(e.target.value)}>
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                        <option key={employee._id} value={employee._id}>{employee.fname} {employee.lname}</option>
                    ))}
                </select>

                <button type="button" onClick={handleAddEmployee}>Add Employee</button>

                <label>Description:</label>
                <textarea rows="10" onChange={handleDescriptionChange} value={description}></textarea>

                <button type="submit">Submit</button>
                {error && <div className="error">{error}</div>}
                <button type="button" onClick={autofill}>Autofill Form</button>
            </form>
        </div>
    );
};

export default TaskForm;

import React, { useState, useEffect } from 'react';
import { useTasksContext } from '../hooks/useTasksContext';
import { useCustomFetch } from '../hooks/useCustomFetch'; // Make sure to import useCustomFetch
import { useNavigate, useParams } from 'react-router-dom';
import './../css/TaskForm.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout'; // Import useLogout for handling token expiration
import moment from 'moment-timezone';


const EditHistory = () => {
    const navigate = useNavigate();
    const { dispatch, tasks } = useTasksContext();
    const { _id } = useParams();
    const { user } = useAuthContext(); // Ensure user is destructured here
    const customFetch = useCustomFetch(); // Use the customFetch hook
    const { logout } = useLogout(); // Destructure logout function from useLogout

    // State variables for the form fields
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [employees, setEmployees] = useState([]);
    const [currentEmployee, setCurrentEmployee] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]); // List of all added employees
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const convertToUTC = (localDateTime) => {
        return moment(localDateTime).tz('America/Los_Angeles').utc().format();
    };

    useEffect(() => {
        const taskToEdit = tasks.find((task) => task._id === _id);
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            const formattedDate = taskToEdit.date.split('T')[0];
            setDate(formattedDate);
            setDescription(taskToEdit.description);
            setPriority(taskToEdit.priority);
            setEmployees(taskToEdit.employees);
        }
    }, [_id, tasks]);
    
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
    
    useEffect(() => {
        console.log("Selected Employees updated:", selectedEmployees);
    }, [selectedEmployees]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const utcDate = convertToUTC(date + "T00:00:00"); // Append time part for conversion
        const task = { title, date: utcDate, description, priority, employees: selectedEmployees };

        try {
            const json = await customFetch(`/api/tasks/${_id}`, 'PATCH', task, user.token);
            dispatch({ type: 'UPDATE_TASK', payload: json });
            navigate("/overview");
        } catch (error) {
            console.error("Error updating task:", error);
            if (error.message.includes('Unauthorized')) {
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
      }

      const handlePriorityChange = (e) => {
        setPriority(e.target.value);
      }

      const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
      }
      const handleAddEmployee = () => {
        console.log("Current Employee before adding:", currentEmployee);
      
        // Check if the currentEmployee is already in the selectedEmployees array
        if (currentEmployee && !selectedEmployees.includes(currentEmployee)) {
          // Update the state in a functional way to ensure the latest state is used
          setSelectedEmployees(prevSelectedEmployees => {
            // Create a new array for the updated state to avoid direct mutations
            const updatedSelectedEmployees = [...prevSelectedEmployees, currentEmployee];
            console.log("Selected Employees after adding:", updatedSelectedEmployees);
            return updatedSelectedEmployees;
          });
          // Clear the current selection after adding the employee to the list
          setCurrentEmployee('');
        } else {
          console.log("Employee already added or no employee selected.");
        }
      };
      
    
    // Handler for currentEmployee state change
    const handleCurrentEmployeeChange = (e) => {
        setCurrentEmployee(e.target.value);
    };
    
    // Handler to remove selected employee from the task
    const handleRemoveEmployee = (employeeId) => {
        setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    };

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
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <label>Assign Employee:</label>
                <select 
                    value={currentEmployee} 
                    onChange={handleCurrentEmployeeChange}
                >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                        <option key={employee._id} value={employee._id}>
                            {employee.fname} {employee.lname}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={handleAddEmployee}>Add Employee</button>
    
                {/* List of selected employees with a remove button */}
                {selectedEmployees.map(employeeId => {
                    const employee = employees.find(e => e._id === employeeId);
                    return (
                        <div key={employeeId} className="selectedEmployee">
                            <span>{employee ? `${employee.fname} ${employee.lname}` : 'Loading...'}</span>
                            <button type="button" onClick={() => handleRemoveEmployee(employeeId)}>
                                Remove
                            </button>
                        </div>
                    );
                })}

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
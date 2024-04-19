import React, { useState, useEffect } from 'react';
import { useTasksContext } from '../../hooks/useTasksContext';
import { useCustomFetch } from '../../hooks/useCustomFetch'; // Make sure to import useCustomFetch
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/TaskForm.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout'; // Import useLogout for handling token expiration
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
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const taskToEdit = tasks.find((task) => task._id === _id);
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            const formattedDate = moment(taskToEdit.date).format('YYYY-MM-DDTHH:mm');
            setDate(formattedDate);
            setDescription(taskToEdit.description);
            setPriority(taskToEdit.priority);
            setSelectedEmployees(taskToEdit.employees);
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
    }, [selectedEmployees]);

    // Convert the local date and time to a UTC string
    const convertToUTC = (localDateTime) => {
        // Directly return the localDateTime if it's empty, letting the backend handle the missing date validation
        if (!localDateTime) {
            return localDateTime;
        }
    
        // Convert the local date and time to a UTC string for non-empty dates
        return moment(localDateTime, 'YYYY-MM-DDTHH:mm').tz('America/Los_Angeles').utc().format();
     };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear any existing errors
        setError(null);
    
        const utcDate = convertToUTC(date);

        const task = { 
            title, 
            date: utcDate, 
            description, 
            priority, 
            employees: selectedEmployees, 
        };
    
        try {
            const json = await customFetch(`/api/tasks/${_id}`, 'PATCH', task, user.token);
            dispatch({ type: 'UPDATE_TASK', payload: json });
    
            setSuccessMessage("Task Edited");
    
            setTimeout(() => {
                setSuccessMessage('');
                navigate('/overview');
            }, 1000);

            // Reset form fields and state after successful task edit
            setTitle('');
            setDate('');
            setDescription('');
            setPriority('');
            setSelectedEmployees([]);
            setError(null); // Clear any existing errors
            
        } catch (error) {
            console.error("Error updating task:", error);
            if (error.message.includes('Unauthorized')) {
                logout();
                navigate('/login');
            } else {
                // Directly use the error message returned from the customFetch
                setError(error.message);
                setSuccessMessage('');
            }
        }
    };    

      const handleTitleChange = (e) => {
        setTitle(e.target.value);
      };

      const handleDateChange = (e) => {
        console.log("New Date:", e.target.value); // Debugging line
        setDate(e.target.value);
      }

      const handlePriorityChange = (e) => {
        setPriority(e.target.value);
      }

      const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
      }
      const handleAddEmployee = () => {
      
        // Check if the currentEmployee is already in the selectedEmployees array
        if (currentEmployee && !selectedEmployees.includes(currentEmployee)) {
          // Update the state in a functional way to ensure the latest state is used
          setSelectedEmployees(prevSelectedEmployees => {
            // Create a new array for the updated state to avoid direct mutations
            const updatedSelectedEmployees = [...prevSelectedEmployees, currentEmployee];
            return updatedSelectedEmployees;
          });
          // Clear the current selection after adding the employee to the list
          setCurrentEmployee('');
          setNotification({ message: '', type: '' });
        } else {
          console.log("Employee already added or no employee selected.");
          setNotification({ message: 'Employee already assigned', type: 'error' });
          setTimeout(() => setNotification({ message: '', type: '' }), 2500); 

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
                    //className={emptyFields.includes('title') ? 'error' : ''}
                />

                {/* Input field for Due Date */}
                <label>Due Date:</label>
                <input 
                    type="datetime-local"
                    onChange={handleDateChange} 
                    value={date}
                    //className={emptyFields.includes('date') ? 'error' : ''}
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
                            <span>{employee ? `${employee.fname} ${employee.lname}` : 'Deleted User'}</span>
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
                {successMessage && <div className="success-message">{successMessage}</div>}
                {
                notification.message && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )
                }
                {error && <div className="task-form-error">{error}</div>}
            </form>
            {/* End of the form */}
            </div>
    );
};
export default EditHistory; 
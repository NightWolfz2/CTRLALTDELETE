import React, { useState, useEffect } from 'react';
import { useTasksContext } from '../hooks/useTasksContext';
import './../css/TaskForm.css';
import { useCustomFetch } from '../hooks/useCustomFetch';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import moment from 'moment-timezone'; // Ensure moment-timezone is correctly imported

const TaskForm = () => {
  const { dispatch } = useTasksContext();
  const customFetch = useCustomFetch();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();// Ensure user is destructured here

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  console.log("Creating task with assigned employees:", selectedEmployees);
  useEffect(() => {
    const fetchEmployees = async () => {
    if (!user) return;

    try {
                      // Update the fetch URL to include the correct port
        const response = await fetch('http://localhost:4000/api/user/employees', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const employeesData = await response.json();
                        // Do something with the fetched employees data, like setting state
        setEmployees(employeesData);
      } catch (error) {
        console.error(error);
        setError(error.message || 'Failed to fetch employees');
      }
    };

    fetchEmployees();// Dependency array, if you're using the 'user' state to store user information
  }, [user]);

  useEffect(() => {
    console.log("Selected Employees updated:", selectedEmployees);
}, [selectedEmployees]); // This useEffect will run every time selectedEmployees changes

    // Autofill function
  const autofill = () => {
    setTitle('TASK TITLE');
    setDate(moment().tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm')); // Autofill with current Pacific Time
    setDescription('AUTOFILLED TASK DESCRIPTION');
    setPriority('High');
    setEmployees([{}]);
  };

   // Convert the local date and time to a UTC string
  const convertToUTC = (localDateTime) => {
    return moment(localDateTime, 'YYYY-MM-DDTHH:mm').tz('America/Los_Angeles').utc().format();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting with selectedEmployees:", selectedEmployees); // Debugging line
    const task = {
      title,
      date: convertToUTC(date), // Convert the date to UTC
      description,
      priority,
      employees: selectedEmployees,
    };
    console.log("Task object being sent to the server:", task);
    try {
      const json = await customFetch('/api/tasks', 'POST', task);
      dispatch({ type: 'CREATE_TASK', payload: json });
      
  // Reset form fields and state after successful task creation
  setTitle('');
  setDate('');
  setDescription('');
  setPriority('');
  setEmployees([]); // Assuming you want to clear the fetched employees list or reset selections
  setSelectedEmployees([]);
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

// Handler to add selected employee to the task
// Handler to add selected employee to the task
// Handler to add selected employee to the task
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

      <label>Assign Employee:</label>
      <select value={currentEmployee} onChange={handleCurrentEmployeeChange}>
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
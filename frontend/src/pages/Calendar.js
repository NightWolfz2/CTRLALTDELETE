import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useCustomFetch } from '../hooks/useCustomFetch';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './../css/Calendar.css';
import TaskDetails2 from '../components/TaskDetails';// Confirm the path is correct
import { useAuthContext } from '../hooks/useAuthContext';
import { useTasksContext } from '../hooks/useTasksContext';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { dispatch } = useTasksContext();

  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksDue, setTasksDue] = useState([]);
  //Dates
  const [today] = useState(moment(new Date()).toDate());
  const [date, setDate] = useState(moment(new Date()).toDate());
  //
  const [showTasks, setShowTasks] = useState(true);
  const [showTaskInfo, setShowTaskInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [employees, setEmployees] = useState([]);
  const customFetch = useCustomFetch();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [currentEmployee, setCurrentEmployee] = useState('');

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
      }
    };

    fetchEmployees();// Dependency array, if you're using the 'user' state to store user information
  }, [user]);

  const minTime = new Date();
  minTime.setHours(6, 0, 0); // Set minimum time to 6:00 AM

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0); // Set maximum time to 10:00 PM


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks from database API
        const data = await customFetch('/api/tasks');

        const allTasks = data.map(task => ({
            //.filter(task => new Date(task.date) >= now)
            ...task,
            start: moment(task.date).startOf('day').toDate(),
            end: moment(task.date).toDate(),
          }));

        setTasks(allTasks);

      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Handle unauthorized error by logging out and redirecting to login
        if (error.message === 'Unauthorized') {
          logout();
          navigate('/login');
        }
      }
    };
    fetchTasks();
  }, []);

  const filterTasksByDate = (tasksArray, selectedDate) => {
    // Filter tasks based on the selected date
    const filteredTasks = tasksArray.filter(task => {
      const taskDueDate = moment(task.start).startOf('day').toDate(); // Convert task due date to start of day
      return moment(taskDueDate).isSame(selectedDate, 'day'); // Check if task due date is the same as selected date
    });

    return filteredTasks;
  };

  const handleEventClick = task => {
    setSelectedTask(task);
    setShowPopup(true);
    setShowTasks(false);
    setShowTaskInfo(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCloseTaskInfo = () => {
    setShowTaskInfo(false);
    setShowTasks(true);
    setSelectedTask();
  };

  const handleEditTask = () => {
    setIsEditing(true); // Set editing mode to true
  };

  const handleSubmitTask = () => {
    setIsEditing(false);
    const newTasks = tasks.map(task => task._id === selectedTask._id ? selectedTask : task);
    setTasks(newTasks);
    const json = customFetch(`/api/tasks/${selectedTask._id}`, 'PATCH', selectedTask, user.token);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null); // Set selectedTask to null to close the TaskDetails window
  };

  const handleTitleChange = (e) => {
    setSelectedTask({
      ...selectedTask,
      title: e.target.value
    });
  };

  const handlePriorityChange = (e) => {
    setSelectedTask({
      ...selectedTask,
      priority: e.target.value
    });
  };

  const handleDescriptionChange = (e) => {
    setSelectedTask({
      ...selectedTask,
      description: e.target.value
    })
  };

  const handleDateInputChange = (e) => {
    setSelectedTask({
      ...selectedTask,
      date: e.target.value,
      start: moment(e.target.value).startOf('day').toDate(),
      end: moment.utc(e.target.value).local().hours(12).toDate(),
    });
  };

  const handleCurrentEmployeeChange = (e) => {
    setCurrentEmployee(e.target.value);
  };

  const setSelectedEmployees = (newEmployees) => {
    setSelectedTask({
      ...selectedTask,
      employees: newEmployees
    })
  }

  const handleRemoveEmployee = (employeeId) => {
    setSelectedEmployees(selectedTask.employees.filter(id => id !== employeeId));
  };


  const handleAddEmployee = () => {
    console.log("Current Employee before adding:", currentEmployee);

    // Check if the currentEmployee is already in the selectedEmployees array
    if (currentEmployee && !selectedTask.employees.includes(currentEmployee)) {
      // Update the state in a functional way to ensure the latest state is used
      const updatedSelectedEmployees = [...selectedTask.employees, currentEmployee];
      console.log("Selected Employees after adding:", updatedSelectedEmployees);
      setSelectedEmployees(updatedSelectedEmployees);
      // Clear the current selection after adding the employee to the list
      setCurrentEmployee('');
    } else {
      console.log("Employee already added or no employee selected.");
    }
  };

  const handleDateChange = (date) => {
    //set new date
    const selected = new Date(moment(date).toDate());
    setDate(selected);
    //close task info
    handleCloseTaskInfo();
    //filter by date
    const filteredTasks = filterTasksByDate(tasks, date);
    setTasksDue(filteredTasks)
    setShowTasks(true);
  };

  const components = {
    event: (props) => {
      const { title, priority, status } = props?.event;
      // Combine styles for past due tasks and priority-based styling
      const combinedStyles = {
        opacity: status === 'Past Due' ? 0.5 : 1,
        backgroundColor: getTaskBgColor(priority),
        color: 'black'
      };

      return (
        <div style={combinedStyles}>
          <div>{title}</div>
          <div>
            {employees.map(employee => (
              <span key={employee._id} value={employee._id}>
                {employee.fname.charAt(0)}. {employee.lname}
              </span>
            ))}
          </div>
        </div>
      );
    }
  };

  // Function to get background color based on priority
  const getTaskBgColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ffad99';
      case 'Medium':
        return '#f3f899';
      case 'Low':
        return '#adebad';
      default:
        return '#3174ad'; // Default color if priority is not defined
    }
  };

  /* */


  return (
    <div className="calendar-page">
      <Calendar
      style={{height:"90vh"}}
        localizer={localizer}
        views={['month', 'week', 'day', 'agenda']}
        events={tasks}
        components={components}
        startAccessor="start" // Use 'start' as the accessor for the start date
        endAccessor="end" // Use 'end' as the accessor for the end date
        defaultDate={new Date()}
        date={date}
        min={minTime}
        max={maxTime}
        //eventPropGetter={eventStyleGetter} // Apply custom styles to events
        onSelectEvent={handleEventClick} // Handle event click
      />

      <div className="side-container">

        <div className="side-component">
          <div className="side-component-stuff">
            <DatePicker className="date-picker" selected={date} onChange={handleDateChange} inline />
            <span className="filters">
              <label> Today is: </label>
              <input type="date" value={today.toLocaleDateString('en-CA')} readOnly></input>
              <label> Selected date is: </label>
              <input type="date" value={date.toLocaleDateString('en-CA')} readOnly></input>
            </span>
          </div>
        </div>
        <div className="side-component-2">
        {showTasks && (
            <div className="task-info">
              <h3>Tasks</h3>
              <ul>
                {tasksDue.map(task => (
                <li key={task.id}>
                  {task.title}
                </li>
                ))}
              </ul>
            </div>
          )}
        {showTaskInfo && (
            <div className="task-info">
              <h3>Task Information</h3>
              <div className="scroll">
                <label>Title: </label>
                <input
                  readOnly={!isEditing}
                  className={isEditing ? '' : 'read-only'} // Apply 'read-only' class when not editing
                  type="text" value={selectedTask.title}
                  onChange={handleTitleChange}
                >
                </input>

                <label>Due Date: </label>
                <input
                  readOnly={!isEditing}
                  className={isEditing ? '' : 'read-only'} // Apply 'read-only' class when not editing
                  type="datetime-local"
                  value={selectedTask.date}
                  onChange={handleDateInputChange}
                >
                </input>

                <label>Priority: </label>
                <select
                  disabled={!isEditing}
                  className={isEditing ? '' : 'read-only'}
                  onChange={handlePriorityChange}
                  value={selectedTask.priority}
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <label>Assignee:</label>
                <select disabled={!isEditing} value={currentEmployee} onChange={handleCurrentEmployeeChange}>
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee._id} value={employee._id}>
                      {employee.fname} {employee.lname}
                    </option>
                  ))}
                </select>
                <div>
                  {isEditing && <button type="button" onClick={handleAddEmployee}>Add Employee</button>}
                </div>

                {/* List of selected employees with a remove button */}
                {isEditing && selectedTask.employees.map(employeeId => {
                  const employee = employees.find(e => e._id === employeeId);
                  return (
                    <div key={employeeId} className="selectedEmployee">
                      <div>{employee ? `${employee.fname} ${employee.lname}` : 'Loading...'}</div>
                      <div>
                        {isEditing && <button type="button" onClick={() => handleRemoveEmployee(employeeId)}>
                          Remove
                        </button>}
                      </div>
                    </div>
                  );
                })}

                <label style={{ paddingTop: "5%" }}>Description: </label>
                <textarea
                  readOnly={!isEditing}
                  className={isEditing ? '' : 'read-only'} // Apply 'read-only' class when not editing
                  value={selectedTask.description}
                  onChange={handleDescriptionChange}
                >
                </textarea>

              </div>
              <div style={{ display: "flex" }}>
              {!isEditing ? (
                <React.Fragment>
                  <button type="button" onClick={handleEditTask}>Edit</button>
                  <button class="close-btn" onClick={handleCloseTaskInfo}>Close</button>
                </React.Fragment>
              ) : (
                <button type="button" onClick={handleSubmitTask}>Submit</button>
              )}
              {isEditing && (
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
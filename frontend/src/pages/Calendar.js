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
import { useAuthContext } from '../hooks/useAuthContext';


const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksDue, setTasksDue] = useState([]);
  //Dates
  const [today] = useState(moment(new Date()).toDate());
  const [date, setDate] = useState(moment(new Date()).toDate());
  //
  const [showTasks, setShowTasks] = useState(true);
  const [showTaskInfo, setShowTaskInfo] = useState(false);
  //
  const [agendaDate, setAgendaDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [employees, setEmployees] = useState([]);
  const customFetch = useCustomFetch();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [currentEmployee, setCurrentEmployee] = useState('');

  const minTime = new Date();
  minTime.setHours(6, 0, 0); // Set minimum time to 6:00 AM

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0); // Set maximum time to 10:00 PM

  useEffect(() => {
    // Update agenda text whenever date changes
    setAgendaDate(`${date.toLocaleDateString('en-CA', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`);
  }, [date]);

  // Filtering 
  // Example button click handler
  const handleFilterButtonClick = () => {

  };
  // Filter tasks based on the selected date
  const filterTasksByDate = (tasksArray, selectedDate) => {
    const filtTasks = tasksArray.filter(task => {
      const taskDueDate = moment(task.date).startOf('day').toDate(); // Convert task due date to start of day
      return moment(taskDueDate).isSame(selectedDate, 'day'); // Check if task due date is the same as selected date
    });

    setTasksDue(filtTasks);
  };


  const handleDateChange = (date) => {
    //set new date
    const selected = new Date(moment(date).toDate());
    setDate(selected);
    //close task info
    handleCloseTaskInfo();
    //filter by date
    const filtTasks = filterTasksByDate(tasks, date);
    setShowTasks(true);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
    filterTasksByDate(tasks, newDate);
    setShowTaskInfo(false);
    setShowTasks(true);
  };

  const EventComponent = ({ event }) => {
    const { title, priority, status, end } = event;
    const eventStyle = {
      backgroundColor: getTaskBgColor(priority),
      opacity: status === 'Past Due' ? 0.5 : 1,
      color: 'black',
      height: '100%',
      padding: '0 2px',
      paddingTop: '3px'
    };

    return (
      <div style={eventStyle}>
        <span>{moment(end).format('LT')}: {title}</span>
      </div>
    );
  };

  // Function to get background color of task based on priority
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

  // Fetch employees
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

  // Fetch Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks from database API
        const data = await customFetch('/api/tasks');

        /* const allTasks = data
            .filter(task => new Date(task.date) >= today)
            .map(task => ({
            ...task,
            start: moment(task.date).startOf('day').toDate(),
            end: moment(task.date).toDate(),
          }));
*/
        const allTasks = data.map(task => ({
            //.filter(task => new Date(task.date) >= now)
            ...task,
            start: moment(task.date).toDate(),
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

  const handleTaskClick = task => {
    setSelectedTask(task);
    setShowTasks(false);
    setShowTaskInfo(true);
  };


  const handleCloseTaskInfo = () => {
    setShowTaskInfo(false);
    setShowTasks(true);
    setSelectedTask(null);
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

  /* */


  return (
    <div className="calendar-page">

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
            <div className="task-info" >
              <h3 >
                Agenda: {agendaDate}
              </h3>
              <div className="task-list">
                <ol style={{ listStyleType: 'none', width: '100%', padding: 0, backgroundColor: '#353535'}}>
                  {tasksDue.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).map(task => (
                    <li key={task.id} style={{ marginRight: '40px'}}>
                      <div style={{marginRight: '30px'}}>
                        {new Date(task.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true, minimumIntegerDigits: 2 })}
                      </div>
                      <div style={{ width: '70%', color: 'black', backgroundColor: getTaskBgColor(task.priority), paddingRight: ''}}>
                        {task.title}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
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
                  value={moment(selectedTask.date).format("YYYY-MM-DDTHH:mm")}
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
      <Calendar
        style={{height:"90vh"}}
        localizer={localizer}
        views={['month', 'week', 'day']}
        defaultView="week"
        events={tasks}
        components={{
          event: EventComponent,
        }}
        formats={{
          eventTimeRangeFormat: () => null, // Remove the time label from week and day view
        }}
        startAccessor="start" // Use 'start' as the accessor for the start date
        endAccessor="end" // Use 'end' as the accessor for the end date
        defaultDate={today}
        date={date}
        min={minTime}
        max={maxTime}
        onSelectEvent={handleTaskClick} // Handle event click
        onNavigate={handleNavigate} // Pass handleNavigate to the Calendar component
      />
    </div>
  )
}

export default CalendarPage
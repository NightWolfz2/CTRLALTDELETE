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

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  //Tasks 
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksDue, setTasksDue] = useState([]);
  //Dates
  const [today] = useState(moment(new Date()).toDate());
  const [date, setDate] = useState(moment(new Date()).toDate());
  //
  const [showTasks, setShowTasks] = useState(true);
  const [showTaskInfo, setShowTaskInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  //
  const customFetch = useCustomFetch(); 
  const navigate = useNavigate(); 
  const { logout } = useLogout(); 

  const minTime = new Date();
  minTime.setHours(6, 0, 0); // Set minimum time to 6:00 AM

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0); // Set maximum time to 10:00 PM


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks from database API
        const data = await customFetch('/api/tasks');
        
        const allTasks = data
          //.filter(task => new Date(task.date) >= now)
          .map(task => ({
            ...task,
            start: moment(task.date).startOf('day').toDate(),
            end: moment.utc(task.date).local().hours(12).toDate(),
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
    setShowTasks(false);
    setShowTaskInfo(true);
  };

  const handleCloseTaskInfo = () => {
    setShowTaskInfo(false);
    setShowTasks(true);
  };

  const handleEditTask = () => {
    setIsEditing(true); // Set editing mode to true
  };

  const handleSubmitTask = () => {
    setIsEditing(false)
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
      const taskPrio = props?.event?.priority
      const taskStatus = props?.event?.status;
      // Combine styles for past due tasks and priority-based styling
      const combinedStyles = {
        opacity: taskStatus === 'Past Due' ? 0.5 : 1,
        backgroundColor: getTaskBgColor(taskPrio),
        color: 'black'
      };

      return <div style={combinedStyles}>{props.title}</div>;
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
          <DatePicker className="date-picker" selected={date} onChange={handleDateChange} inline/>
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
              <label>Title: </label>
              <input 
                readOnly={!isEditing}
                className={isEditing ? '' : 'read-only'} // Apply 'read-only' class when not editing
                type="text" value={selectedTask.title}
                >
              </input>

              <label>Due Date: </label> 
              <input 
                readOnly={!isEditing}
                className={isEditing ? '' : 'read-only'} // Apply 'read-only' class when not editing
                type="datetime-local" 
                value={selectedTask.date}
                >
              </input>

              <label>Priority: </label>
              <input 
                readOnly={!isEditing}
                className={isEditing ? '' : 'read-only'} // Apply 'read-only' class when not editing
                type="text" 
                value={selectedTask.priority}
                >
              </input>

              <label>Assignee: </label>
              <input 
                readOnly={!isEditing}
                className={isEditing ? '' : 'read-only'} // Apply 'read-only' class when not editing
                type="text" 
                value="Assignee"
                >
              </input>

              <label style={{paddingTop:"5%"}}>Description: </label>
              <textarea 
                readOnly={!isEditing}
                className={isEditing ? '' : 'read-only'} // Apply 'read-only' class when not editing
                value={selectedTask.description}
                >
              </textarea>

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
        )}
        </div>
      </div>

    </div>
  )}

export default CalendarPage
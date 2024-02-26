import React from 'react';
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
//import 'react-datepicker/dist/react-datepicker.css'; 
import './../css/Calendar.css';
import { useCustomFetch } from '../hooks/useCustomFetch'; 
import { useNavigate } from 'react-router-dom'; 
import { useLogout } from '../hooks/useLogout'; 
import TaskDetails2 from '../components/TaskDetails';// Confirm the path is correct

const localizer = momentLocalizer(moment);

const CalendarPage = () => { 
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const customFetch = useCustomFetch(); 
  const navigate = useNavigate(); 
  const { logout } = useLogout(); 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks from database API
        const data = await customFetch('/api/tasks');
        
        const now = new Date();

        const filteredTasks = data
          //.filter(task => new Date(task.date) >= now)
          .map(task => ({
            ...task,
            start: moment(task.date).startOf('day').toDate(),
            end: moment.utc(task.date).local().hours(12).toDate(),
          }));

        setTasks(filteredTasks);

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

  const handleEventClick = event => {
    setShowPopup(true);
    setSelectedTask(event);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleEditTask = () => {
    setIsEditing(true); // Set editing mode to true
  };

  const handleSubmitTask = () => {
    setIsEditing(false)
  };
  
      const handleCloseDetails = () => {
        setSelectedTask(null); // Set selectedTask to null to close the TaskDetails window
    };



  const eventStyleGetter = (event, isSelected) => {
    let backgroundColor = '';
    switch (event.priority) {
      case 'High':
        backgroundColor = '#ffad99';  
        break;
      case 'Medium':
        backgroundColor = '#f3f899';
        break;
      case 'Low':
        backgroundColor = '#adebad';
        break;
      default:
        backgroundColor = '#3174ad'; // Default color if priority is not defined
    }

    let opacity ='';
    // Check if the event is marked as "Past Due"
    if (event.status === 'Past Due') {
      opacity = 0.5;
    }
  
    let className = '';
    if (isSelected) {
      className = 'rbc-event-content'; // Add the 'rbc-selected' class if the event is selected
    }

    return {
      className: className,
      style: {
        backgroundColor: backgroundColor,
        opacity: opacity,
        borderRadius: '5px',
        color: 'black',
        textAlign: 'center'
      }
    };
  };
  

  return (
    <div className="calendar-page">
      <div className="my-rbc-container">
        <Calendar 
          localizer={localizer} 
          events={tasks} 
          startAccessor="start" // Use 'start' as the accessor for the start date
          endAccessor="end" // Use 'end' as the accessor for the end date
          eventPropGetter={eventStyleGetter} // Apply custom styles to events
          onSelectEvent={handleEventClick} // Handle event click
        />
      </div>
      <div className="side-container">
        <div className="side-component">
          <h3>Something goes here</h3>
        </div>
        {showPopup && (
          <div className="task-info-container">
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
                    <button class="close-btn" onClick={handleClosePopup}>Close</button>
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
  )}

export default CalendarPage
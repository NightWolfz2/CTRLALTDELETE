import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
//import DatePicker from "react-datepicker";
import { useCustomFetch } from '../hooks/useCustomFetch'; 
import { useNavigate } from 'react-router-dom'; 
import { useLogout } from '../hooks/useLogout'; 

const localizer = momentLocalizer(moment);

const CalendarPage = () => { 
  const [tasks, setTasks] = useState([]);
  const customFetch = useCustomFetch(); 
  const navigate = useNavigate(); 
  const { logout } = useLogout(); 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Use customFetch to automatically handle authorization header and error handling
        const data = await customFetch('/api/tasks');

        const now = new Date();
        const filteredTasks = data
          .filter(task => new Date(task.date) >= now)
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

  const eventStyleGetter = (event, start, end, isSelected) => {
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
  
    let className = '';
    if (isSelected) {
      className = 'rbc-selected'; // Add the 'rbc-selected' class if the event is selected
    }

    return {
      className: className,
      style: {
        backgroundColor: backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block',
        textAlign: 'center'
      }
    };
  };
  

  return (
    <div className="calendar">
      <div className="page-title">
        <h2>Calendar</h2>
      </div>
      <Calendar 
        localizer={localizer} 
        events={tasks} // 
        startAccessor="start" // Use 'start' as the accessor for the start date
        endAccessor="end" // Use 'end' as the accessor for the end date
        style={{  
          fontSize: "inherit",
          height: 800, 
          width: 1600, 
          margin: "50px"
        }} 
        eventPropGetter={eventStyleGetter} // Apply custom styles to events
      />
    </div>
  )
}

export default CalendarPage
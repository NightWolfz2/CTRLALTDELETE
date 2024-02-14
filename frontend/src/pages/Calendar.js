import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
//import DatePicker from "react-datepicker";
import {useAuthContext} from '../hooks/useAuthContext'

const localizer = momentLocalizer(moment);

const CalendarPage = () => { 
  const [tasks, setTasks] = useState([]);
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks from database API
        const response = await fetch('/api/tasks', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();

        const now = new Date();
        const filteredTasks = data
          .filter(task => new Date(task.date) >= now)
          .map(task => ({
            ...task,
            start: moment(task.date).startOf('day').toDate(),
            end: moment.utc(task.date).local().hours(12).toDate()
          }));

        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (user.token) {
      fetchTasks();
    }
  }, [user.token]); // user.token is the only dependency

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
      />
    </div>
  )
}

export default CalendarPage
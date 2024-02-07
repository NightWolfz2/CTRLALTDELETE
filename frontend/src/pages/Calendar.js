import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
//import React, { useState } from "react";
//import DatePicker from "react-datepicker";
import './../css/Calendar.css'; // Import your CSS file
import {useAuthContext} from '../hooks/useAuthContext'

const locales = {
  "en-US": require("date-fns/locale/en-US")
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

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

        // Filter tasks that are not past due
        const filteredTasks = data.filter(task => {
          const now = new Date();
          const dueDate = new Date(task.date);
          return dueDate >= now;
        });
        
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
        events={tasks}
        startAccessor="date" 
        endAccessor="date" 
        style={{  
          fontSize: "inherit",
          height: 1000, 
          width: 2000, 
          margin: "50px" 
        }} 
      />
    </div>
  )
}

export default CalendarPage
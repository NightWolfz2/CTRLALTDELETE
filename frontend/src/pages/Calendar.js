import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import './../css/Calendar.css'; // Import your CSS file

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
  return (
    <div className="calendar">
      <div className="page-title">
        <h2>Calendar</h2>
      </div>
      <Calendar localizer={localizer} startAccessor="start" endAccessor="end" 
                style={{  fontSize: "inherit",
                          height: 800, 
                          width: 1500, 
                          margin: "50px" }} 
      />
    </div>
  )
}

export default CalendarPage
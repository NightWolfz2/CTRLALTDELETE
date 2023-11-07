import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import './../css/Calendar.css'; // Import your CSS file

const Calendar = () => { 
  return (
    <div className="calendar">
      <div className="page-title">
        <h2>Calendar</h2>
      </div>
    </div>
  )
}

export default Calendar
import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import './../css/History.css'; // Import CSS file

const History = () => { 
  return (
    <div className="history">
      <div className="page-title">
        <h2>History</h2>
      </div>
    </div>
  )
}

export default History
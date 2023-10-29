import { useEffect } from "react"
import { useTasksContext } from "../hooks/useTasksContext"

// components
import TaskDetails from "../components/TaskDetails"

const Home = () => {
  const {tasks, dispatch} = useTasksContext()

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks')
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_TASKS', payload: json})
      }
    }

    fetchTasks()
  }, [dispatch])

  return (
    <div className="home">
      <div className="home-details">
        <h2>HOME</h2>
      </div>
      <h3>In Progress</h3>
      <div className="tasks">
        {tasks && tasks.map(task => (
          <TaskDetails task={task} key={task._id} />
        ))}
      </div>
      <h3>Past Due</h3>
      <div className="tasks">
        {tasks && tasks.map(task => (
          <TaskDetails task={task} key={task._id} />
        ))}
      </div>
    </div>
  )
}

export default Home
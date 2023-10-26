import { useState } from 'react'
import { useTasksContext } from '../hooks/useTasksContext'

const TaskForm = () => {
  const { dispatch } = useTasksContext()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const task = {title, date, description, priority}
    
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setError(null)
      setTitle('')
      setDate('')
      setDescription('')
      setPriority('')
      console.log('new task added:', json)
      dispatch({type: 'CREATE_TASK', payload: json})
    }

  }

  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Add a New Task</h3>

      <label>Task Title:</label>
      <input 
        type="text" 
        onChange={(e) => setTitle(e.target.value)} 
        value={title}
      />
      <label>Date:</label>
      <input 
        type="text" 
        onChange={(e) => setDate(e.target.value)} 
        value={date}
      />
      <label>Description:</label>
      <input 
        type="text" 
        onChange={(e) => setDescription(e.target.value)} 
        value={description}
      />
      <label>Priority:</label>
      <input 
        type="number" 
        onChange={(e) => setPriority(e.target.value)} 
        value={priority} 
      />

      <button>Add Task</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default TaskForm
import React, { useState, useEffect } from 'react';
import TaskDetails from './TaskDetails'; // Adjust the path as per your directory structure
import axios from 'axios'; // Assuming axios for fetching data

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks'); // Your API endpoint to fetch tasks
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const pastDueTasks = tasks.filter(task => task.status === 'Past Due');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');

  return (
    <div>
      <h2 className="task-list-heading">Past Due</h2>
      {pastDueTasks.map(task => (
        <TaskDetails key={task._id} task={task} />
      ))}

      <h2 className="task-list-heading">In Progress</h2>
      {inProgressTasks.map(task => (
        <TaskDetails key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;

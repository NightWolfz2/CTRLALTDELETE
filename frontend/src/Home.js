import React from 'react';
import TaskBox from './TaskBox';  

const Home = () => {
    return (
        <div className="home">
            <h2>In Progress</h2>
            <div className="task-row">
                {[...Array(5)].map((_, i) => (
                    <TaskBox 
                        key={i} 
                        status="In Progress" 
                        taskNum={i+1} 
                        dueDate="Some Date" 
                        description="Some Description" 
                        priority="High" 
                        assigned="Billy Bob" 
                    />
                ))}
            </div>
            
            <h2>Past Due</h2>
            <div className="task-row">
                {[...Array(5)].map((_, i) => (
                    <TaskBox 
                        key={i} 
                        status="Past Due" 
                        taskNum={i+6} 
                        dueDate="Some Date" 
                        description="Some Description" 
                        priority="Medium" 
                        assigned="Billy Bob" 
                    />
                ))}
            </div>

            <h2>Completed</h2>
            <div className="task-row">
                {[...Array(5)].map((_, i) => (
                    <TaskBox 
                        key={i} 
                        status="Completed" 
                        taskNum={i+11} 
                        dueDate="Some Date" 
                        description="Some Description" 
                        priority="Low" 
                        assigned="Billy Bob" 
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;

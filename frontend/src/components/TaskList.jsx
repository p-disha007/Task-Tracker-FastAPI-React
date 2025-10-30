import React from 'react';

function TaskItem({ task, onTaskUpdate }) {
  
  const handleStatusChange = (e) => {
    onTaskUpdate(task.id, { status: e.target.value });
  };
  
  const handlePriorityChange = (e) => {
    onTaskUpdate(task.id, { priority: e.target.value });
  };

  return (
    <div className="task-item">
      <div className="task-item-header">
        <h3>{task.title}</h3>
        <select 
          className="task-status-select" 
          value={task.status} 
          onChange={handleStatusChange}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      {task.description && <p>{task.description}</p>}
      <div className="task-item-footer">
        <select 
          className={`task-priority priority-${task.priority}`}
          value={task.priority}
          onChange={handlePriorityChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        
        <span className="task-due-date">
          {task.due_date ? `Due: ${task.due_date}` : 'No due date'}
        </span>
      </div>
    </div>
  );
}

function TaskList({ tasks, onTaskUpdate }) {
  if (tasks.length === 0) {
    return <p>No tasks match your filters. Hooray?</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onTaskUpdate={onTaskUpdate} />
      ))}
    </div>
  );
}

export default TaskList;
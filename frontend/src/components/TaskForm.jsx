import React, { useState } from 'react';

function TaskForm({ onTaskAdded, apiUrl }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Title is required.');
      return;
    }

    setIsSubmitting(true);
    const taskData = {
      title,
      description,
      priority,
      status: 'Pending',
      due_date: dueDate || null,
    };

    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json();
          alert('Validation Error: ' + JSON.stringify(errorData.detail));
        } else {
          throw new Error('Server error');
        }
      } else {
        const newTask = await response.json();
        onTaskAdded(newTask);
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setDueDate('');
      }
    } catch (error) {
      alert('Failed to add task: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="due-date">Due Date</label>
          <input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </section>
  );
}

export default TaskForm;
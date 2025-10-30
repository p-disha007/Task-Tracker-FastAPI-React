import React, { useState, useEffect, useCallback } from 'react' 
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import Insights from './components/Insights'
import './index.css'

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [tasks, setTasks] = useState([])
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [sortBy, setSortBy] = useState('due_date')
  
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (filterStatus) params.append('status', filterStatus)
    if (filterPriority) params.append('priority', filterPriority)
    params.append('sort_by', sortBy)

    try {
      const response = await fetch(`${API_URL}/tasks?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      setError('Failed to fetch tasks: ' + error.message)
    } finally {
      setLoading(false)
    }
  }, [filterStatus, filterPriority, sortBy])
  
  const fetchInsights = async () => {
    try {
      const response = await fetch(`${API_URL}/insights`)
      const data = await response.json()
      setInsights(data)
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    }
  }
  
  useEffect(() => {
    fetchTasks()
    fetchInsights()
  }, [fetchTasks])
  
  const handleTaskAdded = (newTask) => {
    fetchTasks()
    fetchInsights()
  }
  
  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
      if (!response.ok) {
        throw new Error('Failed to update task')
      }
      fetchTasks()
      fetchInsights()
    } catch (error) {
      setError('Failed to update task: ' + error.message)
    }
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h1>Task Tracker</h1>
        <Insights insights={insights} />
        <TaskForm onTaskAdded={handleTaskAdded} apiUrl={API_URL} />
      </aside>

      <main className="main-content">
        <section className="card task-list-section">
          <h2>Your Tasks</h2>
          
          <div className="task-list-controls">
            <div className="form-group">
              <label htmlFor="filterStatus">Filter by Status</label>
              <select 
                id="filterStatus"
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="filterPriority">Filter by Priority</label>
              <select 
                id="filterPriority"
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sortBy">Sort By</label>
              <select 
                id="sortBy"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          {loading && <p>Loading tasks...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
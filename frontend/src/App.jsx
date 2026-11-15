
import { useState, useEffect } from 'react'
import api from './api'
import './App.css'

function App() {
  const [applications, setApplications] = useState([])
  useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications')

      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  fetchApplications()
}, [])

  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
const [statusFilter, setStatusFilter] = useState('All')

  async function handleSubmit(event) {
  event.preventDefault()

  if (!company.trim() || !role.trim()) {
    alert('Please enter both company and role')
    return
  }

  try {
    const response = await api.post('/applications', {
      company: company,
      role: role,
    })

    // Add the application returned by MongoDB to React state
    setApplications((prevApplications) => [
      ...prevApplications,
      response.data,
    ])

    // Clear the form after successful submission
    setCompany('')
    setRole('')

  } catch (error) {
    console.error('Error adding application:', error)
    alert('Could not add application. Please try again.')
  }
}
  async function updateStatus(id, newStatus) {
  try {
    const response = await api.put(`/applications/${id}`, {
      status: newStatus,
    })

    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app._id === id ? response.data : app
      )
    )
  } catch (error) {
    console.error('Error updating application:', error)
    alert('Could not update application status.')
  }
}

async function deleteApplication(id) {
  // Ask for confirmation before deleting
  const confirmed = window.confirm(
    'Are you sure you want to delete this application?'
  )

  if (!confirmed) return

  try {
    // Send DELETE request to the backend
    await api.delete(`/applications/${id}`)

    // Remove the deleted application from React state
    setApplications((prevApplications) =>
      prevApplications.filter((app) => app._id !== id)
    )

  } catch (error) {
    console.error('Error deleting application:', error)
    alert('Could not delete application. Please try again.')
  }
}
const filteredApplications = applications.filter((app) => {
  const matchesSearch =
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.role.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesStatus =
    statusFilter === 'All' || app.status === statusFilter

  return matchesSearch && matchesStatus
})

  return (
    <div className="app">
      <header className="header">
        <h1>TrackMyJobs</h1>
        <p>Keep track of your job applications in one place.</p>
      </header>

      <main>
        <section className="summary">
          <div className="summary-card">
            <h3>Total Applications</h3>
            <p>{applications.length}</p>
          </div>

          <div className="summary-card">
            <h3>Interviews</h3>
            <p>
              {applications.filter((app) => app.status === 'Interview').length}
            </p>
          </div>

          <div className="summary-card">
            <h3>Rejected</h3>
            <p>
              {applications.filter((app) => app.status === 'Rejected').length}
            </p>
          </div>
        </section>

        <section className="applications">
          <h2>Add an Application</h2>

          <form onSubmit={handleSubmit} className="application-form">
            <input
              type="text"
              placeholder="Company name"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />

            <input
              type="text"
              placeholder="Job role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />

            <button type="submit">Add Application</button>
          </form>
        </section>

        <section className="applications">
  <h2>Your Applications</h2>

  <div className="filters">
    <input
      type="text"
      placeholder="Search company or role..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
    />

    <select
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
    >
      <option value="All">All Statuses</option>
      <option value="Applied">Applied</option>
      <option value="Interview">Interview</option>
      <option value="Rejected">Rejected</option>
      <option value="Offer">Offer</option>
    </select>
  </div>

          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app._id}>
                  <td>{app.company}</td>
                  <td>{app.role}</td>
                  <td>{app.date}</td>
                  <td>{app.status}</td>
                  <td>
  <select
    value={app.status}
    onChange={(event) => updateStatus(app._id, event.target.value)}
  >
    <option value="Applied">Applied</option>
    <option value="Interview">Interview</option>
    <option value="Rejected">Rejected</option>
    <option value="Offer">Offer</option>
  </select>

  <button onClick={() => deleteApplication(app._id)}>
    Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default App

const Application = require('./models/application')
require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())



// GET: Retrieve all applications

app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find()

    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch applications',
      error: error.message,
    })
  }
})


// POST: Create an application

app.post('/api/applications', async (req, res) => {
  try {
    const { company, role } = req.body

    if (!company || !role) {
      return res.status(400).json({
        message: 'Company and role are required',
      })
    }

    const newApplication = await Application.create({
      company,
      role,
    })

    res.status(201).json(newApplication)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create application',
      error: error.message,
    })
  }
})


// PUT: Update an application

app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { company, role, status } = req.body

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { company, role, status },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedApplication) {
      return res.status(404).json({
        message: 'Application not found',
      })
    }

    res.status(200).json(updatedApplication)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update application',
      error: error.message,
    })
  }
})


// DELETE: Delete an application

app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params

    const deletedApplication = await Application.findByIdAndDelete(id)

    if (!deletedApplication) {
      return res.status(404).json({
        message: 'Application not found',
      })
    }

    res.status(200).json({
      message: 'Application deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete application',
      error: error.message,
    })
  }
})


// Start server
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5001

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer()

const express = require('express')
const {
  getTasks, 
  getTask, 
  createTask, 
  deleteTask, 
  updateTask
} = require('../controllers/taskController')

const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// require authenication for routes
router.use(requireAuth)

// GET all Tasks
router.get('/', getTasks)

// GET a single task
router.get('/:id', getTask)

// POST a new task
router.post('/', createTask)

// DELETE a task
router.delete('/:id', deleteTask)

// UPDATE a task
router.patch('/:id', updateTask)

module.exports = router
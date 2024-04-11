const express = require('express')
const {
  getTasks, 
  getTask, 
  createTask, 
  deleteTask, 
  updateTask,
  getCompletedTasks,
  completeTask,
  markTaskDeleted,
  uncompleteTask,
  undeletedTask
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

router.get('/completed', getCompletedTasks)

router.patch('/complete-task/:id', completeTask)

// mark a task deleted
router.patch('/mark-task-deleted/:id', markTaskDeleted)

// restore deleted task
router.patch('/mark-task-restore-deleted/:id', undeletedTask)

// restore completed task
router.patch('/mark-task-restore-completed/:id', uncompleteTask)



module.exports = router
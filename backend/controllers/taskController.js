const Task = require('../models/taskModel');
const mongoose = require('mongoose');

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// get all tasks
// get all tasks with detailed createdBy and updatedBy information
const getTasks = async (req, res) => {
  try {
    // Use .populate to include detailed information about the users in createdBy and updatedBy fields
    const tasks = await Task.find({})
                            .sort({ createdAt: -1 })
                            .populate('createdBy', 'fname lname email') // Adjust the fields you need from the User model
                            .populate('updatedBy', 'fname lname email'); // Same here

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal server error' });
  }
};


// get a single task
const getTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' });
  }

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ error: 'No such task' });
  }

  res.status(200).json(task);
};

const getCompletedTasks = async (req, res) => {
  console.log("getCompleted is working")
  try {
    const completedTasks = await Task.find({ completed: true }).sort({ createdAt: -1 });
    res.status(200).json(completedTasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const completeTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' });
  }

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ error: 'No such task' });
  }
  task.completed = true;

  res.status(200).json(task);
  task.save()
};

// create a new task
// Inside your task creation route handler
const createTask = async (req, res) => {
  const { title, date, description, priority, employees } = req.body;
  
  try {
    const task = new Task({
      title,
      date,
      description,
      priority,
      employees, // Assuming this is an array of employee IDs
      createdBy: req.user.id, // Use req.user.id from the authentication middleware
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};




const moment = require('moment-timezone');

// Example function within your controller
exports.getTasks = async (req, res) => {
  const tasks = await Task.find(); // Fetch tasks from the database
  const tasksWithConvertedDates = tasks.map(task => ({
    ...task._doc,
    dueDate: moment(task.dueDate).tz('America/Los_Angeles').format(),
  }));
  res.json(tasksWithConvertedDates);
};

// delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such task' });
  }

  const task = await Task.findOneAndDelete({ _id: id });

  if (!task) {
    return res.status(400).json({ error: 'No such task' });
  }

  res.status(200).json(task);
};

// update a task
// Inside your task update route handler
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, date, description, priority, employees } = req.body;

  try {
    const updateData = {
      title,
      date,
      description,
      priority,
      employees,
      updatedBy: req.user.id, // Use req.user.id here as well
    };

    const task = await Task.findOneAndUpdate({ _id: id }, updateData, { new: true })
      .populate('createdBy updatedBy', 'fname lname'); // Assuming you have these fields in your User model

    if (!task) {
      return res.status(404).json({ error: 'No such task' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};



module.exports = {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
  getCompletedTasks,
  completeTask
};

const Task = require('../models/taskModel');
const mongoose = require('mongoose');

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// get all tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find({}).sort({ createdAt: -1 });
  res.status(200).json(tasks);
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

// create a new task
const createTask = async (req, res) => {
  const { title, date, description } = req.body;
  let { priority } = req.body;

  // Capitalize the first letter of priority
  priority = capitalizeFirstLetter(priority);

  try {
    const task = await Task.create({ title, date, description, priority });
    res.status(200).json(task);
  } catch (error) {
    const emptyFields = error.message.includes("Path")
      ? error.message.match(/`(\w+)`/g).map(field => field.replace(/`/g, ""))
      : [];
    res.status(400).json({ error: error.message, emptyFields });
  }
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
const updateTask = async (req, res) => {
  const { id } = req.params;
  let { priority } = req.body;

  // If priority is being updated, capitalize the first letter
  if (priority) {
    priority = capitalizeFirstLetter(priority);
    req.body.priority = priority;
  }

  const task = await Task.findOneAndUpdate({ _id: id }, {
    ...req.body
  });

  if (!task) {
    return res.status(400).json({ error: 'No such task' });
  }

  res.status(200).json(task);
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask
};

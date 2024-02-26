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
const createTask = async (req, res) => {
  
  const { title, date, description, employees } = req.body; // Include 'assignedTo' in destructuring
  console.log(req.body)
  console.log("Received task creation request with assignedTo:", employees);

  let { priority } = req.body;

  // Capitalize the first letter of priority
  priority = capitalizeFirstLetter(priority);

  try {
    const task = await Task.create({ 
      title, 
      date, 
      description, 
      priority,
      employees // Include 'assignedTo' when creating a task
    });
    res.status(200).json(task);
  } catch (error) {
    // Error handling remains the same
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
  // Extract any fields you expect to update
  const { title, date, description, priority, employees } = req.body;

  try {
    // Prepare the update object, including only fields that are provided
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = date;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = capitalizeFirstLetter(priority); // Capitalize priority
    if (employees !== undefined) updateData.employees = employees; // Include 'assignedTo' in the update

    const task = await Task.findOneAndUpdate({ _id: id }, updateData, { new: true });
    
    if (!task) {
      return res.status(404).json({ error: 'No such task' });
    }

    res.status(200).json(task);
  } catch (error) {
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

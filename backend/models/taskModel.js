const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: { 
    type: Date, //change this later to Date format
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: Number, // change this to High,Low, etc.
    required: false
  },
  employees: {
    type: Number, // change this to High,Low, etc.
    required: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)
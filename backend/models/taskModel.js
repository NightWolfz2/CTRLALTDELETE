const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: { 
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  },
  status: {
    type: String,
    enum: ['In Progress', 'Past Due'],
    default: function() {
      const now = new Date();
      // Convert 'now' to UTC
      const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      const dueDate = new Date(this.date); // 'this.date' is already in UTC
  
      return dueDate < nowUTC ? 'Past Due' : 'In Progress';
    }
  },  
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false
  }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
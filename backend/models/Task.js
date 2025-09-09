const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Task description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  estimatedTime: {
    type: Number, // in minutes
    min: 0
  },
  actualTime: {
    type: Number, // in minutes
    min: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, priority: 1 });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.isCompleted) return false;
  return new Date() > this.dueDate;
});

// Method to mark task as completed
taskSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.isCompleted = true;
  this.completedAt = new Date();
  return this.save();
};

// Method to update status
taskSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'completed') {
    this.isCompleted = true;
    this.completedAt = new Date();
  } else {
    this.isCompleted = false;
    this.completedAt = undefined;
  }
  return this.save();
};

module.exports = mongoose.model('Task', taskSchema);


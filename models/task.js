const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress'
    },
    priority: {
      type: String,
      enum: ['high, low'],
      default: 'low'
    },
    category: {
      type: String,
      enum: ['health and wellness', 'work', 'personal errands', 'other'],
      default: 'other'
    },
    dueDate: {
      type: Date,
      validate: {
        // comment: it is OK for dueDate to not be defined, and to be some date in the future
        validator: function (value) {
          return !value || value > new Date();
        },
        message: 'Due date must me in the future.'
      }
    }
  },
  { timestamps: true }
);

const taskModel = mongoose.model('Task', taskSchema);

module.exports.Task = taskModel;

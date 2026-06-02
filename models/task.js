const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  priority: {
    type: String,
    default: "low",
  },
  status: {
    type: String,
    default: "pending",
  },
  dueDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset', // Reference to the Asset model
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to the Employee model
    required: true,
  },
  dateAssigned: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);

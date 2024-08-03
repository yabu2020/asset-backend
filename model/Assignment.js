// model/Assignment.js
const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  asset: {
    assetid: String,
    name: String,
    serialno: String,
  },
  user: {
    id: String,
    name: String,
    email: String,
    department: String,
  },
  dateAssigned: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
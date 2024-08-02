// model/Assignment.js
const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  asset: {
    assetid: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
    name: String,
    serialno: String
  },
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    name: String,
    department: String
  },
  dateAssigned: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Assignment", AssignmentSchema);

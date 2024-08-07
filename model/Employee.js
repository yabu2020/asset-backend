const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  role: { type: String, required: false },
  id: { type: String, required: false, unique: true },
  name: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  password: { type: String, required: false },
  department: { type: String, required: false },
  securityQuestion: { type: String, required: true },
  securityAnswer: { type: String, required: true },
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

module.exports = EmployeeModel;

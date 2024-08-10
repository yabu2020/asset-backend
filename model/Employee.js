const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  role: { type: String, required: false },
  name: { type: String, required: true, unique:true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  department: { type: String, required: false },
  securityQuestion: { type: String },
  securityAnswer: { type: String},
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

module.exports = EmployeeModel;

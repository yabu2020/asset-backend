const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  role: { type: String, required: false },
  id: { type: String, required: false }, // Ensure id is unique
  name: { type: String, required: false },
  email: { type: String, required: false }, // Ensure email is unique
  password: { type: String, required: false },
  department: { type: String, required: false },
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

module.exports = EmployeeModel;
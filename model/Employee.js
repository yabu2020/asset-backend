const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  role: { type: String, required: true },
  id: { type: String, required: true, unique: true }, // Ensure `id` is unique
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure `email` is unique
  password: { type: String, required: true },
  department: { type: String, required: true }
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

module.exports = EmployeeModel;

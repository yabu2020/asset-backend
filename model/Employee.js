const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  role: String,
  name: String,
  email: String,
  password: String,
  //isAdmin: Boolean,

});

const EmployeeModel = mongoose.model("employees", EmployeeSchema);

module.exports = EmployeeModel;

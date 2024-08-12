const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  code: { type: String, required: true },
  description: { type: String },
  department: { type: String, required: true },
});

const DepartmentModel = mongoose.model('Department', departmentSchema);

module.exports = DepartmentModel;

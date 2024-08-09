const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  code: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
});

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;

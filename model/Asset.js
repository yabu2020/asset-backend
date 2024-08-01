const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  assetno: {
    type: String,
    required: true
  },
  serialno: {
    type: String,
    required: true
  },
  model: {
    type: String,
  },
  quantity: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["available", "under maintenance", "retired"], // Define valid values
    default: "available" // Optional: default value if none is set
  }
});

const AssetModel = mongoose.model('Asset', assetSchema);

module.exports = AssetModel;

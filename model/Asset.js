const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  serialno: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Available', 'Under Maintenance', 'retire'], // Enum for status options
    default: 'Available'
  }
});

const AssetModel = mongoose.model('Asset', assetSchema);

module.exports = AssetModel;

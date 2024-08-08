const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetid: { type: String }, // Optional if not used
  name: { type: String, required: true },
  assetno: { type: String, required: true },
  serialno: { type: String, required: true },
  model: { type: String },
  quantity: { type: Number, default: 1 },
  description: { type: String },
  status: {
    type: String,
    enum: ["Available", "In Use", "Under Maintenance", "Retired"],
    default: "Available",
  },
  category: { type: String, required: true }, // Ensure correct field name
});

const AssetModel = mongoose.model('Asset', assetSchema);

module.exports = AssetModel;

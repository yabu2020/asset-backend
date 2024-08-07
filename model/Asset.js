const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  assetid: { type: String, required: false },
  name: { type: String, required: false },
  assetno: { type: String, required: true },
  serialno: { type: String, required: true },
  model: { type: String },
  quantity: { type: Number }, // Changed to Number for quantity
  description: { type: String },
  status: {
    type: String,
    enum: ["Available", "Under Maintenance", "Retired"], // Capitalize "Retired"
    default: "Available",
  },
});

const AssetModel = mongoose.model("Asset", assetSchema);

module.exports = AssetModel;

const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  assetid: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  assetno: {
    type: String,
    required: true,
  },
  serialno: {
    type: String,
    required: true,
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
    enum: ["Available", "Under Maintenance", "retire"], // Define valid values
    default: "Available", // Optional: default value if none is set
  },
});

const AssetModel = mongoose.model("Asset", assetSchema);

module.exports = AssetModel;
const mongoose = require("mongoose");

const transferHistorySchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset', // Reference to the Asset model
    required: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to the Employee model
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to the Employee model
    required: true,
  },
  dateTransfered: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TransferHistory', transferHistorySchema);

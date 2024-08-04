const mongoose = require('mongoose');

const transferHistorySchema = new mongoose.Schema({
  assetId: { type: String, required: true },
  fromUserId: { type: String, required: true },
  toUserId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TransferHistory', transferHistorySchema);

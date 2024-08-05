const mongoose = require("mongoose");
const transferHistorySchema = new mongoose.Schema({
  asset: {
    assetid: String,
    name: String,
    serialno: String,
  },
  fromUser: {
    id: String,
    name: String,
    email: String,
    department: String,
  },
  toUser: {
    id: String,
    name: String,
    email: String,
    department: String,
  },

  dateTransfered: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TransferHistory', transferHistorySchema);

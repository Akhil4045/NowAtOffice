const mongoose = require("mongoose");


const minutes = new mongoose.Schema({
  resv_id: { type: mongoose.Schema.Types.ObjectId, ref: "reservation" },
  minutes_note: { type: String },
});

module.exports = mongoose.model("meetingminutes", minutes);

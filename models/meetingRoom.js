const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  room_id: { type: String, required: true },
  room_name: { type: String, required: true, maxlength: 100 },
  room_capacity: { type: Number, required: true },
  room_status: { type: Boolean },
  room_note: {type: String},
  room_image: {type: String}
});

module.exports = mongoose.model("meetingRooms", meetingSchema);

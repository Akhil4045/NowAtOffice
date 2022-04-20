const mongoose = require("mongoose");

const reservation = new mongoose.Schema(
    {
        room_id : {type : String, required : true },
        res_emp : {type : String , required : true},
        res_start : {type : Date, required  :true},
        res_end : {type : Date, required : true},
        res_agenda : {type : String , required : true},
        res_members : [{type : String, required : true}]
    }
)

module.exports = mongoose.model("reservation", reservation);
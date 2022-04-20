const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = process.env.port || 8081;
const mongoDB = "mongodb://localhost:27017/nowatoffice";
const MeetingRooms = require("./models/meetingRoom");
const employees = require("./models/employee");
const reservation = require("./models/reservation");
const meetminutes = require("./models/meetingminutes");
const { set } = require("express/lib/application");

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use("/public",express.static(__dirname+"/views/public"));
app.use("/css/tailwind",express.static(__dirname+"/node_modules/tailwindcss/dist"));

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connection success");
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));


app.get("/", (req, res) => {
  db.collection("meetingrooms").find({ room_status: true }).toArray((err, result) => {
    let roomIds = result.map
    const unique = [...new Set(result.map(item => item.room_id))];
    db.collection("reservations").find({room_id: { $in : unique}, res_start: { $gt: new Date() } } ).toArray((err, results) => {
      if (err) throw err;
      res.render("status.ejs", { rooms: result, reservation: results });
    });
  });
  
});

app.get("/booking", (req, res) => {
  db.collection("meetingrooms").find({}).toArray((err, result) => {
      res.render("booking.ejs", { rooms: result });
  });
});

app.get("/addRooms", (req, res) => {
  db.collection("meetingrooms").find({}).toArray((err, result) => {
      res.render("addRoom.ejs", { rooms: result });
  });
});

app.post("/roomDetails", (req, res) => {
  db.collection("meetingrooms").find({ room_status: true }).toArray((err, rooms) => {
    db.collection("employees").find({}).toArray((er, emps) => {
      db.collection("reservations").find({ res_start: {$gt: new Date(new Date().setHours(0,0,0,0)) } }).toArray((e, resv) => {
        res.json({ rooms: (rooms? rooms: []), employees: (emps? emps: []), resverations: (resv? resv: []) });
      });
    });
  });
});

app.post("/rooms/add", async (req, res) => {
  const { room_id, room_name, room_capacity, room_status, room_note, room_image } = req && req.body;
  try {
    const room = new MeetingRooms({ room_id, room_name, room_capacity, room_status, room_note, room_image });
    await room.save();
    res.send("success"); 
  } catch (ex) {
    console.log(ex);
    res.send("error");
  }
});

app.post("/employees/add", async (req, res) => {
  const { emp_id, emp_name, emp_desg, emp_team } = req && req.body;
  try {
    const employee = new employees({ emp_id, emp_name, emp_desg, emp_team });
    await employee.save();
    res.send("send");
  } catch (ex) {
    console.log(ex);
    res.send("error");
  }
});

app.post("/reservation/add", async (req, res) => {
  const { room_id, res_emp, res_start, res_end, res_agenda, res_members } = req && req.body;
  try {
    const reserve = new reservation({
      room_id,
      res_emp,
      res_start,
      res_end,
      res_agenda,
      res_members,
    });
    await reserve.save();
    db.collection("reservations").find({ res_start: {$gt: new Date(new Date().setHours(0,0,0,0)) } }).toArray((e, resv) => {
      res.json({ resverations: (resv? resv: []) });
    });
  } catch (ex) {
    console.log(ex);
    res.send("error");
  }
});

app.post("/minutes/add", async(req,res)=>{
  console.log("hi");
  const { resv_id, minutes_note} =
    req && req.body;
  try {
    const minutes = new meetminutes({
      resv_id,
      minutes_note
    });
    await minutes.save();
    res.send("saved");
  } catch (ex) {
    console.log(ex);
    res.send("error");
  }
})

app.get("*", (req, res) => {
  res.render("sample.ejs");
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});

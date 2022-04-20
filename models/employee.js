const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    emp_id: {type: String, required: true},
    emp_name: {type: String, required: true, maxlength: 100},
    emp_desg: {type: String, required: true, maxlength: 100},
    emp_team: {type: String, required: true, maxlength: 100}
});

module.exports = mongoose.model('employees', employeeSchema);
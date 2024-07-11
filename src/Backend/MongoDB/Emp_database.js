const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/EmployeeData', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const EmployeeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    contact: {type: String, required: true},
    department: {type: String, required: true}
})

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = {Employee, db};
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/EmployeeData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },  
  contact: { type: String, required: true },
  department: { type: String, required: true },
  submittedByEmail: { type: String, required: true}
});

const Employee = mongoose.model('Employee', employeeSchema);

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new employee
app.post('/employees', async (req, res) => {
  const newEmployeeData = {
    ...req.body,
    submittedByEmail: req.body.submittedByEmail, 
  };
  console.log('New Employee Data:', newEmployeeData); 
  const newEmployee = new Employee(newEmployeeData);
  try {
    await newEmployee.save();
    res.status(201).send(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(400).send(error);
  }
});

// Update an existing employee
app.put('/employees/:id', async (req, res) => {
  console.log('Update Request Data:', req.body); 
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body, submittedByEmail: req.body.submittedByEmail },
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).send();
    }
    res.send(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(400).send(error);
  }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).send();
    }
    res.send(deletedEmployee);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

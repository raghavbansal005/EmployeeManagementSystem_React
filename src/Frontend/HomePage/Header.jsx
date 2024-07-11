import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import "./Header.css";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import {Modal, Box, TextField, Button, InputLabel, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent,DialogContentText, DialogActions} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import team from "../Assets/team.png";
import upload from "../Assets/upload.jpg"
import { useLocation } from "react-router-dom";

const EmployeeForm = ({ open, onSave, onClose, initialValues, employees = [], editingIndex, submittedByEmail }) => {
  const validate = (values) => {
    let errors = {};
    if (!values.name) {
      errors.name = "Required!";
    } else if (!/^[a-zA-Z\s]+$/.test(values.name)) {
      errors.name = "Name must only contain letters.";
    }
    if (!values.email) {
      errors.email = "Required!";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = "Invalid email format";
    } else if (
      employees.some(
        (employee, index) =>
          employee.email.toLowerCase() === values.email.toLowerCase() && index !== editingIndex
      )
    ) {
      errors.email = "Email must be unique";
    }
    if (!values.contact) {
      errors.contact = "Required!";
    } else if (!/^\d{10,12}$/.test(values.contact)) {
      errors.contact = "Contact number must be 10-12 digits and No letters";
    } else if (
      employees.some(
        (employee) => employee.contact === values.contact && employees.indexOf(employee) !== editingIndex
      )
    ) {
      errors.contact = "Contact number must be unique";
    }
    if (!values.department) {
      errors.department = "Required!";
    }
    return errors;
  };

  const onSubmit = (values) => {
    const employeeData = {
      ...values,
      submittedByEmail: submittedByEmail,
    };
    console.log("Saving Employee Data:", employeeData);
    onSave(employeeData);
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit,
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          backgroundColor: "white",
          border: "2px solid #000",
          borderRadius: 4,
          boxShadow: 30,
        }}
      >
        <Typography variant="h4" textAlign="center" marginTop={2} textTransform={"capitalize"}>
          Employee Form
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box>
            <InputLabel>Name: </InputLabel>
            <TextField
              fullWidth
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Box>

          <Box>
            <InputLabel>Email: </InputLabel>
            <TextField
              fullWidth
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>

          <Box>
            <InputLabel>Contact: </InputLabel>
            <TextField
              fullWidth
              type="tel"
              id="contact"
              name="contact"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.contact}
              error={formik.touched.contact && Boolean(formik.errors.contact)}
              helperText={formik.touched.contact && formik.errors.contact}
            />
          </Box>

          <Box>
            <InputLabel>Department:</InputLabel>
            <TextField
              fullWidth
              type="text"
              id="department"
              name="department"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.department}
              error={formik.touched.department && Boolean(formik.errors.department)}
              helperText={formik.touched.department && formik.errors.department}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
              gap: 2,
            }}
          >
            <Button variant="contained" onClick={formik.handleSubmit}>
              Submit
            </Button>
            <Button variant="contained" onClick={onClose}>
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

const Header = () => {
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen]= useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const submittedByEmail = location.state?.email || "";
  const inputRef = useRef(null);
  const [image, setImage]= useState("");
  const submittedByUsername = location.state?.username || "";

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3001/employees");
        setEmployees(response.data);
      } catch (error) {
        console.log("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddClick = () => {
    setShowForm(true);
    setEditingIndex(null);
  };

  const handleSave = async (employeeData) => {
    try {
      if (editingIndex !== null) {
        const response = await axios.put(
          `http://localhost:3001/employees/${employees[editingIndex]._id}`,
          {
            ...employeeData,
            submittedByEmail: submittedByEmail,
            submittedByUsername: submittedByUsername,
          }
        );
        const updatedEmployees = employees.map((employee, index) =>
          index === editingIndex ? response.data : employee
        );
        setEmployees(updatedEmployees);
        setSnackbarMessage("Employee Updated Successfully");
      } else {
        const response = await axios.post("http://localhost:3001/employees", {
          ...employeeData,
          submittedByEmail: submittedByEmail,
          submittedByUsername: submittedByUsername,
        });
        setEmployees([...employees, response.data]);
        setSnackbarMessage("Employee Added Successfully");
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      setSnackbarMessage("Error Saving Employee");
    }
    setShowForm(false);
    setSnackbarOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/employees/${employees[deleteIndex]._id}`);
      const newEmployees = employees.filter((_, index) => index !== deleteIndex);
      setEmployees(newEmployees);
      setSnackbarMessage("Employee Deleted Successfully");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error deleting employee:", error);
      setSnackbarMessage("Error Deleting Employee");
      setSnackbarSeverity("error");
    }
    setDeleteDialogOpen(false);
    setSnackbarOpen(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(false);
    console.log("User logged out");
    navigate("/login-signup");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const CustomNoRowsOverlay = () => (
    <GridOverlay>
      <div style={{ padding: "15px", textAlign: "center" }}>No Record Found</div>
    </GridOverlay>
  );

  const handleRowClick = (params) => {
    setSelectedEmployee(params.row);
    setDetailsDialogOpen(true);
  };

  const handleImageClick = () =>{
    inputRef.current.click();
  }

  const handleImageChange = (event) =>{
    const file = event.target.files;
    console.log(file);
    setImage(event.target.files[0]);
  }

  const columns = [
    { field: "name", headerName: "Name", width: 150, renderCell: (params) => (
      <div
        onClick={() => handleRowClick(params)}
        style={{ cursor: "pointer" }}>
        {params.value}
      </div>
    )},
    { field: "email", headerName: "Email", width: 200 },
    { field: "contact", headerName: "Contact", width: 150 },
    { field: "department", headerName: "Department", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <button
            className="buttons"
            onClick={() => handleEdit(params.id)}
            style={{
              backgroundColor: "green",
              color: "white",
              marginRight: "8px",
            }}
          >
            Update
          </button>
          <button
            className="buttons"
            onClick={() => handleDelete(params.id)}
            style={{ backgroundColor: "red", color: "white" }}>
            Delete
          </button>
        </>
      ),
    },
  ];

  const rows = employees.map((employee, index) => ({ id: index, ...employee }));

  return (
    <div>
      <header>
        <a href="#">
          <img src={team} alt="logo" />
        </a>
        <h1>Employee Data</h1>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="data">
        <h1>Welcome,{submittedByUsername}!</h1>
        <button onClick={handleAddClick}>Add New</button>
      </div>

      {showForm && (
        <EmployeeForm
          open={showForm}
          onSave={handleSave}
          onClose={handleCloseForm}
          initialValues={
            editingIndex !== null
              ? employees[editingIndex]
              : { name: "", email: "", contact: "", department: "" }
          }
          employees={employees}
          editingIndex={editingIndex}
          submittedByEmail={submittedByEmail}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)}>
        <DialogTitle  sx={{textAlign: "center"}}>Employee Details</DialogTitle>
        <DialogContent >
          {selectedEmployee && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}>
          <div onClick={handleImageClick}>
            {image ? (<img 
              src={URL.createObjectURL(image)}
              alt="Employee"
              style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px'}}
            /> ):(
             <img 
                src={upload}
                alt="Employee"
                style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px'}}
             />
              )}
            <input type="file" ref={inputRef} onChange={handleImageChange} style={{display: 'none'}} />
          </div>
          <DialogContentText
           sx={{
            top: "50%",
            left: "50%",
            width: 500,
            height: 250,
            backgroundColor: "white",
            border: "2px solid #000",
            borderRadius: 4,
            boxShadow: 30,
            textAlign: "center",
            color: "black",
           }}
           >
            <strong>Name:</strong> {selectedEmployee?.name}
            <br />
            <strong>Email: </strong>{selectedEmployee?.email}
            <br />
            <strong>Contact:</strong> {selectedEmployee?.contact}
            <br />
            <strong>Department:</strong> {selectedEmployee?.department}
          </DialogContentText>
          </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary" >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={logoutDialogOpen} onClose={handleCloseLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <div className="tableContainer">
        <div className="table">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            autoHeight
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
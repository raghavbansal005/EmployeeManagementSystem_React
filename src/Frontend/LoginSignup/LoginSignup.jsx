import React, { useState } from "react";
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert'

import person from '../Assets/person.png';
import tel from '../Assets/tel.png';
import email from '../Assets/email.png';
import password from '../Assets/password.png';

const Alert = React.forwardRef(function Alert(props, ref){
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const LoginSignup = () => {
    const [currentPage, setCurrentPage] = useState('login');
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage]= useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
    const [loggedInEmail, setLoggedInEmail] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        let errors = {};
        if (currentPage === 'signup') {
            if (!formData.username) {
                errors.username = "Name is required";
            } else if (!/^[a-zA-Z]+$/.test(formData.username)) {
                errors.username = "Name can only contain letters";
            }
            if (!formData.tel) {
                errors.tel = "Phone number is required";
            } else if (!/^\d{10,12}$/.test(formData.tel)) {
                errors.tel = "Phone number must be 10 to 12 digits";
            }
            if (!formData.confirmPassword) {
                errors.confirmPassword = "Confirm Password is required";
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }
        }
        if (!formData.email) {
            errors.email = "Email ID is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
            errors.email = "Email ID is invalid";
        }
        if (!formData.password) {
            errors.password = "Password is required";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (isValid) {
          try {
            if (currentPage === 'signup') {
              await axios.post("http://localhost:3000/signup", formData);
              console.log("Signup successful", formData);
              setSnackbarMessage("Sign up successfully! Please login");
              setSnackbarSeverity('success');
              setOpenSnackbar(true);
              setCurrentPage('login');
              setFormData({});
            } else {
              const response = await axios.post("http://localhost:3000/login", formData);
              console.log("Login successful", response.data);
              setLoggedInEmail(formData.email); 
              setSnackbarMessage("Login Successful!");
              setSnackbarSeverity("success");
              setOpenSnackbar(true);
              navigate('/header', { state: { email: formData.email } }); 
            }
          } catch (error) {
            console.error("Error submitting form", error);
            setSnackbarMessage("User Already Exist!");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          }
        } else {
          console.log("Form is invalid.");
        }
      };

    const handleData = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const switchPage = (page) => {
        setCurrentPage(page);
        setFormData({});
        setErrors({});
    };

    const handleCloseSnackbar = () =>{
        setOpenSnackbar(false);
    }

    return (
        <div className="container">
            <div className="header">
                <div className="text" style={{ color: "white", fontSize: 50 }}>
                    {currentPage === 'signup' ? 'Sign Up' : 'Log In'}
                </div>
                {loggedInEmail && (
                    <div className="logged-in-email">
                        Logged in as: {loggedInEmail}
                    </div>
                )}
            </div>
            <form onSubmit={submitForm}>
                <div className="inputs">
                    {currentPage === 'signup' ? (
                        <>
                            <div className="input">
                                <img src={person} alt="user" />
                                <input type="text" name="username" value={formData.username || ''} placeholder="Enter your Name" onChange={handleData} />
                                {errors.username && <span className="error">{errors.username}</span>}
                            </div>
                            <div className="input">
                                <img src={tel} alt="tel" />
                                <input type="tel" name="tel" value={formData.tel || ''} placeholder="Enter your Phone Number" onChange={handleData} />
                                {errors.tel && <span className="error">{errors.tel}</span>}
                            </div>
                        </>
                    ) : null}
                    <div className="input">
                        <img src={email} alt="email" />
                        <input type="email" name="email" value={formData.email || ''} placeholder="Enter your Email ID" onChange={handleData} />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="input">
                        <img src={password} alt="password" />
                        <input type="password" name="password" value={formData.password || ''} placeholder="Enter your Password" onChange={handleData} />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    {currentPage === 'signup' ? (
                        <div className="input">
                            <img src={password} alt="password" />
                            <input type="password" name="confirmPassword" value={formData.confirmPassword || ''} placeholder="Confirm your Password" onChange={handleData} />
                            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                        </div>
                    ) : null}
                </div>
                <div className="submit1">
                    <button type="submit">{currentPage === 'signup' ? 'Sign Up' : 'Log In'}</button>
                </div>
                <div className="submit-container">
                    <div className="submit">
                        {currentPage === 'signup' ? (
                            <>
                                Already have an account? {" "}
                                <a href="#" onClick={() => switchPage('login')}>Log In</a>
                            </>
                        ) : (
                            <>
                                Don't have an account yet? {" "}
                                <a href="#" onClick={() => switchPage('signup')}>Sign Up</a>
                            </>
                        )}
                    </div>
                </div>
            </form>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default LoginSignup;
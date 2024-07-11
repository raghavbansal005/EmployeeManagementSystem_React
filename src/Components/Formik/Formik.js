import React from "react";
import { Form, useFormik } from "formik";
import './Formik.css';
import * as Yup from 'yup';

const initialValues = {
    name: "",
    email: "",
    contact: "",
    department: "",
}

const onSubmit = values => {
    console.log('Form data', values)
}

const validate = values =>{
    let errors = {}

    if(!values.name){
        errors.name = 'Required!'
    }
    if(!values.email){
        errors.name = 'Required!'
    }
    else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invaid email format'
    }
    if(!values.contact){
        errors.name = 'Required!'
    }
    if(!values.department){
        errors.name = 'Required!'
    }
    return errors
}

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invaild email format').required('Required'),
  contact: Yup.string().required('Required'),
  department: Yup.string().required('Required')
})

function Formik() {
  const formik = useFormik({
    initialValues ,
    onSubmit ,
    validate 
    // validationSchema
  });

  console.log('Visited fields: ', formik.touched)

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>

        <div className="form-control">
            <label>Name</label>
            <input
            type="text"
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            />
            { formik.touched.name && formik.errors.name ? (
              <div className="error">{formik.errors.name}</div>
            ) :null}
        <br />
        </div>

        <div className="form-control">
            <label>Email</label>
            <input
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            />
            { formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div> 
            ) :null}
            <br />
        </div>

        <div className="form-control">
        <label>Contact</label>
        <input
          type="tel"
          id="contact"
          name="contact"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.contact}
        />
        { formik.touched.contact && formik.errors.contact ? ( 
          <div className="error">{formik.errors.contact}</div>
        ) :null}
        </div>

        <div className="form-control">
        <br />
        <label>Department</label>
        <input
          type="text"
          id="department"
          name="department"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.department}
        />
        {formik.touched.department && formik.errors.department ? (
          <div className="error">{formik.errors.department}</div>
        ) :null}
        <br />
        </div>

        <button>Submit</button>
      </form>
    </div>
  );
}

export default Formik;

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../Styling/form.css";
import "../Styling/nav.css";
import libraryBg from "../Images/bgSignUp4.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";

export function SignUpComponent() {

  const auth=useAuth();
  const navigate=useNavigate();
  
  function handleSignUp(values){
    try{
      const user={
            username:values.username,
            email: values.email,
            phone: values.phone,
            address: values.address,
            age:values.age,
            password:values.password
        }
      let response=auth.signup(user);
      console.log("Registered Successfully");
      if(response) navigate(`/login`)
    }   
    catch(error){ 
      console.log(error);
    }
  }

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),

    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required"),

    age: Yup.number()
      .typeError("Age must be a number")
      .min(12, "Age must be at least 12")
      .max(100, "Age must be below 100")
      .required("Age is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    
    confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  });

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage: `url(${libraryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Formik
        initialValues={{
          username: "",
          email: "",
          phone: "",
          address: "",
          age: "",
          password: "",
          confirmpassword:""
        }}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values) => {
          console.log(values);
          const user={
            username:values.username,
            email: values.email,
            phone: values.phone,
            address: values.address,
            age:values.age,
            password:values.password
          }
          handleSignUp(values);
        }}
      >
        {() => (
          <div className="form-container">
            <Form className="form-box signup-box">
              <h2 className="form-title">Sign Up</h2>
              <p className="form-subtitle">
                Access your collection of literary treasures
              </p>

              {/* Username + Email */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Reader's Name</label>
                  <Field type="text" name="username" className="form-input" placeholder="eg readerWizard" />
                  <ErrorMessage name="username" component="div" className="error" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Reader's Email</label>
                  <Field type="email" name="email" className="form-input" placeholder="eg abc@gmail.com" />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>
              </div>

              {/* Phone + Address */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Reader's Phone No.</label>
                  <Field type="text" name="phone" className="form-input" placeholder="825 XXXX XXX" />
                  <ErrorMessage name="phone" component="div" className="error" />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Reader's Address</label>
                  <Field type="text" name="address" className="form-input" placeholder="Hogwarts" />
                  <ErrorMessage name="address" component="div" className="error" />
                </div>
              </div>

              {/* Age + Password */}
              <div className="form-row">
                
                <div className="form-group">
                  <label htmlFor="password">Reader Secret</label>
                  <Field type="password" name="password" className="form-input" placeholder="Enter your password" />
                  <ErrorMessage name="password" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Reader's Age</label>
                  <Field type="text" name="age" className="form-input" placeholder="18"/>
                  <ErrorMessage name="age" component="div" className="error" />
                </div>           
              </div>

              {/* confirm password*/}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Reader's Secret</label>
                        <Field type="password" name="confirmpassword" className="form-input" placeholder="Confirm your password" />
                        <ErrorMessage name="confirmpassword" component="div" className="error" />
                    </div>
                </div>

              {/* Submit Button */}
              <button type="submit" className="form-btn m-1">Sign Up!</button>
               <div>
                <p className="form-subtitle m-0">Already a Reader??</p>
                <Link to="/login" className="nav-link" style={{color:"white"}}>Log in</Link>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}

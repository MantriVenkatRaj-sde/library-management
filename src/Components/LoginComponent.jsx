import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../Styling/form.css";
import "../Styling/nav.css";
import libraryBg from "../Images/bg2.png";
import { Link } from "react-router-dom";


export function LoginComponent() {
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
     <div
      className="login-container"
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
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {() => (
          <div className="form-container">
            <Form className="form-box">
              <h2 className="form-title">Sign In</h2>
              <p className="form-subtitle">Access your collection of literary treasures</p>

              {/* Username */}
              <div className="form-group">
                <label htmlFor="username">Reader Name</label>
                <Field type="text" name="username" id="username" className="form-input" />
                <ErrorMessage name="username" component="div" className="error" />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Reader Secret</label>
                <Field type="password" name="password" id="password" className="form-input" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <button type="submit" className="form-btn m-b-1">Log in!</button>
              <div>
                <p className="form-subtitle m-0 ">New Reader?</p>
                <Link to="/signup" className="nav-link" style={{color:"white"}}>Sign up</Link>
              </div>
             
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../Styling/form.css";
import "../Styling/nav.css";
import libraryBg from "../Images/bg2.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";
import { useState } from "react";
import { getAllGenres } from "../API/GenreAPI";
import { useGenres } from "../Contexts/GenreContext";
import { useMembership } from "../Contexts/MembershipContext";
import { getUserMembershipApi } from "../API/membershipAPI";


export function LoginComponent() {
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const auth=useAuth();
  const [authenticated,setAuthenticated]=useState(false);
  const navigate=useNavigate();
  const [message,setMessage]=useState("");
  const {genres,setGenres}=useGenres();
  const {memberships, setMemberships} = useMembership(); 
  

 async function handleLogin(values) {
  try {
    const result = await auth.login(values.username, values.password);
    setAuthenticated(result);

    if (!result) {
      console.log("User not authenticated");
      setMessage("New Reader? Create an account ! Sign Up !");
      navigate("/login");
      return;
    }

    console.log(values);
    console.log("Logged In Successfully");

    try {
      console.log("Before Membership API=> Username  ",auth.user);
      // run in parallel
      const [respGenres, respMemberships] = await Promise.all([
        getAllGenres(),
        // pass username (not the whole user object) unless your API expects the object
        getUserMembershipApi(values.username)
      ]);

      // normalize shapes robustly
      const genres =
        Array.isArray(respGenres?.data) ? respGenres.data :
        Array.isArray(respGenres) ? respGenres :
        Array.isArray(respGenres?.data?.data) ? respGenres.data.data : [];

      const membershipsData =
        Array.isArray(respMemberships?.data) ? respMemberships.data :
        Array.isArray(respMemberships) ? respMemberships :
        Array.isArray(respMemberships?.data?.content) ? respMemberships.data.content : [];

      setGenres(genres);
      setMemberships(membershipsData);

      console.log("Genres loaded:", genres);
      console.log("Membership loaded:", membershipsData);
    } catch (err) {
      console.error("Error in Login Component :", err);
      setGenres([]);
      setMemberships([]);
    }

    navigate("/home");
  } catch (errors) {
    console.log(errors);
  }
}



  return (
     <div
      className="login-container d-flex flex-column"
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
          handleLogin(values)
        }}
      >
        {() => (
          <div className="form-container">
            <Form className="form-box">
              <h2 className="form-title">Sign In</h2>
              <p className="form-subtitle">Access your collection of literary treasures</p>
              {message && <div className="message error">{message}</div>}
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
      <div className="text-light "
      style={{
        bottom:0,
        position:"fixed",
        textAlign:"center",
        padding:"5px"
      }}>*Already a user? Facing difficulty while Signing in? Try again after reloading the page...</div>
    </div>
  );
}

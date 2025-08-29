import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../Styling/form.css";


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

            <button type="submit" className="form-btn">Submit</button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

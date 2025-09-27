import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserMembershipApi } from "../API/membershipAPI";
import { useAuth } from "../Authentication/AuthContext";
import { FaPlus } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../Styling/Background.css";
import "../Styling/Tile.css";
import { createClubApi } from "../API/BookClubAPI";
import { toast } from "react-toastify";

export function ClubList() {
  const navigate = useNavigate();
  const auth = useAuth();
  const username = auth.user;
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [add, setAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!username) return;

    setLoading(true);
    getUserMembershipApi(username)
      .then((response) => {
        if (mounted) {
          console.log("Membership Data : ", response.data);
          setClubs(response.data || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching membership data : ", error);
        if (mounted) setClubs([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [username,add]);

  const handleAddClub = (values) => {
    console.log("Adding a club with details:", values);
    createClubApi(values)
    .then((response)=>{
      console.log("Club creation response : ",response);
      toast.success("Club created successfully");
    })
    .catch((err)=>{
      console.log(err);
    })
  };

  return (
    <div className="component d-flex flex-column">
      <h2 className="text-light fs-1 fw-bold">Your Book Clubs</h2>

      <div
        className="d-flex flex-column"
        style={{
          gap: "30px",
          width: "calc(100% - 10px)",
          minHeight: "100vh",
          background: "rgba(31, 16, 16, 0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "12px",
          padding: "12px",
        }}
      >
        {loading ? (
          <div className="text-light fw-bold">Loading your Clubs...</div>
        ) : (
          <div className="text-light">
            {clubs && clubs.length ? (
              clubs.map((club, i) => (
                <div
                  key={club.id}
                  className="tile-bg bg-dark fs-4 mt-2 py-10 px-3 d-flex justify-content-between align-items-center"
                  style={{
                    width: "calc(100% - 10px)",
                    transition: "transform 0.2s",
                    borderColor: "black",
                    borderRadius: "5px",
                    height: "100px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={() => {
                    navigate(
                      `/clubs/${club.id}/${encodeURIComponent(club.name)}/chat`
                    );
                    console.log("Clubname : ", club.name);
                    console.log("Clubid : ", club.id);
                  }}
                >
                  <span className="flex-start">
                    {i + 1}. {club.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-light">No Clubs joined yet...</div>
            )}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setAdd(true)}
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 2000,
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffc107",
          color: "#000",
          fontSize: "24px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          transition: "transform 0.4s",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(1.5)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <FaPlus />
      </button>

      {/* Popup Form */}
      {add && (
          <div className="d-flex justify-content-center align-items-center w-100"
          style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.6)",  // semi-transparent black
                backdropFilter: "blur(6px)",         // <-- blur effect
                WebkitBackdropFilter: "blur(6px)",   // Safari support
                zIndex: 1500,                        // on top of everything
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
          }}>
                <div
                  className="tile-bg text-light fs-5 justify-content-center align-items-center"
                  style={{
                    position: "fixed",
                    left:"50%",
                    top:"50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2000,
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "12px",
                    width: "90%",

                    background: "#222",
                    boxShadow: "0 4px 8px rgba(124, 32, 32, 0.38)",
                  }}
                >
                  <h4 className="mb-3">Add Club Details</h4>

                  <Formik
          initialValues={{
            name: "",
            description: "",
            visibility: "PUBLIC",
            admin: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
            description: Yup.string().required("Required"),
            visibility: Yup.string().required("Required"),
            admin: Yup.string().required("Required"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            handleAddClub(values);
            setSubmitting(false);
            resetForm();
            setAdd(false); // ✅ close popup after submit
          }}
        >
          {({ isSubmitting, submitCount }) => (
            <Form>
              <div className="mb-3 text-light bg-dark">
                <label className="form-label">Club Name</label>
                <Field className="form-control bg-secondary text-light" name="name" />
                {submitCount > 0 && (
                  <ErrorMessage name="name" component="div" className="text-danger" />
                )}
              </div>

              <div className="mb-3">
                <label className="form-label ">Description</label>
                <Field as="textarea" className="form-control bg-secondary text-light" rows="3" name="description" />
                {submitCount > 0 && (
                  <ErrorMessage name="description" component="div" className="text-danger" />
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Visibility</label>
                <Field as="select" className="form-select bg-secondary text-light" name="visibility">
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </Field>
                {submitCount > 0 && (
                  <ErrorMessage name="visibility" component="div" className="text-danger" />
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Admin</label>
                <Field className="form-control bg-secondary text-light" name="admin" />
                {submitCount > 0 && (
                  <ErrorMessage name="admin" component="div" className="text-danger" />
                )}
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setAdd(false)} // ✅ Close without posting
                >
                  Close
                </button>
                <button

                  type="submit"
                  className="btn btn-warning"
                  disabled={isSubmitting || submitting}
                  onClick={handleAddClub}
                >
                  {isSubmitting || submitting ? "Creating…" : "Create Club"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        </div>
          </div>
      )}
    </div>
  );
}

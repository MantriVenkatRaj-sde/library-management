import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/AuthContext";
import { getUserDetails } from "../API/userAPI";
import "../Styling/Background.css";
import "../Styling/Tile.css";
import TeamLeader from "../TempDemoImages/img2.jpeg";
import { useParams } from "react-router-dom";

export function ProfileComponent() {
  const auth = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const {username}=useParams();

  useEffect(() => {
    if (!auth.user) return;
    setLoading(true);
    getUserDetails(username)
      .then((response) => setUserDetails(response.data))
      .catch((err) => console.error("Error fetching user details:", err))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="w-100 d-flex justify-content-center align-items-center vh-100">
        <span className="text-light fs-3">Loading profile...</span>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="w-100 d-flex justify-content-center align-items-center vh-100">
        <span className="text-danger fs-3">No profile data found</span>
      </div>
    );
  }

  return (
    <div className=" w-100 vh-100 d-flex flex-column justify-content-center align-items-center py-5 component">
      {/* Profile Image */}
      <div className="mb-4 text-center">
        <img
          src={TeamLeader || "https://via.placeholder.com/220"} // fallback
          alt={`${userDetails?.username}'s avatar`}
          className="shadow"
          style={{
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid #28a74580",
          }}
          loading="lazy"
        />
      </div>

      {/* Username */}
      <h2 className="text-light mb-4">{userDetails?.username}</h2>

      {/* Details Card */}
      <div
        className="card bg-dark text-light shadow-lg"
        style={{ minWidth: "320px", borderRadius: "1rem" }}
      >
        <div className="card-body">
          <div className="mb-3">
            <span className="fw-bold me-2">Age:</span>
            <span className="text-success">{userDetails?.age}</span>
          </div>
          <div className="mb-3">
            <span className="fw-bold me-2">E-Mail:</span>
            <span className="text-success">{userDetails?.email}</span>
          </div>
          <div className="mb-3">
            <span className="fw-bold me-2">Phone:</span>
            <span className="text-success">{userDetails?.phone}</span>
          </div>
        </div>
      </div>

     
    </div>
  );
}

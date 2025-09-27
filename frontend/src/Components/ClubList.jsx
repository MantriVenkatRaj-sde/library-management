import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserMembershipApi } from "../API/membershipAPI";
import { useAuth } from "../Authentication/AuthContext";
import "../Styling/Background.css";
import "../Styling/Tile.css";

export function ClubList() {
  const navigate = useNavigate();
  const auth = useAuth();
  const username = auth.user;
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [username]);

  return (
    <div className="component d-flex flex-column">
      <h2 className="text-light fs-1 fw-bold">Your Book Clubs</h2>

      <div
        className="d-flex flex-column"
        style={{
          gap: "30px",
          width: "calc(100% - 10px)",      
          minHeight: "100vh",
          background: "rgba(31, 16, 16, 0.10)", // ✅ transparent overlay
          backdropFilter: "blur(12px)",         // ✅ blur background
          WebkitBackdropFilter: "blur(12px)",   // ✅ Safari
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
              clubs.map((club,i) => (
                <div
                  key={club.id} 
                  className="tile-bg bg-dark fs-4 mt-2 py-10 px-3 d-flex justify-content-between align-items-center"
                  style={{ width: "calc(100% - 10px)",
                    transition: "transform 0.2s",
                    borderColor:"black",
                    borderRadius:"5px" ,
                    height:"100px"}}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onClick={() => {navigate(`/clubs/${club.id}/${encodeURIComponent(club.name)}/chat`)
                        console.log("Clubname : ",club.name)
                        console.log("Clubid : ",club.id)}}
                >
                    <span className="flex-start">{i+1}.    {club.name}</span>
                  
                </div>
              ))
            ) : (
              <div className="text-light">No Clubs joined yet...</div>
            )}
          </div> 
        )}
      </div>
    </div>
  );
}

import { use, useEffect, useState } from "react";
import "../Styling/Background.css";
import "../Styling/Icon.css";
import "../Styling/Tile.css";
import { useNavigate, useParams } from "react-router-dom";
import { getClubApi, joinClubApi } from "../API/BookClubAPI";
import BookClubGeneralLogo from "../Images/ClubIconGeneral.jpg";
import { useAuth } from "../Authentication/AuthContext";
import { FaUserPlus } from 'react-icons/fa';
import { toast } from "react-toastify";
import { FaUserCheck } from 'react-icons/fa';
import { MdMessage, MdOutlineMessage, MdChat } from "react-icons/md";

export function BookClub() {
  const { clubId, clubname } = useParams();
  const [clubDetails, setClubDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(null);
  const [isMember,setIsMember]=useState(false);
  const [NumMember,setNumMember]=useState(1);
  const auth=useAuth();
  
    // derive year when clubDetails arrives
  useEffect(() => {
    if (!clubDetails?.createdAt) {
      setYear(null);
      return;
    }
    const d = new Date(clubDetails.createdAt);
    setYear(isNaN(d) ? null : d.getUTCFullYear()); // use getFullYear() if you prefer local year
  }, [clubDetails]);

  // formatted created date (optional)
  const createdDateString = (() => {
    if (!clubDetails?.createdAt) return "";
    const d = new Date(clubDetails.createdAt);
    if (isNaN(d)) return "";
    // e.g. "Sep 25, 2025, 13:50 UTC"
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });
  })();


  useEffect(() => {
    if (!clubname) return;
    let mounted = true;
    setLoading(true);
    console.log('clubname',clubname)
    getClubApi(clubname,auth.user)
      .then((response) => {
        if (mounted) {
          setClubDetails(response.data);
          console.log("Club Details : ", response.data);
          setIsMember(clubDetails?.member??'false')
          console.log("Is Member : ", isMember);
          setNumMember(clubDetails?.numOfMembers??1)
          console.log("Number of Members : ", NumMember);
        }
      })
      .catch((error) => {
        console.error(error);
        if (mounted) setClubDetails(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [clubname,isMember,NumMember]);

  function joinOrRequestClub(clubname, username) {
    if(isMember){
      toast.info("You are already a member of this club");
      return;
    }
    if ((clubDetails?.visibility ?? "PUBLIC") === "PUBLIC") {
      
      joinClubApi(clubname, username)
        .then((response) => {
          toast.success(response.data);
          setIsMember(true);
          setClubDetails((prev) =>
            prev ? { ...prev, numOfMembers: (prev.numOfMembers ?? 0) + 1 } : prev
          );
        })
        .catch((error) => {
          console.error(error);
          toast.error(error?.response?.data || "Failed to join");
        })
        
    } else {
      toast.info("Request to join sent to admin");
    }
  }
  const navigate=useNavigate();
  function ClubChat(clubId,clubname, username) {
    navigate(`/clubs/${clubId}/${encodeURI(clubname)}/chat`)
  }


  return (
    <div className="component">
        <div
            className="d-flex my-container bg-dark tile-container-bg"
            style={{
            minWidth: "calc(100% - 20px)",
            
            }}
        >
            <div className="d-flex justify-content-center align-items-center" style={{width:"100%"}}>
                <div className="d-flex flex-column club-header align-items-center" style={{borderRadius:"50%"}}>
                    <img
                    src={BookClubGeneralLogo}
                    alt="Book club logo"
                    style={{width:"25%", height:"25%", objectFit:"cover"}}
                    className="club-logo bg-dark"
                    loading="lazy"
                    />

                    {loading ? (
                            <h1 className="text-light fs-1 fw-bold">Loading.....</h1>
                        ) : (
                            <h1 className="text-light fs-1 fw-bold mb-10">{clubname ? decodeURIComponent(clubname) : "Club"}</h1>
                        )}

                    </div>
            </div>
            
            <div className="d-flex flex-start flex-column">
                <div className="d-flex mb-2 fs-5">
                    <span className="fw-bold text-light me-2">About :</span>
                    <span className="text-info">{clubDetails?.description ?? "—"}</span>
                </div>

                <div className="d-flex mb-2 fs-5">
                    <span className="fw-bold text-light me-2">Admin :</span>
                    <span className="text-info">{clubDetails?.admin ?? "—"}</span>
                </div>

                <div className="d-flex mb-2 fs-5">
                    <span className="fw-bold text-light me-2">Created at :</span>
                    <span className="text-info">
                        {year ? ` (${year})` : "-"}
                    </span>
                </div>

                <div className="d-flex mb-2 fs-5">
                    <span className="fw-bold text-light me-2">Visibility :</span>
                    <span className="text-info">{clubDetails?.visibility ?? "—"}</span>
                </div>

                <div className="d-flex mb-2 fs-5">
                    <span className="fw-bold text-light me-2">Number of members :</span>
                    <span className="text-info">{NumMember}</span>
                </div>
            </div>

            <div className="d-flex flex-row w-100 justify-content-end gap-6"  >
              <div className="d-flex mb-2 fs-5 flex-end">
                  
          
                  <div className="d-flex align-items-center justify-content-center  rounded-circle bg-light p-2 align-items-center"
                      style={{width:"40px", height:"40px", border: "3px solid #198754", marginRight:"20px",transition: "transform 0.4s",}}
                      title={(clubDetails?.visibility??'PUBLIC')==='PUBLIC'?"Join":"Request to Join"}
                      onMouseEnter={(e)=>(
                        e.currentTarget.style.transform="scale(1.2)",
                        e.currentTarget.style.boxShadow="0 0 10px #198754"
                      )}
                      onMouseLeave={(e)=>(e.currentTarget.style.transform="scale(1)")}>
                        <button   onClick={() => joinOrRequestClub(clubname, auth.user)}
                          style={{borderRadius:"50%",borderColor:"white",width:"35px", height:"35px"}}
                          className="border m-1">
                            {!isMember && <FaUserPlus size={24} color="green" />}
                            {isMember &&<FaUserCheck size={24} color="green"/>}
                        </button>
                  </div>

                { isMember &&   <div className="d-flex align-items-center justify-content-center  rounded-circle bg-light p-2 align-items-center"
                      style={{width:"40px", height:"40px", border: "3px solid #198754", marginRight:"20px",transition: "transform 0.4s",}}
                      onMouseEnter={(e)=>(
                        e.currentTarget.style.transform="scale(1.1)",
                        e.currentTarget.style.boxShadow="0 0 10px #198754"
                      )}
                      onMouseLeave={(e)=>(e.currentTarget.style.transform="scale(1)")}
                      title="Go to Chat">
                        <button   onClick={() => ClubChat(clubId,clubname, auth.user)}
                          style={{borderRadius:"50%",borderColor:"white",width:"35px", height:"35px"}}
                          className="border m-1">
                             <MdChat size={24} color="green"/> 
                        </button>
                  </div>}
                    
              
              </div>
            </div>

        </div>
    </div>
  );
}

// admin
// : 
// "Raj"
// createdAt
// : 
// "2025-09-25T13:50:39.310736Z"
// description
// : 
// "A chilling group for fans of ghost stories, horror novels, and dark tales."
// id
// : 
// 8
// member
// : 
// true
// name
// : 
// "Horror Maniacs"
// numOfMembers
// : 
// 1
// visibility
// : 
// "PUBLIC"
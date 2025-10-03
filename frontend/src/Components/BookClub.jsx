import { use, useEffect, useState } from "react";
import "../Styling/Background.css";
import "../Styling/Icon.css";
import "../Styling/Tile.css";
import { useNavigate, useParams } from "react-router-dom";
import { deleteClubApi, getClubApi, joinClubApi } from "../API/BookClubAPI";
import BookClubGeneralLogo from "../Images/ClubIconGeneral.jpg";
import { useAuth } from "../Authentication/AuthContext";
import { FaUserPlus } from 'react-icons/fa';
import { toast } from "react-toastify";
import { FaUserCheck } from 'react-icons/fa';
import { MdMessage, MdOutlineMessage, MdChat } from "react-icons/md";
import { deleteUserMembershipApi, getClubMembers } from "../API/membershipAPI";
import { useMembership } from "../Contexts/MembershipContext";
import { FaTimes } from 'react-icons/fa'
import { AiOutlineClose } from "react-icons/ai"
import { FiLogOut, FiTrash2 } from "react-icons/fi";

export function BookClub() {
  const { clubId, clubname } = useParams();
  const [clubDetails, setClubDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(null);
  const [isMember,setIsMember]=useState(false);
  const [NumMember,setNumMember]=useState(1);
  const {memberships,setMemberships, refresh: fetchMemberships}=useMembership();
  const [clickedDelete,setClickedDelete]=useState(false);
  const [clickedLeave,setClickedLeave]=useState(false);
  const [members,setMembers]=useState([]);
  const [clickedMembers,setClickedMembers]=useState(false);
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
  //Leave the club
  async function handleLeaveClub(){
    await deleteUserMembershipApi(auth.user,clubname)
    .then((res)=>{
      console.log("Leave button : ",res.data)
      toast.info("Left the Club");
      setIsMember(false);
    })
    .catch((err)=>{
      console.log(err.data)
      toast.warning("Failed to leave the group");
    })
    await fetchMemberships();
  }

   //Delete the club
  async function handleDeleteClub(){
    await deleteClubApi(clubname,auth.user)
    .then((res)=>{
      console.log("Delete button : ",res.data)
      toast.success("Club deleted successfully");
      setIsMember(false);
    })
    .catch((err)=>{
      console.log(err.data)
      toast.warning("Failed to leave the group");
    })
    await fetchMemberships();
  }

  //View members of a club
  async function handleViewMembers(){
    await getClubMembers(auth.user,clubname)
    .then((res)=>{
      console.log("View Members  : ",res.data);
      setMembers(res.data);
    })
    .catch((err)=>{
      console.log(err.data);
      setMembers(err.data);
    })
    
  }


  return (
    <div className="component">
    {clickedMembers && (
  <div
    className="d-flex justify-content-center align-items-center w-100"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      zIndex: 1500,
    }}
    onClick={()=>{setClickedMembers(false)}}
  >
    <div
      className="d-flex flex-column justify-content-between tile-bg text-light fs-5"
      style={{
        
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        width: "60%",
        background: "#222",
        boxShadow: "0 4px 8px rgba(124, 32, 32, 0.38)",
        maxHeight: "80vh", 
        overflowY: "auto", 
      }}
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      Club Members

      {/* Members list */}
      {!members || Object.keys(members).length === 0 ? (
          <div className="text-light">Loading...</div>
              ) : (
                Object.entries(members).map(([id, username],i) => (
                  <div>
                      <div
                        key={id}
                        className="tile-bg bg-dark fs-5 mt-2 py-2 px-3 d-flex justify-content-between align-items-center"
                        style={{
                          borderRadius: "5px",
                          transition: "transform 0.2s",
                          height: "40px",
                        }}
                      >
                        <div className="text-end">
                        {i+1}. {username}
                      </div>
                      <div className="text-end fs-6 text-success">
                        {(clubDetails.admin==username)?('ADMIN'):('MEMBER')}
                      </div>
                      </div>
                  
                  </div>
                  
                ))
              )}
            </div>
          </div>
        )}


        <div
            className="d-flex my-container bg-dark tile-container-bg"
            style={{
            minWidth: "calc(100% - 20px)",
            
            }}
        >
        <div className="w-100 d-flex justify-content-between align-items-center">
            {/* Exit group button for non admins */}
          {auth.user !== clubDetails?.admin && (
            <div className="d-flex w-100 justify-content-end">
              <button
                onClick={()=>{setClickedLeave(true)}}
                className="text-light d-flex align-items-center gap-2 px-3 py-2 rounded btn btn-standard"
                title="Exit this club"
              >
                Leave <FiLogOut size={18} />
              </button>
            </div>
          )}
        {/* Exit group confirmation */}
          {
          clickedLeave &&
                <div
                    className="d-flex justify-content-center align-items-center w-100"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                      zIndex: 1500,
                    }}
                    onClick={()=>{setClickedLeave(false)}}
                >
                  <div className="text-light fs-2 flex-column">Do you really want to leave this Book Club forever?
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-primary me-4" onClick={handleLeaveClub}>Yes</button>
                      <button className="btn btn-danger " onClick={()=>{setClickedLeave(false)}}>No</button>
                    </div>
                  </div>
                  
                </div>
          }

          {/* Admins: Delete button (left aligned) */}
          {auth.user === clubDetails?.admin && (
            <div className="d-flex justify-content-start w-100">
              <button
                onClick={()=>{setClickedDelete(true)}}
                className="text-light d-flex align-items-center gap-2 px-3 py-2 rounded btn btn-standard"
                title="Delete this club forever"
              >
                <FiTrash2 size={18} /> Delete
              </button>
            </div>
          )}
          {/* Delete club confirmation */}
          {
          clickedDelete &&
                <div
                    className="d-flex justify-content-center align-items-center w-100"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                      zIndex: 1500,
                    }}
                    onClick={()=>{setClickedDelete(false)}}
                >
                  <div className="text-light fs-2 flex-column">Do you really want to delete this Book Club forever?
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-primary me-4" onClick={handleDeleteClub}>Yes</button>
                      <button className="btn btn-danger " onClick={()=>{setClickedDelete(false)}}>No</button>
                    </div>
                  </div>
                  
                </div>
          }

           {auth.user === clubDetails?.admin && (
            <div className="text-end">
              <button
                onClick={() => {
                  handleViewMembers();
                  setClickedMembers(true);
                }}
                className="text-light btn btn-standard"
                transition="transform 0.2s"
                onMouseEnter={(e)=>(e.currentTarget.style.transform="scale(1.1)")}
                onMouseLeave={(e)=>(e.currentTarget.style.transform="scale(1)")}
                title="View all members of a club"
              >
                View All Members
              </button>
            </div>
          )}
        </div>


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
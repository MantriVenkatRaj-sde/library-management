import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../API/apiClient";
import { getBookRatings,findBookByISBN, findBooksByGenre,postReviewAndRating, UnLikeABook, LikeABook, deleteRating } from "../API/bookAPI";
import { useEffect, useRef, useState } from "react";
import "../Styling/bookPageStyle.css";
import "../Styling/Tile.css";
import "../Styling/Background.css";
import StarRating from "./StartRating";
import {  recommendClubsApi } from "../API/BookClubAPI";
import { FaHeart, FaRegHeart,FaPlus,FaSquare, FaCheckSquare, FaRegCircle, FaCheckCircle} from "react-icons/fa";
import { addToReadersList, removeFromReadersList } from "../API/ReadListAPI";
import { FaCommentDots } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../Authentication/AuthContext";


export function BookComponent() {
  const { isbn } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [bookClubs, setBookClubs] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [ratings,setRatings]= useState([])
  const [open, setOpen] = useState(false); // show/hide composer
  const [text, setText] = useState(""); // comment text
  const [rating,setRating]=useState(1);//Rating value
  const [posted,setPosted]=useState(false);// If Review Posted
  const [rated,setRated]=useState(false);// If Rated
  const [isSubmittingRating, setIsSubmittingRating] = useState(false); // rating submit
  const [isDeleting, setIsDeleting] = useState({}); // { [id]: true/false }
  const auth=useAuth();
  const navigate = useNavigate();

  //Clamping
  const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

  //For the dragging of Comment box
    const [pos, setPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const drag = useRef({ on: false, dx: 0, dy: 0 });

  // place bottom-right when opened
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const width = 500, height = 170; // fixed size
      setPos({ x: w - width - 24, y: h - height - 24 });
    };
    setTimeout(place, 0);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  const onPointerDown = (e) => {
    // allow typing: don't start drag from the textarea
    if (e.target.tagName === "TEXTAREA") return;
    if (e.target.tagName === "BUTTON") return;
    if (e.target.tagName === "INPUT") return;

    e.preventDefault();
    drag.current.on = true;
    drag.current.dx = e.clientX - pos.x;
    drag.current.dy = e.clientY - pos.y;
    e.currentTarget.setPointerCapture?.(e.pointerId);

    const onMove = (ev) => {
      if (!drag.current.on) return;
      const width = 500, height = 170; // fixed size
      const maxX = window.innerWidth - width - 8;
      const maxY = window.innerHeight - height - 8;
      setPos({
        x: clamp(ev.clientX - drag.current.dx, 8, maxX),
        y: clamp(ev.clientY - drag.current.dy, 8, maxY),
      });
    };
    const onUp = () => {
      drag.current.on = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  //API Calls
  useEffect(() => {
    if (!isbn) return;

    let mounted = true;
    setLoading1(true);
    findBookByISBN(isbn)
      .then((response) => {
        if (mounted) {
          setBookDetails(response.data);
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        if (mounted) setBookDetails(null);
      })
      .finally(() => {
        if (mounted) setLoading1(false);
      });

    return () => {
      mounted = false;
    };
  }, [isbn]);

  useEffect(() => {
    if (!isbn) return;
    let mounted = true;
    setLoading2(true);

    recommendClubsApi(isbn)
      .then((response) => {
        if (mounted) {
          setBookClubs(response.data);
          console.log("Related Book Details : ", response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        if (mounted) setBookClubs(null);
      })
      .finally(() => {
        if (mounted) setLoading2(false);
      });

    return () => {
      mounted = false;
    };
  }, [isbn]);

    useEffect(()=>{
    if(!isbn) return;
    let mounted=true;
    setLoading3(true);
    getBookRatings(isbn)
        .then((response) => {
          if (mounted) {
            setRatings(response.data);
            console.log("Ratings and Reviews : ",response.data);
          }
        })
        .catch((error) => {
          console.error(error);
          if (mounted) setRatings([]);
        })
        .finally(() => {
          if (mounted) setLoading3(false);
        });

      return () => {
        mounted = false;
      };
  },[isbn])

  if (loading1) return <div>Loading...</div>;
  if (!bookDetails) return <div>Book not found</div>;


  function handleTagClick(genre) {
    navigate(`/${genre}/books`);
  }

  function handleLikeClick() {
    if(isLiked){
      UnLikeABook(auth.user,isbn)
      .then((res)=>{
        console.log("Success Response : ",res.data);
        toast.info("Removed from Liked Books");
      })
      .catch((err)=>{
        console.log(err);
      });
    }
    else{
      LikeABook(auth.user,isbn)
      .then((res)=>{
        console.log("Success Response : ",res.data);
        toast.success("Added to Liked Books");
      })
       .catch((err)=>{
        console.log(err);
      });
    }
    setIsLiked((prev) => !prev); 
  }

   function handleAddClick() {
   if(!isAdded ){ addToReadersList(auth.user,isbn)
    .then((response)=>{
      console.log(response?response.data:"Nothing returned");
       setIsAdded((prev) => !prev);
      toast.success("Book added to Reader's List");
    })
    .catch((error)=>{
      console.log(error)
    });}

    else{
      removeFromReadersList(auth.user,isbn)
    .then((response)=>{
      console.log(response?response.data:"Nothing returned");
       setIsAdded((prev) => !prev);
       console.log("Book removed from users list")
      toast.info("Bookremoved from Reader's List");
    })
    .catch((error)=>{
      console.log(error)
    });

    }
  }
  
   const handlePost = () => {
    if (!text.trim()) return;
    setPosted(true);
    console.log("Posted comment:", text); // later replace with API call
    setOpen(false);
  };
  const handleRatePost=()=>{
    if(isSubmittingRating) {
      console.log("Rating in Progress")
      return;
    }
    setIsSubmittingRating(true);
    console.log('Rating : ',rating);
   postReviewAndRating(auth.user, isbn, rating, text)
  .then((response) => {
    setRated(true);
    console.log(response.data);
    toast.success("Comment added!");

    // fetch again
    return getBookRatings(isbn);
  })
  .then((res) => {
    setRatings(res.data); // update state with new list
  })
  .catch((error) => {
    console.error(error);
    toast.error("Failed to add comment");
  })
  .finally(() => {
    setText("");
    setRating(5);
    setRated(false);
    setPosted(false);
  });
  };


  //Handle Delete
const handleDelete = (ratingId) => {
  if (!window.confirm("Are you sure you want to delete this review?")) return;

  deleteRating(auth.user, isbn, ratingId)  // make sure your API expects ratingId
    .then(() => {
      setRatings((prev) => prev.filter((r) => r.id !== ratingId));
      toast.success("Review deleted!");
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to delete review.");
    });
};

  return (
    <div
      className="component bookcontainer overflow-auto"
      style={{
        // backgroundImage: `url(${libraryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "90px",
      }}
    >
      <div className="d-flex flex-column align-items-center my-4">
        <div className="img-container">
          <img
            src={bookDetails.imageLink}
            alt={bookDetails.title}
            className="cover-img cover-wrap"
          />
        </div>
        <div className="d-flex">
          <p className="fw-bold mt-3 fs-2 text-light text-center me-2">
            {bookDetails.title}
          </p>
          {/* Like Button */}
          <button onClick={handleLikeClick} className="like-button" 
          style={{background:"transparent",border:"0",color:"white"}}
          >
            {isLiked ? (
              <FaHeart title="UnLike" size={30} style={{ color: "red" }} />
            ) : (
              <FaRegHeart title="Like" size={30}/>
            )}
          </button>

          {/* ReadList Button */}
          <button onClick={handleAddClick} className="like-button" 
          style={{background:"transparent",border:"0",color:"white"}}
          >
            {isAdded ? (
              <FaCheckCircle size={30} style={{ color: 'green' }} />
            ) : (
              <FaPlus size={30} />
            )}
          </button>
        </div>
      </div>

      {/* Genre Tags */}
      <div className="my-container">
        <h2 className="text-light fs-3 fw-bold">Tags</h2>
        <div className="d-flex flex-wrap align-items-center gap-2 my-3">
          {bookDetails.genres?.map((g, i) => (
            <button
              key={i}
              className="badge rounded-pill bg-dark text-info border border-2"
              style={{ padding: "0.45rem 0.8rem", fontSize: "0.95rem" }}
              onClick={() => handleTagClick(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Book info */}
      <div className="my-container">
        <h2 className="text-light fs-3 fw-bold">About</h2>
        <div className="d-flex mb-2 fs-5">
          <span className="fw-bold text-success me-2">Author :</span>
          <span className="text-info">{bookDetails.author}</span>
        </div>

        <div className="d-flex mb-2 fs-5">
          <span className="fw-bold text-success me-2">ISBN :</span>
          <span className="text-info">{bookDetails.isbn}</span>
        </div>

        <div className="d-flex mb-2 fs-5">
          <span className="fw-bold text-success me-2">Published In :</span>
          <span className="text-info">{bookDetails.publishedYear}</span>
        </div>
      </div>

      {/* Description */}
      <div className="my-container">
        <h2 className="text-light fs-3 fw-bold">Description</h2>
        <p className="text-info fs-5 mb-2 text-start">
          {bookDetails.description}
        </p>
      </div>

      {/* Overall Rating */}
      <div className="my-container">
        <h2 className="text-light fs-3 fw-bold">Ratings</h2>
        <p className="fw-bold text-success fs-5">Average Rating :</p>
        <div>
          <StarRating rating={bookDetails.avgRating} />
        </div>
        <p className="text-muted">Based on {bookDetails.ratingCount}</p>

        <div className="d-flex mb-2 fs-5">
          <span className="fw-bold text-success me-2">Based On </span>
          <span className="text-info">{bookDetails.ratingCount} Ratings</span>
        </div>
        <div className="d-flex mb-2 fs-5">
          <span className="fw-bold text-success me-2">Like Percentage:</span>
          <span className="text-info">{bookDetails.likePercent}</span>
        </div>
      </div>

      <div className="my-container ">
        <h2 className="text-light fs-3 fw-bold mb-5">Related Book Clubs</h2>
        <span
          style={{
            width: "100%",
            cursor: "pointer",
          }}
        >
          {loading2 ? (
            <div>Loading...</div>
          ) : (
            <div className="text-light fs-10 ">
              {bookClubs && bookClubs.length ? (
                bookClubs.map((club, i) => (
                  <div
                    key={club.name}
                    className="tile-bg bg-dark  rounded fs-5 mt-2 py-2 px-3 d-flex justify-content-between align-items-center"
                    style={{
                      width: "calc(100% - 1px)",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() =>
                      navigate(`/clubs/bookclub/${club.id}/${club.name}`)
                    }
                  >
                    <div>
                      {i + 1}. {club.name}
                    </div>
                    <div className="text-success">{club.visibility}</div>
                  </div>
                ))
              ) : (
                <div>No related Book Clubs found</div>
              )}
            </div>
          )}
        </span>
      </div>
          <div className="d-flex w-100 flex-column">
            <div className="w-100 d-flex flex-column justify-content-center">
              <h2 className="text-light fs-2 fw-bold mb-5">Comments</h2>
            </div>

           {loading3 ? (
              <div className="text-light">Loading...</div>
            ) : ratings.length === 0 ? (
              <div className="text-light">No Comments</div>
            ) : (
              [...ratings]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((r) => (
                  <div key={r.id} className="tile-bg border dark-bg text-light mb-3 rounded p-3 "
                  style={{marginLeft:"50px",marginRight:"50px"}}>
                    <div className="d-flex" >
                      <span className="fw-bold text-info me-2">
                        {r.username}{" | "} {r.rating}/10
                      </span>
                      <span className="small text-secondary">
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-100">
                      <div className="text-start">{r.review}</div>
                        <div className="text-end">
                          <button
                            onClick={() => handleDelete(r.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "red",
                              fontSize: "20px",
                              cursor: "pointer",
                              marginLeft: "8px",
                            }}
                            title="Delete review"
                          >
                            &minus;
                          </button>
                        </div>
                  </div>
        </div>
      ))
  )}
        </div>

          {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
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
          }}
        >
          <FaCommentDots />
        </button>
      )}

      {/* Composer */}
      {open && (
        <div
        ref={cardRef}
        onPointerDown={onPointerDown}
        className="tile-bg"
          style={{
          position: "fixed",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          zIndex: 2000,
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "12px",
          width: "500px",
          boxShadow: "0 4px 8px rgba(124, 32, 32, 0.38)",
          cursor: "move",
          touchAction: "none",
          userSelect: "none",
        }}

        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="bg-dark text-light"
            style={{
              width: "100%",
              height: "80px",
              resize: "none",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px",
              marginBottom: "8px",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: "#ddd",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <button
              onClick={handlePost}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: "#ffc107",
                border: "none",
                cursor: "pointer",
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Ratings */}
      {posted &&
        
         (
        <div
        ref={cardRef}
        onPointerDown={onPointerDown}
        className="tile-bg text-light fs-5"
          style={{
          position: "fixed",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          zIndex: 2000,
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "12px",
          width: "500px",
          boxShadow: "0 4px 8px rgba(124, 32, 32, 0.38)",
          cursor: "move",
          touchAction: "none",
          userSelect: "none",
        }}
          
        >
          Rate this book on a scale of 1 to 10
           <input
            type="range"
            id="rating"
            min="0"
            max="10"
            step={1}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#ffc107", // makes the slider yellow
              cursor: "pointer",
            }}
          />
           <div className="d-flex justify-content-between text-light p-1" style={{ fontSize: 12, marginTop: 4 }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <span key={n}>{n}</span>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setPosted(false)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: "#ddd",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <button
              onClick={handleRatePost}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: "#ffc107",
                border: "none",
                cursor:(isSubmittingRating) ? "not-allowed" : "pointer"
              }}
            >
              {isSubmittingRating ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      )
      }
    </div>
  );
}

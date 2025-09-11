import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../API/apiClient"
import { findBookByISBN, findBooksByGenre } from "../API/bookAPI"
import { useEffect, useState } from "react";
import "../Styling/bookPageStyle.css";
import libraryBg from "../Images/BookBG.jpeg";
import StarRating from "./StartRating";

export function BookComponent() {
  const { isbn } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isbn) return;

    let mounted = true;
    setLoading(true);

    findBookByISBN(isbn)
      .then(response => {
        if (mounted) {
          setBookDetails(response.data);
          console.log(response.data);
        }
      })
      .catch(error => {
        console.error(error);
        if (mounted) setBookDetails(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [isbn]);

  if (loading) return <div>Loading...</div>;
  if (!bookDetails) return <div>Book not found</div>; // ✅ rely on API result

  function handleTagClick(genre) {
    navigate(`/${genre}/books`);
  }

  return (
    <div
      className="bookcontainer"
      style={{
        backgroundImage: `url(${libraryBg})`,
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

        <p className="fw-bold mt-3 fs-2 text-light text-center">
          {bookDetails.title}
        </p>
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
              onClick={() => handleTagClick(g)} // ✅ fixed
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
        <p className="text-info fs-5 mb-2 text-start">{bookDetails.description}</p>
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
    </div>
  );
}

//     private Long id;
//     private String isbn;0
//     private String title;0
//     private String author;0
//     private String imageLink;0
//     private Double avgRating;
//     private Long ratingCount;
//     private String description;
//     private String publisher;0
//     private String publishedYear;0
//     private float likePercent;
//     private Set<String> genres;
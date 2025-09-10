import { useLocation, useParams } from "react-router-dom";
import { apiClient } from "../API/apiClient"
import { findBookByISBN } from "../API/bookAPI"
import { useEffect, useState } from "react";
import "../Styling/bookPageStyle.css";
import libraryBg from "../Images/BookBG.jpeg";

export function BookComponent(){
    
    
    const { isbn } = useParams();
    const [bookDetails, setBookDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const book = location.state?.book;

    useEffect(() => {

        if (!isbn) return;

        let mounted = true;
        setLoading(true);
        //API call
        findBookByISBN(isbn)
        .then(response => { 
            if (mounted) {
                setBookDetails(response.data);
                console.log(response.data);
            } 
        })
        .catch(error => { 
            console.error(error); if (mounted) setBookDetails(null); 
        })
        .finally(() => { 
            if (mounted) setLoading(false); 
        });

        return () => { mounted = false; };
    }, [isbn]);

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book not found</div>;

    return(
            
        <div className="bookcontainer"
        style={{
            backgroundImage: `url(${libraryBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",           // allow container to grow past viewport
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",     // start at top, not vertically centered
            backgroundAttachment: "fixed" // optional: makes bg stay fixed while you scroll
  }}
        >

            <div className="img-container">
                <img
                src={book.imageLink}
                alt={bookDetails.title}
                className="cover-img cover-wrap"
                />
            </div>
                

            <div className="w-100 text-center">
                <p className="fw-bold m-5 fs-2 text-light text-justify">{bookDetails.title}</p>
            </div>

                {/* Genre Tags */}
                <div className="my-container">
                    <h2 className="text-light fs-3 fw-bold">Tags</h2>
                    <div className="d-flex flex-wrap align-items-center gap-2 my-3"> 
                    {bookDetails.genres?.map((g, i) => (
                        <span
                        key={i}
                        className="badge rounded-pill bg-dark text-info border border-2"
                        style={{ padding: "0.45rem 0.8rem", fontSize: "0.95rem" }}
                        >
                        {g}
                        </span>
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
            {/*Overall Rating  */}
            <div className="my-container">
                <h2 className="text-light fs-3 fw-bold">Ratings</h2>
                <p className="fw-bold text-success fs-5">Average Rating :</p>
                    <div>
                        <i className="bi bi-star-fill text-warning"></i>
                        <i className="bi bi-star-fill text-warning"></i>
                        <i className="bi bi-star-fill text-warning"></i>
                        <i className="bi bi-star-fill text-warning"></i>
                        <i className="bi bi-star-half text-warning"></i>
                        <span className="text-light ms-2">4.2</span>
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

    )
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
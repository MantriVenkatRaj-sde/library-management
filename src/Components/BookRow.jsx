// BookRow.jsx
import { useRef } from "react";
import "../Styling/BookRow.css";
import { ChevronLeft, ChevronRight } from "lucide-react"; // icons only
import { useNavigate } from "react-router-dom";
import PlaceHolder from "../Images/PlaceHolder.jpeg";
import { ImageWithPlaceholder } from "./ImageWithPlaceholder";

export function BookRow({ title, books = [] }) {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left"
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  function handleClick(book) {
    if (!book?.isbn) {
      console.warn("No ISBN, cannot navigate", book);
      return;
    }
      navigate(`/home/book/${book.isbn}`, { state: { book } });
  }

  return (
    <div className="bookrow-container">
      <h2 className="bookrow-title">{title}</h2>

      <div className="bookrow-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>
          <ChevronLeft size={28} />
        </button>

        <div className="bookrow" ref={rowRef}>
          {books.map((book, index) => (
            <div
              className="book-card"
              key={book.isbn ?? book.id ?? index}
              onClick={() => handleClick(book)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") handleClick(book); }}
            >
              <ImageWithPlaceholder
                src={book.imageLink}
                alt={book.title}
                placeholder={PlaceHolder}
                className="book-card-img"
                width={140} 
                height={200}
              />
              <p className="book-card-title">{book.title}</p>
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right")}>
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}

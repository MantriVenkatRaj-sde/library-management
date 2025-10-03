// BookRow.jsx
import { useRef } from "react";
import "../Styling/BookRow.css";
import "../Styling/Tile.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlaceHolder from "../Images/PlaceHolder.jpeg";
import { ImageWithPlaceholder } from "./ImageWithPlaceholder";

export function BookRow({ title, books = [], emptyText = "No books yet.", className = "" }) {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const hasItems = Array.isArray(books) && books.length > 0;

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const next = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
    rowRef.current.scrollTo({ left: next, behavior: "smooth" });
  };

  const handleClick = (book) => {
    if (!book?.isbn) return console.warn("No ISBN, cannot navigate", book);
    navigate(`/book/${book.isbn}/${book.title}`, { state: { book } });
  };

  return (
    <div className={`bookrow-container  ${className}`}>
      <h2 className="bookrow-title fs-3">{title}</h2>

      <div
        className="bookrow-wrapper"
        style={{
          position: "relative",
          minHeight: 200,            // keep section from collapsing
          borderRadius: 12,
        }}
      >
        {/* Left arrow */}
        <button
          className="scroll-btn left"
          onClick={() => scroll("left")}
          disabled={!hasItems}
          aria-disabled={!hasItems}
          style={{ opacity: hasItems ? 1 : 0.35, cursor: hasItems ? "pointer" : "not-allowed" }}
        >
          <ChevronLeft size={28} />
        </button>

        {/* Row */}
        <div className="bookrow" ref={rowRef}>
          {hasItems ? (
            books.map((book, index) => (
              <div
                className="book-card p-4"
                key={book.isbn ?? book.id ?? index}
                onClick={() => handleClick(book)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleClick(book)}
              >
                <ImageWithPlaceholder
                  src={book.imageLink}
                  alt={book.title}
                  placeholder={PlaceHolder}
                  className="book-card-img"
                  width={250}
                  height={250}
                />
                <p className="book-card-title">{book.title}</p>
              </div>
            ))
          ) : (
            // Empty state
            <div
              className="d-flex w-100 h-100 justify-content-center align-items-center text-light"
              style={{ padding: 16 }}
            >
              {emptyText}
            </div>
          )}
        </div>

        {/* Right arrow */}
        <button
          className="scroll-btn right"
          onClick={() => scroll("right")}
          disabled={!hasItems}
          aria-disabled={!hasItems}
          style={{ opacity: hasItems ? 1 : 0.35, cursor: hasItems ? "pointer" : "not-allowed" }}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}

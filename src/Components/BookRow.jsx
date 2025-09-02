import { useRef } from "react";
import "../Styling/BookRow.css";
import { ChevronLeft, ChevronRight } from "lucide-react"; // install lucide-react for icons

export function BookRow({ title, books }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="bookrow-container">
      <h2 className="bookrow-title">{title}</h2>

      <div className="bookrow-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>
          <ChevronLeft size={28} />
        </button>

        <div className="bookrow" ref={rowRef}>
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <img src={book.image} alt={book.title} />
              <p>{book.title}</p>
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

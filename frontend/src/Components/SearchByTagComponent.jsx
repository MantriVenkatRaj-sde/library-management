import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { findBooksByGenre } from "../API/bookAPI";
import { BookRow } from "./BookRow";
import { useEffect, useState } from "react";

export function SearchByTagComponent() {
  const { genre } = useParams();
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allBooksOfGenre, setAllBooksOfGenre] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Load books when genre or page changes
  useEffect(() => {
    setIsLoading(true);
    findBooksByGenre(genre, page, 50)
      .then((response) => {
        console.log(response);
        const newBooks = response?.data?.content || [];
        const isLastPage = response?.data?.last;
        
        if (page === 0) {
          // First page: replace all books
          setAllBooksOfGenre(newBooks);
        } else {
          // Subsequent pages: append
          setAllBooksOfGenre((prev) => [...prev, ...newBooks]);
        }
        
        setHasMore(!isLastPage);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [genre, page]); // ✅ Only genre and page

  // Reset when genre changes
  useEffect(() => {
    setPage(0);
    setAllBooksOfGenre([]);
    setHasMore(true);
  }, [genre]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const rows = chunkArray(allBooksOfGenre, 25);

  return (
    <div className="home-container">
      <h2
        className="text-light fs-3 fw-bold"
        style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "20px" }}
      >
        Books under {genre} category
      </h2>

      {rows.map((books, rowIndex) => (
        <BookRow key={rowIndex} title="" books={books} />
      ))}

      {isLoading && <p>Loading books...</p>}
      
      {!isLoading && hasMore && (
        <button className="btn btn-standard" onClick={loadMore}>
          LOAD MORE
        </button>
      )}

      {!hasMore && allBooksOfGenre.length > 0 && (
        <p className="text-light">No more books to load</p>
      )}
    </div>
  );
}
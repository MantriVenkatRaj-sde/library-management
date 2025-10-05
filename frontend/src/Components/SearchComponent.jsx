import { BookRow } from "../Components/BookRow";
import "../Styling/Home.css";
import { searchQuery } from "../API/bookAPI";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


export function SearchComponent() {
  const { q } = useParams();
  const [booksFromSearch, setBooksFromSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Load books when query or page changes
  useEffect(() => {
    if (!q) return;

    setIsLoading(true);
    searchQuery(q, page, 50)
      .then((response) => {
        console.log(response.data);
        const newBooks = response?.data?.content || response?.data || [];
        const isLastPage = response?.data?.last;

        if (page === 0) {
          // First page: replace all books
          setBooksFromSearch(newBooks);
        } else {
          // Subsequent pages: append
          setBooksFromSearch((prev) => [...prev, ...newBooks]);
        }

        setFound(newBooks.length > 0 || page > 0);
        setHasMore(!isLastPage);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (page === 0) {
          setBooksFromSearch([]);
          setFound(false);
        }
        setIsLoading(false);
      });
  }, [q, page]);

  // Reset when search query changes
  useEffect(() => {
    setPage(0);
    setBooksFromSearch([]);
    setHasMore(true);
    setFound(false);
  }, [q]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const rows = chunkArray(booksFromSearch, 10);

  return (
    <div className="home-container">
      <h2 className="fw-bold ms-4" style={{ textAlign: "left" }}>
        Results including "{q}"
      </h2>

      {rows.map((books, rowIndex) => (
        <BookRow key={rowIndex} title="" books={books} />
      ))}

      {isLoading && <p>Loading books...</p>}

      {!isLoading && !found && booksFromSearch.length === 0 && (
        <h3
          className="text-light fw-bold m-10"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          No Results Found
        </h3>
      )}

      {!isLoading && hasMore && booksFromSearch.length > 0 && (
      <button
        className="btn btn-standard"
        style={{
          color: "white",
          transition: "transform 0.3s ease"
        }}
        onClick={loadMore}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {isLoading ? "Loading..." : "Load more..."}
      </button>

      )}

      {!hasMore && booksFromSearch.length > 0 && (
        <p className="text-light text-center">No more results</p>
      )}
    </div>
  );
}
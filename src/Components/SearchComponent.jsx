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

  function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  useEffect(() => {
    if (!q) return; // no search if query is empty

    setIsLoading(true);
    searchQuery(q)
      .then((response) => {
        console.log(response.data);
        setBooksFromSearch(response.data);
        setFound(response.data.length > 0); // ✅ only true if results exist
      })
      .catch((err) => {
        console.error(err);
        setBooksFromSearch([]);
        setFound(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [q]);

  const rows = chunkArray(booksFromSearch, 10);

  return (
    <div className="home-container">
      {isLoading ? (
        <p>Loading books...</p>
      ) : (
        <>
          <h2 className="fw-bold ms-4" style={{ textAlign: "left" }}>
            Results including "{q}"
          </h2>

          {found ? (
            rows.map((books, rowIndex) => (
              <BookRow key={rowIndex} title="" books={books} />
            ))
          ) : (
            <h3
              className="text-light fw-bold m-10"
              style={{ textAlign: "center", marginTop:"20px"}}
            >
              No Results Found 😞
            </h3>
          )}
        </>
      )}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { BookRow } from "../Components/BookRow";
import "../Styling/Home.css";
import { getAllBooks } from "../API/bookAPI";
import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/AuthContext";

export function HomeComponent() {
  const auth = useAuth();
  const [page, setPage] = useState(0);
  const [books, setBooks] = useState([]);

  const { data: allBooks = [], isLoading } = useQuery({
    queryKey: ["books", page],
    queryFn: async () => {
      const response = await getAllBooks(page, 40);
      return response?.data ?? [];
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 60,
  });

  // Append new books to the existing list
  useEffect(() => {
    if (allBooks.length > 0) {
      setBooks(prev => [...prev, ...allBooks]);
    }
  }, [allBooks]);

  // Function to split books into chunks of 5
  const chunkBooks = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const bookRows = chunkBooks(books, 15);

  return (
    <div className="home-container component">
      <h1 className="text-light">Books you might like</h1>
      {isLoading && books.length === 0 ? (
        <p>Loading books...</p>
      ) : (
        <>
          {bookRows.map((rowBooks, index) => (
            <BookRow key={index} title={``} books={rowBooks} />
          ))}

          <button
            className="btn btn-standard text-light"
            style={{
              transition:"transform 0.6s"
            }}
            onClick={() => setPage(prev => prev + 1)}
            onMouseEnter={(e)=>e.currentTarget.style.scale='1.2'}
            onMouseLeave={(e)=>e.currentTarget.style.scale='1'}
          >
            {isLoading ? "Loading..." : "Load more..."}
          </button>
        </>
      )}
    </div>
  );
}

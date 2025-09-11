import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { findBooksByGenre } from "../API/bookAPI";
import { BookRow } from "./BookRow";

export function SearchByTagComponent() {
  const { genre } = useParams();

  function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  const { data: allBooksOfGenre = [], isLoading } = useQuery({
    queryKey: ["books", "Of", genre],
    queryFn: async () => {
      const response = await findBooksByGenre(genre);
      console.log(response.data)
      return response?.data ?? [];
    },
    enabled: !!genre, // don't run until genre is available
    staleTime: 1000 * 60 * 60,
  });

  // declare rows properly (const)
  const rows = chunkArray(allBooksOfGenre, 7);

  return (
    <div className="home-container">
       <h2
            className="text-light fs-3 fw-bold"
            style={{ display: "flex", justifyContent: "flex-start", paddingLeft:"20px" }}
            >
            Books under {genre} category
        </h2>

        {isLoading ? (
            <p>Loading books...</p>
        ) : (
            <>
                <>
                {rows.map((books, rowIndex) => (
                    <BookRow key={rowIndex} title="" books={books} />
                ))}
                </>
            </>
        )}
        </div>
    );
}
import { useQuery } from "@tanstack/react-query";
import { BookRow } from "../Components/BookRow";
import "../Styling/Home.css";
import { getAllBooks } from "../API/bookAPI";

export function HomeComponent() {
  const { data: allBooks = [], isLoading } = useQuery({
    queryKey: ["books","home"],
    queryFn: async () => {
      const response = await getAllBooks();
      return response?.data ?? [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  const row1 = allBooks.slice(1, 10);
  const row2 = allBooks.slice(10, 20);
  const row3 = allBooks.slice(20, 30);
  const row4 = allBooks.slice(30, 40);

  return (
    <div className="home-container">
      {isLoading ? (
        <p>Loading books...</p>
      ) : (
        <>
          <BookRow title="Testing Row" books={row1} />
          <BookRow title="Top Picks for You" books={row2} />
          <BookRow title="New Releases" books={row3} />
          <BookRow title="Based on What You Read" books={row4} />
        </>
      )}
    </div>
  );
}

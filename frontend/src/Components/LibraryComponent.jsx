import { useEffect, useState } from "react";
import "../Styling/Background.css";
import "../Styling/Icon.css";
import "../Styling/Tile.css";
import "../Styling/Home.css";
import { useAuth } from "../Authentication/AuthContext";
import { getReadersList } from "../API/userAPI";
import { getLikedBooks } from "../API/bookAPI";
import { BookRow } from "./BookRow";
export const LibraryComponent=()=>{
    const auth=useAuth();
    const [readersList,setReadersList]=useState([])
    const [likedBooks,setlikedBooks]=useState([])
    const [loading,setLoading]=useState(false);

useEffect(() => {
  if (!auth.user) return;

  let mounted = true;
  setLoading(true);

  Promise.all([
    getReadersList(auth.user),
    getLikedBooks(auth.user)
  ])
    .then(([readersResponse, likedBooksResponse]) => {
      if (!mounted) return;

      setReadersList(readersResponse.data);
      setlikedBooks(likedBooksResponse.data);

      console.log("Readers List:", readersResponse.data);
      console.log("Liked Books:", likedBooksResponse.data);
    })
    .catch((error) => {
      console.error(error);
      if (mounted) {
        setReadersList([]);
        setlikedBooks([]);
      }
    })
    .finally(() => {
      if (mounted) setLoading(false);
    });

  return () => {
    mounted = false;
  };
}, [auth.user]);


 return (
    <div className="home-container component">
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <>
          <BookRow title="Liked Books" books={likedBooks} className="mb-4"></BookRow>
            <BookRow title="Reader's List" books={readersList} className="mb-4"></BookRow>
        </>
      )}
    </div>
  );


        // <div className="d-flex w-100 vh-100 component justify-contnt-center align-items-center flex-column overflow-auto home-container">

}
import { booksData } from "../DemoBooksData";
import { BookRow } from "../Components/BookRow";
import "../Styling/Home.css"
import homeBg from "../Images/bgSignUp3.jpg"

export function HomeComponent(){
    return(
    <div className="home-container">
        <BookRow title="Top Picks for You" books={booksData.topPicks} />
        <BookRow title="New Releases" books={booksData.newReleases} />
        <BookRow title="Based on What You Read" books={booksData.similarReads} />
    </div>
    
    )
}
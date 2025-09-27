import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
// import Footer from './Components/Footer';
import { LoginComponent } from './Components/LoginComponent';
import { SignUpComponent } from './Components/SignUpComponent';
import { WelcomeComponent } from './Components/WelcomeComponent';
import { HomeComponent } from './Components/HomeComponent';
import AuthProvider, { useAuth }  from './Authentication/AuthContext';
import { BookComponent } from './Components/BookComponent';
import { SearchByTagComponent } from './Components/SearchByTagComponent';
import { SearchComponent } from './Components/SearchComponent';
import { Chat } from './Components/ClubChat';
import { BookClub } from './Components/BookClub';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClubList } from './Components/ClubList';
import { useLocation } from "react-router-dom";


function HeaderSwitcher() {
  const location = useLocation();
  const hideHeader = location.pathname.includes("/chat"); // hide on any /chat page
  return hideHeader ? null : <Header />;
}



function App() {

  function AuthenticatePath({children}){
    const auth=useAuth();
    if (!auth.isAuthenticated) {
        return <Navigate to="/"/>; // redirect if not logged in
    }

    return children; // render the protected component
  }

  return (
     <Router>
        <AuthProvider>
     
        <div className="App">
          <HeaderSwitcher />
          {/* Routes define which component to show for each path */}
          <Routes>
            <Route path="/" element={<WelcomeComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignUpComponent />} />
            <Route path="/home" element={<AuthenticatePath><HomeComponent/></AuthenticatePath>} />
            <Route path="/clubs" element={<AuthenticatePath><ClubList/></AuthenticatePath>} />
            <Route path="/home/book/:isbn" element={<AuthenticatePath><BookComponent/></AuthenticatePath>} />
            <Route path="/clubs/bookclub/:clubId/:clubname" element={<AuthenticatePath><BookClub/></AuthenticatePath>} />
            <Route path="/:genre/books" element={<AuthenticatePath><SearchByTagComponent/></AuthenticatePath>} />
            <Route path="/clubs/:clubid/:clubname/chat" element={<AuthenticatePath><Chat/></AuthenticatePath>} />
            <Route path="/search/:q" element={<AuthenticatePath><SearchComponent/></AuthenticatePath>} />
            {/* Later you can add more pages like Home, Library, Profile */}
          </Routes>
           <ToastContainer
            position="top-center"   
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      
      </AuthProvider>
    </Router>
  );
}

export default App;

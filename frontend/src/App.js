import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import { LoginComponent } from './Components/LoginComponent';
import { SignUpComponent } from './Components/SignUpComponent';
import { WelcomeComponent } from './Components/WelcomeComponent';
import { HomeComponent } from './Components/HomeComponent';
import { useAuth } from './Authentication/AuthContext';
import { BookComponent } from './Components/BookComponent';
import { SearchByTagComponent } from './Components/SearchByTagComponent';
import { SearchComponent } from './Components/SearchComponent';
import { Chat } from './Components/ClubChat';
import { BookClub } from './Components/BookClub';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClubList } from './Components/ClubList';
import { LibraryComponent } from './Components/LibraryComponent';
import { ProfileComponent } from './Components/ProfileComponent';

function HeaderSwitcher() {
  const location = useLocation();
  const hideHeader = location.pathname.includes("/chat");
  return hideHeader ? null : <Header />;
}

function AuthenticatePath({ children }) {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <div className="App">
      <HeaderSwitcher />
      <Routes>
        <Route path="/" element={<WelcomeComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/signup" element={<SignUpComponent />} />
        <Route path="/:username/profile" element={<AuthenticatePath><ProfileComponent /></AuthenticatePath>} />
        <Route path="/home" element={<AuthenticatePath><HomeComponent /></AuthenticatePath>} />
        <Route path="/library" element={<AuthenticatePath><LibraryComponent /></AuthenticatePath>}/>
        <Route path="/clubs" element={<AuthenticatePath><ClubList /></AuthenticatePath>} />
        <Route path="/book/:isbn/:title" element={<AuthenticatePath><BookComponent /></AuthenticatePath>} />
        <Route path="/clubs/bookclub/:clubId/:clubname" element={<AuthenticatePath><BookClub /></AuthenticatePath>} />
        <Route path="/:genre/books" element={<AuthenticatePath><SearchByTagComponent /></AuthenticatePath>} />
        <Route path="/clubs/:clubid/:clubname/chat" element={<AuthenticatePath><Chat /></AuthenticatePath>} />
        <Route path="/search/:q" element={<AuthenticatePath><SearchComponent /></AuthenticatePath>} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        theme="dark"
      />
    </div>
  );
}

export default App;

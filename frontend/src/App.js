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


function App() {

  function AuthenticatePath({children}){
    const auth=useAuth();
    if (!auth.isAuthenticated) {
        return <Navigate to="/"/>; // redirect if not logged in
    }

    return children; // render the protected component
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          {/* Routes define which component to show for each path */}
          <Routes>
            <Route path="/" element={<WelcomeComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignUpComponent />} />
            <Route path="/home" element={<AuthenticatePath><HomeComponent/></AuthenticatePath>} />
            <Route path="/home/book/:isbn" element={<AuthenticatePath><BookComponent/></AuthenticatePath>} />
            <Route path="/:genre/books" element={<AuthenticatePath><SearchByTagComponent/></AuthenticatePath>} />
            <Route path="/clubs/:club/chat" element={<AuthenticatePath><Chat/></AuthenticatePath>} />
            <Route path="/search/:q" element={<AuthenticatePath><SearchComponent/></AuthenticatePath>} />
            {/* Later you can add more pages like Home, Library, Profile */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

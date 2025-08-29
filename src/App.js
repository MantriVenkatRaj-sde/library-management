import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
// import Footer from './Components/Footer';
import { LoginComponent } from './Components/LoginComponent';
import { SignUpComponent } from './Components/SignUpComponent';
import { WelcomeComponent } from './Components/WelcomeComponent';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        {/* Routes define which component to show for each path */}
        <Routes>
          <Route path="/" element={<WelcomeComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/signup" element={<SignUpComponent />} />
          {/* Later you can add more pages like Home, Library, Profile */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

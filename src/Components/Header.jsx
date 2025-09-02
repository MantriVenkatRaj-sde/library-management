import { Link } from "react-router-dom";
import "../Styling/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="nav-left">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/library" className="nav-link">Library</Link>
        <Link to="/recommendations" className="nav-link">Recommendations</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
      </div>

      <div className="nav-right">
        <Link to="/login" className="nav-btn">Sign In</Link>
        {/* If user is logged in, replace with Sign Out */}
      </div>
    </header>
  );
}

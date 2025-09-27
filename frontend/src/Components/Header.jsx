// Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styling/header.css";
import "../Styling/nav.css";
import { useAuth } from "../Authentication/AuthContext";
import { useGenres } from "../Contexts/GenreContext";
import { findByAuthor, findByBookTitle } from "../API/bookAPI";
import { useChatContext } from "../context/ChatContext";

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { genres } = useGenres();

  // safe guard for genres (avoid null-related crash)
  const safeGenres = Array.isArray(genres) ? genres : [];

  // overlay state
  const [overlayOpen, setOverlayOpen] = useState(false);

  // query state inside overlay
  const [query, setQuery] = useState("");

  // refs for focus management
  const overlayInputRef = useRef(null);
  const navbarInputRef = useRef(null);

  useEffect(() => {
    if (overlayOpen) {
      // focus the overlay input slightly after open
      setTimeout(() => overlayInputRef.current?.focus(), 50);

      // escape key closes overlay
      const onKey = (e) => {
        if (e.key === "Escape") {
          setOverlayOpen(false);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [overlayOpen]);

  // prevent form submission for navbar search (we open overlay instead)
  const onNavbarFormSubmit = (e) => {
    e.preventDefault();
    // optionally open overlay when user clicks the search button too
    setOverlayOpen(true);
  };

  // when user focuses navbar input, open overlay
  const onNavbarFocus = () => {
    setOverlayOpen(true);
  };

  // clicking a genre should set the query and focus input (and navigate if you want)
  const onGenreClick = (g) => {
    const name = g?.name ?? g;
    setQuery(name);
    setTimeout(() => overlayInputRef.current?.focus(), 50);
    // navigate to a genre route — use the genre name or id depending on your route design
    setOverlayOpen(false);
    navigate(`/${g}/books`);
  };

  // handle search using the typed query (q)
  const handleSearchSubmit = async (e) => {
    e?.preventDefault?.();
    const q = (query || "").trim();
    if (!q) return;

    try {
     
      // navigate to results page and pass results in state for instant render
      navigate(`/search/${q}`);

      setOverlayOpen(false);
    } catch (err) {
      console.error("Search error", err);
      // fallback: navigate to page that will re-fetch
      navigate(`/search/${q}`);
      setOverlayOpen(false);
    }
  };

  const chat=useChatContext();
  const handleLogOut = () => {
    chat.forgetUser();
    auth.logout();
    navigate("/");
  }
  const club = "Book Lovers";
  return (
    <>
      <header className="header mb-3" 
      style={{transition:"transform 0.3s"}}>
        <div className="nav-left">
          {auth.isAuthenticated && <Link to={`/${auth.user}/profile` } className="nav-link">Profile</Link>}
          {auth.isAuthenticated && <Link to="/home" className="nav-link">Home</Link>}
          
          {auth.isAuthenticated && <Link to="/library" className="nav-link">Library</Link>}
          {auth.isAuthenticated && <Link to={`/clubs`} className="nav-link">Clubs</Link>}
        </div>

        {/* Navbar search (keeps your classes) */}
        <form className="navbar-search" onSubmit={onNavbarFormSubmit}>
        {auth.isAuthenticated &&  <input
            ref={navbarInputRef}
            type="search"
            className="navbar-search input border-dark b-1 bg-secondary text-light m-1"
            placeholder="Search..."
            onFocus={onNavbarFocus}   // open overlay on click/focus
            readOnly                 // keep readonly so typing happens in overlay
          />}
        </form>

        <div className="nav-right">
          {!auth.isAuthenticated && <Link to="/login" className="nav-btn">Sign In</Link>}
          {/* {auth.isAuthenticated && <Link to="/" className="nav-link">Logout</Link>} */}
           {auth.isAuthenticated &&  <button  onClick={handleLogOut} className="nav-btn">Logout</button>}
        </div>
      </header>

      {/* Full-screen overlay */}
      {overlayOpen && (
        <div
          className="search-overlay"
          onClick={() => setOverlayOpen(false)} // clicking outside closes overlay
        >
          <div
            className="search-panel"
            onClick={(e) => e.stopPropagation()} // prevent overlay close when interacting with panel
          >
            {/* Search box in overlay */}
            <form className="search-box" onSubmit={handleSearchSubmit}>
              <input
                ref={overlayInputRef}
                type="text"
                placeholder="Search any book or author..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="navbar-search input"
              />
              <button type="submit" className="navbar-search btn">🔍</button>
            </form>

            {/* Genres (map from your actual genre list) */}
            <div className="genres" role="list">
              {safeGenres.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                  No genres loaded.
                </div>
              ) : (
                safeGenres.map((g) => (
                  <button
                    key={g.id ?? g.name ?? g}
                    onClick={() => onGenreClick(g)}
                    className="genre-chip"
                    type="button"
                  >
                    {g.name ?? g}
                  </button>
                ))
              )}
            </div>

            {/* small hint row (optional) */}
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
              Tip: press <kbd>Esc</kbd> to close.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

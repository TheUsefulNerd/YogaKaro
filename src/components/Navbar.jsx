import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar({ currentPage, setCurrentPage, user }) {
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    if (devMode) {
      document.body.classList.add("dev-theme");
    } else {
      document.body.classList.remove("dev-theme");
    }
  }, [devMode]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* 🧘 Brand */}
        <div className="nav-brand" onClick={() => setCurrentPage("home")}>
          <span className="brand-icon">🧘‍♀️</span>
          <span className="brand-text">YogaKaro</span>
        </div>

        {/* 📄 Navigation Links */}
        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === "Timer" ? "active" : ""}`}
            onClick={() => setCurrentPage("Timer")}
          >
            Timer
          </button>

          <button
            className={`nav-link ${currentPage === "chatbot" ? "active" : ""}`}
            onClick={() => setCurrentPage("chatbot")}
          >
            Nirvaana AI
          </button>

          <button
            className={`nav-link ${currentPage === "marketplace" ? "active" : ""}`}
            onClick={() => setCurrentPage("marketplace")}
          >
            Marketplace
          </button>

          <button
            className={`nav-link ${currentPage === "snap" ? "active" : ""}`}
            onClick={() => setCurrentPage("snap")}
          >
            Snap
          </button>
        </div>


        {/* 👤 Right Side: Dev Toggle + Auth */}
        <div className="right-section">
          <DevModeToggle devMode={devMode} setDevMode={setDevMode} />
          {user ? (
            <div className="user-menu">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="user-avatar"
              />
              <span className="user-name">{user.displayName}</span>
            </div>
          ) : (
            <button
              className="auth-button"
              onClick={() => setCurrentPage("auth")}
            >
              <span className="auth-icon">👤</span>
              Log in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// Toggle Switch Component (export not needed if only used here)
function DevModeToggle({ devMode, setDevMode }) {
  return (
    <div className="devmode-toggle-container">
      <label className="switch">
        <input
          type="checkbox"
          checked={devMode}
          onChange={() => setDevMode((prev) => !prev)}
        />
        <span className="slider round"></span>
      </label>
      <div className="devmode-label">Dev Mode</div>
    </div>
  );
}

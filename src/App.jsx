
import { useState } from 'react'
import './App.css'

function LoginWithReplit() {
  window.addEventListener("message", authComplete);
  var h = 500;
  var w = 350;
  var left = screen.width / 2 - w / 2;
  var top = screen.height / 2 - h / 2;

  var authWindow = window.open(
    "https://replit.com/auth_with_repl_site?domain=" + location.host,
    "_blank",
    "modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      w +
      ", height=" +
      h +
      ", top=" +
      top +
      ", left=" +
      left
  );

  function authComplete(e) {
    if (e.data !== "auth_complete") {
      return;
    }

    window.removeEventListener("message", authComplete);
    authWindow.close();
    location.reload();
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)

  // Check for user authentication
  const checkUser = async () => {
    try {
      const response = await fetch('/__replauthuser')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.log('Not authenticated')
    }
  }

  // Check user on component mount
  useState(() => {
    checkUser()
  }, [])

  const renderPage = () => {
    switch(currentPage) {
      case 'chatbot':
        return (
          <div className="page-content">
            <h1>AI Yoga Assistant</h1>
            <p>Your personal yoga chatbot to guide your practice and answer questions.</p>
            <div className="chatbot-placeholder">
              <div className="chat-message bot">
                <span>🧘‍♀️</span>
                <p>Hello! I'm your yoga assistant. How can I help you today?</p>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Ask me about yoga poses, breathing techniques..." />
                <button>Send</button>
              </div>
            </div>
          </div>
        )
      case 'marketplace':
        return (
          <div className="page-content">
            <h1>Yoga Marketplace</h1>
            <p>Discover yoga equipment, courses, and accessories.</p>
            <div className="marketplace-grid">
              <div className="marketplace-item">
                <div className="item-image">🧘‍♀️</div>
                <h3>Yoga Mat Premium</h3>
                <p>$29.99</p>
              </div>
              <div className="marketplace-item">
                <div className="item-image">🏃‍♀️</div>
                <h3>Meditation Course</h3>
                <p>$49.99</p>
              </div>
              <div className="marketplace-item">
                <div className="item-image">💪</div>
                <h3>Yoga Blocks Set</h3>
                <p>$19.99</p>
              </div>
            </div>
          </div>
        )
      case 'snap':
        return (
          <div className="page-content">
            <h1>Yoga Snap</h1>
            <p>Share your yoga journey with the community.</p>
            <div className="snap-feed">
              <div className="snap-post">
                <div className="snap-header">
                  <div className="snap-avatar">🧘</div>
                  <span>@yoga_enthusiast</span>
                </div>
                <div className="snap-content">
                  <p>Just finished my morning flow! Feeling energized ✨</p>
                  <div className="snap-image">📸 Sunrise Yoga Session</div>
                </div>
              </div>
              <div className="snap-post">
                <div className="snap-header">
                  <div className="snap-avatar">🌸</div>
                  <span>@mindful_yogi</span>
                </div>
                <div className="snap-content">
                  <p>Today's mantra: Breathe in peace, breathe out stress 🌿</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="page-content">
            <div className="hero-section">
              <h1 className="hero-title">Welcome to YogaKaro</h1>
              <p className="hero-subtitle">Your journey to mindfulness and wellness starts here</p>
              <button className="cta-button">Start Your Practice</button>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🧘‍♀️</div>
                <h3>Guided Sessions</h3>
                <p>Expert-led yoga sessions for all levels</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>AI Assistant</h3>
                <p>Get personalized yoga guidance anytime</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛍️</div>
                <h3>Marketplace</h3>
                <p>Premium yoga equipment and courses</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => setCurrentPage('home')}>
            <span className="brand-icon">🧘‍♀️</span>
            <span className="brand-text">YogaKaro</span>
          </div>
          
          <div className="nav-links">
            <button 
              className={`nav-link ${currentPage === 'chatbot' ? 'active' : ''}`}
              onClick={() => setCurrentPage('chatbot')}
            >
              Chatbot
            </button>
            <button 
              className={`nav-link ${currentPage === 'marketplace' ? 'active' : ''}`}
              onClick={() => setCurrentPage('marketplace')}
            >
              Marketplace
            </button>
            <button 
              className={`nav-link ${currentPage === 'snap' ? 'active' : ''}`}
              onClick={() => setCurrentPage('snap')}
            >
              Snap
            </button>
          </div>

          <div className="nav-auth">
            {user ? (
              <div className="user-menu">
                <img src={user.profileImage} alt={user.name} className="user-avatar" />
                <span className="user-name">{user.name}</span>
              </div>
            ) : (
              <button className="auth-button" onClick={LoginWithReplit}>
                <span className="auth-icon">👤</span>
                Log in
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

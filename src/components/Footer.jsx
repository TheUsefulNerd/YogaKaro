// Footer.jsx
import "./Footer.css";
import profilePic from "../assets/MY HANDLE.jpg"; // Adjust the path if needed

export default function Footer() {
  return (
    <footer className="footer-plain">
      <div className="footer-content footer-grid-horizontal">

        {/* LEFT SIDE: Photo + Bio + Socials */}
        <div className="footer-left">
          <img src={profilePic} alt="Advait Joshi" className="footer-avatar-large" />
          <div className="footer-info">
            <h4>Advait Joshi</h4>
            <p>
              Research Intern @UofSC(AIISC), IIT Patna, IIT Kanpur | Blockchain Developer Intern @Inspiring Wave | Contributor @GSSoC-2024-extd | SVIT CSE(DS) '2027
            </p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-twitter" /></a>
              <a href="#"><i className="fab fa-github" /></a>
              <a href="#"><i className="fab fa-linkedin" /></a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Link Sections */}
        <div className="footer-links">
          <div>
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Linkedin</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Instaagram</a></li>
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#">Cryptomining Simulator</a></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 YogaKaro. All rights reserved.</p>
      </div>
    </footer>
  );
}

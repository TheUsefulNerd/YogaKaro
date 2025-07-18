import React, {useState} from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../services/firebaseConfig";
import './AuthPage.css';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AuthPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEmailAuth = async () => {
        try{
            if(isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            console.error(err);
        }
    };

      return (
    <div className = "auth-wrapper">
    <div className="auth-container">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-content">
          <h1 className="auth-title">Welcome Back!</h1>
          <button className="google-button" onClick={handleGoogleLogin}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="google-icon"
            />
            Continue with Google
          </button>
          <div className="divider"><span>OR</span></div>
<input 
            type="email" 
            placeholder="Email" 
            className="input-field" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleEmailAuth}>
            {isSignup ? "Sign Up" : "Log In"}
          </button>

          <p className="bottom-text">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}
            <span 
              className="signup-link" 
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? " Log in" : " Sign up"}
            </span>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <img src="/public/Yoga Art.png" alt="Yoga Art" />
      </div>
    </div>
    </div>
  );
}
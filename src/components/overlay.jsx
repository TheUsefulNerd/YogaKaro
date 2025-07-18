// components/overlay.jsx
import React, { useEffect, useState } from 'react';
import './overlay.css';

export default function Overlay({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Step 1: wait before fade out starts
    const timer1 = setTimeout(() => setFadeOut(true), 2000); // show for 2s

    // Step 2: wait for fade out animation to complete before removing
    const timer2 = setTimeout(() => onFinish(), 3000); // total 3s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div className="overlay-screen">
    <div className={`overlay-screen ${fadeOut ? 'fade-out' : ''}`}>
      <h1>Namaste 🙏</h1>
    </div>
    </div>
  );
}

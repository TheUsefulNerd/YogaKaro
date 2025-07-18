export default function SnapPage() {
  return (
    <div className="page-content">
      <h1>Yoga Snap</h1>
      <p>Share your yoga journey with the community.</p>
      <div className="snap-feed mt-6">
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
  );
}

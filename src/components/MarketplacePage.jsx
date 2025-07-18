export default function MarketplacePage() {
  return (
    <div className="page-content">
      <h1>Yoga Marketplace</h1>
      <p>Discover yoga equipment, courses, and accessories.</p>
      <div className="marketplace-grid mt-6">
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
  );
}

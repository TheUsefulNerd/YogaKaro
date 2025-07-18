import "./DevModeSection.css";

export default function DevModeTeaser() {
  return (
    <section className="devmode-section devmode-section-inside">
      <div className="text-center mb-12 px-6">
        <h1 className="hero-title">Dev Mode Preview</h1>
        <p className="hero-subtitle">
          Explore upcoming features for developers & testers
        </p>
      </div>

      <div className="devmode-fake-toggle">
        <div className="switch">
          <div className="circle" />
        </div>
        <span className="hint-text">Turn on Dev Mode by clicking the toggle above</span>
      </div>

      <div className="devmode-grid">
        <div className="devmode-card">
          <div className="icon">🧬</div>
          <h3>Simulate Token Genesis</h3>
          <p>Craft digital value from scratch—define, mint, and manage your own on-chain asset blueprint</p>
        </div>

        <div className="devmode-card">
          <div className="icon">🧠</div>
          <h3>Deconstruct the Wallet</h3>
          <p>Peek inside the vault—understand the mechanics of key custody, balance logic, and secure interactions.</p>
        </div>

        <div className="devmode-card">
          <div className="icon">🔁</div>
          <h3>Trace On-Chain Logic</h3>
          <p>Uncover how smart contracts automate trust—follow the flow from intention to immutable execution.</p>
        </div>
      </div>
    </section>
  );
}

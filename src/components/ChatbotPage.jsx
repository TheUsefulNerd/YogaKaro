// components/ChatbotPage.jsx
export default function ChatbotPage() {
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
  );
}

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Spinner } from "react-bootstrap";

function ChatBox({ botName }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);

    const currentQuery = query;
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        bot_name: botName,
        query: currentQuery,
      });

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: res.data.response },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <h5 className="mb-3 d-flex align-items-center">
        <i className="bi bi-chat me-2"></i> Chat with{" "}
        <strong className="ms-2">{botName}</strong>
      </h5>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="bi bi-chat-dots display-4"></i>
            <p className="mt-3">Start chatting with {botName}!</p>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}-message`}>
                <div className="message-content">
                  {msg.type === "user" ? (
                    <>
                      <i className="bi bi-person-circle me-2"></i> You
                    </>
                  ) : msg.type === "error" ? (
                    <>
                      <i className="bi bi-exclamation-triangle me-2"></i> Error
                    </>
                  ) : (
                    <>
                      <i className="bi bi-robot me-2"></i> {botName}
                    </>
                  )}
                  <div className="message-text">{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot-message typing">
                <div className="message-content">
                  <i className="bi bi-robot me-2"></i> {botName}
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <Form className="chat-input mt-3">
        <div className="d-flex gap-2">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Ask something..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="message-input"
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="send-button"
          >
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <i className="bi bi-send-fill"></i>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ChatBox;

import { ListGroup, Button, Spinner } from "react-bootstrap";

function BotList({ bots, onSelect, loading }) {
  return (
    <div className="bot-list-container">
      <h5 className="mb-3 d-flex align-items-center">
        <i className="bi bi-list-ul me-2"></i> Available Chatbots
      </h5>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading chatbots...</p>
        </div>
      ) : bots.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No chatbots available. Upload a book to create your first chatbot!
        </div>
      ) : (
        <ListGroup className="bot-list">
          {bots.map((bot, index) => (
            <ListGroup.Item
              key={bot}
              className="d-flex justify-content-between align-items-center bot-item"
              action
            >
              <span className="bot-name">
                <i className="bi bi-robot me-2 text-primary"></i>
                {bot}
              </span>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onSelect(bot)}
                className="chat-btn"
              >
                <i className="bi bi-chat-left-dots me-1"></i> Chat
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default BotList;

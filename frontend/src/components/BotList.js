import React from "react";

function BotList({ bots, onSelect }) {
  return (
    <div>
      <h5>
        <i className="bi bi-list-ul"></i> Available Chatbots
      </h5>
      <ul className="list-group">
        {bots.map((bot) => (
          <li
            key={bot}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{bot}</span>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onSelect(bot)}
            >
              <i className="bi bi-chat-left-dots"></i> Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BotList;

import React, { useState } from "react";
import axios from "axios";

function ChatBox({ botName }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    if (!query) return;

    const res = await axios.post("http://localhost:5000/chat", {
      bot_name: botName,
      query: query,
    });

    setResponse(res.data.response);
  };

  return (
    <div className="mt-4">
      <h5>
        <i className="bi bi-chat"></i> Chat with <strong>{botName}</strong>
      </h5>
      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
      {response && (
        <div
          className="alert alert-info mt-3"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {response}
        </div>
      )}
    </div>
  );
}

export default ChatBox;

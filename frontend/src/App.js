import React, { useState, useEffect } from "react";
import UploadBot from "./components/UploadBot";
import BotList from "./components/BotList";
import ChatBox from "./components/ChatBox";
import axios from "axios";

function App() {
  const [bots, setBots] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);

  const fetchBots = async () => {
    const res = await axios.get("http://localhost:5000/bots");
    setBots(res.data.bots);
  };

  useEffect(() => {
    fetchBots();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        <i className="bi bi-robot"></i> RAG Chatbot Manager
      </h2>
      <UploadBot onUpload={fetchBots} />
      <hr />
      <BotList bots={bots} onSelect={setSelectedBot} />
      <hr />
      {selectedBot && <ChatBox botName={selectedBot} />}
    </div>
  );
}

export default App;

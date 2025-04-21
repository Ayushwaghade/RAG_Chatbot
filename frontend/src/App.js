import { useState, useEffect } from "react";
import UploadBot from "./components/UploadBot";
import BotList from "./components/BotList";
import ChatBox from "./components/ChatBox";
import axios from "axios";
import { Fade } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function App() {
  const [bots, setBots] = useState([]);
  const [selectedBot, setSelectedBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("list");
  const fetchBots = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/bots");
      setBots(res.data.bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleSelectBot = (bot) => {
    setSelectedBot(bot);
    setActiveSection("chat");
  };

  const handleBackToList = () => {
    setActiveSection("list");
  };

  return (
    <div className="container mt-4 app-container">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="text-center mb-0">
            <i className="bi bi-robot me-2"></i> RAG Chatbot Manager
          </h2>
        </div>
        <div className="card-body">
          <Fade in={true}>
            <div>
              <UploadBot onUpload={fetchBots} />
            </div>
          </Fade>

          <hr className="divider" />

          {activeSection === "list" ? (
            <Fade in={true}>
              <div>
                <BotList
                  bots={bots}
                  onSelect={handleSelectBot}
                  loading={loading}
                />
              </div>
            </Fade>
          ) : (
            <Fade in={true}>
              <div>
                <button
                  className="btn btn-outline-secondary mb-3"
                  onClick={handleBackToList}
                >
                  <i className="bi bi-arrow-left me-2"></i> Back to List
                </button>
                <ChatBox botName={selectedBot} />
              </div>
            </Fade>
          )}
        </div>
        <div className="card-footer text-center text-muted">
          <small>RAG Chatbot Manager &copy; {new Date().getFullYear()}</small>
        </div>
      </div>
    </div>
  );
}

export default App;

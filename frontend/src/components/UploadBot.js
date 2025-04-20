import React, { useState } from "react";
import axios from "axios";

function UploadBot({ onUpload }) {
  const [botName, setBotName] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!botName || !file) return alert("Provide bot name and file.");

    const formData = new FormData();
    formData.append("bot_name", botName);
    formData.append("file", file);

    await axios.post("http://localhost:5000/upload", formData);
    alert("Bot created successfully");
    setBotName("");
    setFile(null);
    onUpload();
  };

  return (
    <div>
      <h5>
        <i className="bi bi-upload"></i> Upload Book to Create Chatbot
      </h5>
      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Bot Name"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn btn-success" onClick={handleUpload}>
          <i className="bi bi-plus-circle"></i> Create
        </button>
      </div>
    </div>
  );
}

export default UploadBot;

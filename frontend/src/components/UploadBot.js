import { useState, useRef } from "react";
import axios from "axios";
import { Form, Button, InputGroup, Spinner, Alert } from "react-bootstrap";

function UploadBot({ onUpload }) {
  const [botName, setBotName] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose file...");
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState({
    show: false,
    message: "",
    type: "",
  });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const resetForm = () => {
    setBotName("");
    setFile(null);
    setFileName("Choose file...");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!botName || !file) {
      setFeedback({
        show: true,
        message: "Please provide both bot name and file.",
        type: "danger",
      });
      setTimeout(
        () => setFeedback({ show: false, message: "", type: "" }),
        3000
      );
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("bot_name", botName);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      setFeedback({
        show: true,
        message: "Bot created successfully!",
        type: "success",
      });
      resetForm();
      onUpload();
    } catch (error) {
      setFeedback({
        show: true,
        message:
          "Error creating bot: " +
          (error.response?.data?.message || error.message),
        type: "danger",
      });
    } finally {
      setUploading(false);
      setTimeout(
        () => setFeedback({ show: false, message: "", type: "" }),
        3000
      );
    }
  };

  return (
    <div className="upload-bot-container">
      <h5 className="mb-3 d-flex align-items-center">
        <i className="bi bi-upload me-2"></i> Upload Book to Create Chatbot
      </h5>

      <Alert
        variant={feedback.type}
        show={feedback.show}
        onClose={() => setFeedback({ show: false, message: "", type: "" })}
        dismissible
        className="upload-alert"
      >
        {feedback.message}
      </Alert>

      <Form>
        <div className="row g-3">
          <div className="col-md-4">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Bot Name"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                disabled={uploading}
                className="bot-name-input"
              />
            </Form.Group>
          </div>

          <div className="col-md-5">
            <Form.Group>
              <InputGroup>
                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="file-input"
                />
              </InputGroup>
            </Form.Group>
          </div>

          <div className="col-md-3">
            <Button
              variant="success"
              onClick={handleUpload}
              disabled={uploading}
              className="w-100 create-btn"
            >
              {uploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i> Create
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default UploadBot;

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
import faiss
import pickle
from sentence_transformers import SentenceTransformer
import numpy as np
from transformers import pipeline
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-2.0-flash")
PDF_DIR = "pdfs"
VECTOR_DIR = "vectorstores"
os.makedirs(PDF_DIR, exist_ok=True)
os.makedirs(VECTOR_DIR, exist_ok=True)

model = SentenceTransformer('all-MiniLM-L6-v2')
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

# ---------- PDF Processing ----------
def pdf_to_text(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text

def split_text(text, chunk_size=500):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

# ---------- Bot Creation ----------
def create_bot(book_file, bot_name):
    pdf_path = os.path.join(PDF_DIR, f"{bot_name}.pdf")
    book_file.save(pdf_path)

    text = pdf_to_text(pdf_path)
    chunks = split_text(text)
    embeddings = model.encode(chunks)

    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))
    
    with open(os.path.join(VECTOR_DIR, f"{bot_name}.pkl"), 'wb') as f:
        pickle.dump({"index": index, "chunks": chunks}, f)

# ---------- Summarization Helper ----------
def summarize_text(text, max_len=130):
    if len(text.split()) < 50:
        return text  # Skip short ones
    summary = summarizer(text, max_length=max_len, min_length=30, do_sample=False)
    return summary[0]['summary_text']

# ---------- API Routes ----------
@app.route("/upload", methods=["POST"])
def upload():
    bot_name = request.form.get("bot_name")
    file = request.files.get("file")

    if not bot_name or not file:
        return jsonify({"error": "Missing bot_name or file"}), 400

    create_bot(file, bot_name)
    return jsonify({"message": f"Bot '{bot_name}' created successfully"}), 200

@app.route("/bots", methods=["GET"])
def list_bots():
    bots = [f.replace(".pkl", "") for f in os.listdir(VECTOR_DIR) if f.endswith(".pkl")]
    return jsonify({"bots": bots})
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    bot_name = data.get("bot_name")
    query = data.get("query")

    vector_path = os.path.join(VECTOR_DIR, f"{bot_name}.pkl")
    if not os.path.exists(vector_path):
        return jsonify({"error": "Bot not found"}), 404

    with open(vector_path, "rb") as f:
        vector_data = pickle.load(f)

    query_embedding = model.encode([query])
    D, I = vector_data["index"].search(np.array(query_embedding), k=5)
    context_chunks = [vector_data["chunks"][i] for i in I[0]]
    context = "\n\n".join(context_chunks)

    prompt = f"""
    You are an expert assistant trained on the content of a book. 
    A user has asked a question based on the book.

    📘 Book context:
    {context}

    ❓ Question:
    {query}

    ✅ Please give a helpful, clear answer based strictly on the book content above.
    """

    try:
        response = gemini_model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Main ----------
if __name__ == "__main__":
    app.run(debug=True)

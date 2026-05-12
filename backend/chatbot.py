import os
import re
import faiss
import pickle
from sentence_transformers import SentenceTransformer

# Global variables
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
embeddings_index = None
paragraphs = []  # store all paragraphs corresponding to embeddings

def clean(text):
    return re.sub(r"\s+", " ", text).strip()

# ================= LOAD DOCUMENT =================
def load_document(file_path):
    global embeddings_index, paragraphs

    paragraphs = []

    # Extract text from PDF
    if file_path.endswith(".pdf"):
        import pdfplumber
        with pdfplumber.open(file_path) as pdf:
            for page_num, p in enumerate(pdf.pages, start=1):
                text = p.extract_text() or ""
                for line in text.split("\n"):
                    line = clean(line)
                    if len(line) > 20:  # ignore very short lines
                        paragraphs.append(line)

    # Extract text from DOCX
    else:
        import docx
        doc = docx.Document(file_path)
        for p in doc.paragraphs:
            text = clean(p.text)
            if len(text) > 20:
                paragraphs.append(text)

    # Create embeddings for all paragraphs
    embeddings = model.encode(paragraphs, convert_to_numpy=True)

    # Build FAISS index
    dimension = embeddings.shape[1]
    embeddings_index = faiss.IndexFlatL2(dimension)
    embeddings_index.add(embeddings)

    # Optional: save index to disk
    # faiss.write_index(embeddings_index, "faiss_index.bin")
    # pickle.dump(paragraphs, open("paragraphs.pkl", "wb"))

# ================= ASK BOT =================
def ask_bot(query, top_k=3):
    global embeddings_index, paragraphs

    if not embeddings_index:
        return "No document loaded yet."

    query_emb = model.encode([query], convert_to_numpy=True)
    distances, indices = embeddings_index.search(query_emb, top_k)

    # Collect top matching paragraphs
    answers = [paragraphs[i] for i in indices[0] if i < len(paragraphs)]
    return " ".join(answers) if answers else "No relevant information found."


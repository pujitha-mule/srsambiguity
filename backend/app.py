# File: app.py

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from functools import wraps
import jwt
import os
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import pdfplumber
import docx
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
import re
from pymongo import MongoClient
import certifi

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"])

app.config["SECRET_KEY"] = "super_secret_key"

# ==============================
# MongoDB
# ==============================

MONGO_URI = "mongodb+srv://srsuser:srs123@cluster0.7nd42fr.mongodb.net/srsdb?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["srsdb"]

users_collection = db["users"]
documents_collection = db["documents"]

UPLOAD_FOLDER = "uploads"
REPORT_FOLDER = "reports"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

# ==============================
# JWT Decorator
# ==============================

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token missing"}), 401
        try:
            token = token.split(" ")[1]
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = data["user_id"]
        except:
            return jsonify({"error": "Invalid token"}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# ==============================
# Register
# ==============================

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data["email"].lower()

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    user_id = str(uuid.uuid4())

    users_collection.insert_one({
        "id": user_id,
        "email": email,
        "password": generate_password_hash(data["password"])
    })

    return jsonify({"message": "Registered successfully"}), 201

# ==============================
# Login
# ==============================

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user = users_collection.find_one({"email": data["email"]})
    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {"user_id": user["id"], "exp": datetime.utcnow() + timedelta(hours=24)},
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({"token": token})

# ==============================
# Upload
# ==============================

@app.route("/upload", methods=["POST"])
@token_required
def upload(current_user):

    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files["file"]
    file_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_FOLDER, file_id + "_" + file.filename)
    file.save(save_path)

    documents_collection.insert_one({
        "id": file_id,
        "filename": file.filename,
        "user_id": current_user,
        "status": "Uploaded",
        "upload_date": datetime.utcnow(),
        "analyzed_date": None,
        "ambiguity_score": None,
        "report_path": None
    })

    return jsonify({"file_id": file_id})

# ==============================
# SMART AI-LIKE ANALYSIS LOGIC
# ==============================

def analyze_text(text):

    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]

    findings = []
    type_counts = {"Lexical": 0, "Syntactic": 0, "Semantic": 0, "Vague": 0}
    severity_counts = {"High": 0, "Medium": 0, "Low": 0}

    lexical_words = ["fast", "efficient", "appropriate", "user-friendly",
                     "robust", "quick", "simple", "flexible", "secure"]

    semantic_patterns = ["at least", "at most", "minimum", "maximum", "range"]

    modal_words = ["may", "might", "could", "should"]

    for i, sent in enumerate(sentences, 1):

        sent_lower = sent.lower()
        ambiguity_type = None
        severity = None
        suggestion = ""

        # -------- VAGUE MODAL --------
        if any(word in sent_lower for word in modal_words):
            ambiguity_type = "Vague"
            severity = "High"
            suggestion = "Replace modal verb with mandatory requirement like 'shall' or 'must'."

        # -------- LEXICAL --------
        elif any(word in sent_lower for word in lexical_words):
            ambiguity_type = "Lexical"
            severity = "Medium"
            suggestion = "Define subjective term using measurable or testable criteria."

        # -------- SEMANTIC --------
        elif any(pattern in sent_lower for pattern in semantic_patterns):
            ambiguity_type = "Semantic"
            severity = "High"
            suggestion = "Specify exact numeric boundaries or clarify the defined range."

        # -------- SYNTACTIC --------
        elif "and/or" in sent_lower or sent.count(",") >= 3:
            ambiguity_type = "Syntactic"
            severity = "Low"
            suggestion = "Break complex sentence into smaller atomic requirements."

        if ambiguity_type:
            findings.append({
                "id": f"REQ-{i:03}",
                "sentence": sent,
                "type": ambiguity_type,
                "severity": severity,
                "suggestion": suggestion
            })

            type_counts[ambiguity_type] += 1
            severity_counts[severity] += 1

    total_sentences = len(sentences)
    total_ambiguities = len(findings)

    health_score = 100 - int((total_ambiguities / max(total_sentences, 1)) * 100)

    return {
        "health_score": health_score,
        "total_ambiguities": total_ambiguities,
        "type_distribution": type_counts,
        "severity_distribution": severity_counts,
        "findings": findings
    }

# ==============================
# Analyze Route
# ==============================

@app.route("/analyze/<file_id>", methods=["POST"])
@token_required
def analyze(current_user, file_id):

    document = documents_collection.find_one({"id": file_id, "user_id": current_user})
    if not document:
        return jsonify({"error": "Not found"}), 404

    file_path = os.path.join(UPLOAD_FOLDER, file_id + "_" + document["filename"])

    text = ""
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    elif file_path.endswith(".docx"):
        docx_file = docx.Document(file_path)
        for para in docx_file.paragraphs:
            text += para.text

    analysis = analyze_text(text)

    report_path = os.path.join(REPORT_FOLDER, file_id + "_report.pdf")
    pdf_doc = SimpleDocTemplate(report_path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph(f"Ambiguity Report: {document['filename']}", styles["Heading1"]))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(f"Health Score: {analysis['health_score']}%", styles["Normal"]))
    elements.append(Paragraph(f"Total Ambiguities: {analysis['total_ambiguities']}", styles["Normal"]))

    pdf_doc.build(elements)

    documents_collection.update_one(
        {"id": file_id},
        {"$set": {
            "status": "Analyzed",
            "analyzed_date": datetime.utcnow(),
            "ambiguity_score": analysis["health_score"],
            "report_path": report_path
        }}
    )

    return jsonify(analysis)

# ==============================
# History
# ==============================

@app.route("/history", methods=["GET"])
@token_required
def history(current_user):

    docs = list(documents_collection.find(
        {"user_id": current_user},
        {"_id": 0}
    ))

    return jsonify(docs)

# ==============================
# Download Report
# ==============================

@app.route("/report/<file_id>", methods=["GET"])
@token_required
def download_report(current_user, file_id):

    document = documents_collection.find_one(
        {"id": file_id, "user_id": current_user}
    )

    if not document or not document.get("report_path"):
        return jsonify({"error": "Report not found"}), 404

    return send_file(document["report_path"], as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
// src/pages/Upload.js
import { useState } from "react";
import Reports from "./Reports";

function Upload() {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // ✅ NEW: Help modal state
  const [showHelp, setShowHelp] = useState(false);

  // =========================
  // FILE SELECT
  // =========================
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setUploaded(false);
    setAnalyzed(false);
    setFileId(null);
  };

  // =========================
  // UPLOAD
  // =========================
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setUploading(false);
        return;
      }

      setFileId(data.file_id);
      setUploaded(true);
      alert("Upload successful!");

    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    }

    setUploading(false);
  };

  // =========================
  // ANALYZE
  // =========================
  const handleAnalyze = async () => {
    if (!fileId) return;

    setAnalyzing(true);

    try {
      const response = await fetch(
        `http://localhost:5000/analyze/${fileId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Analysis failed");

      setAnalyzed(true);
      alert("Analysis completed!");
    } catch (error) {
      console.error("Analyze error:", error);
      alert("Analysis failed.");
    }

    setAnalyzing(false);
  };

  return (
    <div className="upload-wrapper">

      {/* ✅ HELP BUTTON */}
      <button 
        className="help-btn"
        onClick={() => setShowHelp(true)}
      >
        ?
      </button>

      {/* Upload Box */}
      <label className="upload-box">
        <p>📄 Drag & Drop your SRS document here</p>
        <p>or Click to Browse</p>
        <input type="file" hidden onChange={handleFileChange} />
      </label>

      {file && <div className="file-name">Selected: {file.name}</div>}

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        <button
          className="btn btn-primary"
          disabled={!uploaded || analyzing}
          onClick={handleAnalyze}
        >
          {analyzing ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Show Report automatically after analysis */}
      {analyzed && fileId && <Reports fileId={fileId} />}

      {/* ✅ HELP POPUP */}
      {showHelp && (
        <div className="help-overlay">
          <div className="help-modal">

            <h2>📘 User Manual</h2>

            <h3>🔍 Types of Ambiguity</h3>
            <table className="help-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lexical</td>
                  <td>Vague or subjective words</td>
                  <td>"fast", "efficient"</td>
                </tr>
                <tr>
                  <td>Semantic</td>
                  <td>Unclear limits or meaning</td>
                  <td>"minimum", "range"</td>
                </tr>
                <tr>
                  <td>Syntactic</td>
                  <td>Complex sentence structure</td>
                  <td>"and/or", long sentences</td>
                </tr>
                <tr>
                  <td>Vague</td>
                  <td>Uncertain modal verbs</td>
                  <td>"may", "might", "should"</td>
                </tr>
              </tbody>
            </table>

            <h3>⚠️ Severity Levels</h3>
            <table className="help-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Meaning</th>
                  <th>Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>High</td>
                  <td>Very unclear</td>
                  <td>Modal verbs, unclear limits</td>
                </tr>
                <tr>
                  <td>Medium</td>
                  <td>Moderate issue</td>
                  <td>Vague words</td>
                </tr>
                <tr>
                  <td>Low</td>
                  <td>Minor issue</td>
                  <td>Sentence complexity</td>
                </tr>
              </tbody>
            </table>

            <h3>💚 Health Score</h3>
            <p>
              Health Score indicates the overall quality of the SRS document.
              Higher score means better clarity and fewer ambiguities.
            </p>

            <button 
              className="close-btn"
              onClick={() => setShowHelp(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Upload;
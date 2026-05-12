import { useEffect, useState } from "react";

function History() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/history", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    setDocuments(data);
  };

  const downloadReport = async (fileId) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/report/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Ambiguity_Report.pdf";
    a.click();
  };

  // 🔥 NEW DELETE FUNCTION
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      // ✅ Remove from UI instantly
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));

    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting file");
    }
  };

  const getStatusClass = (status) => {
    if (status === "Analyzed") return "status-complete";
    if (status === "Uploaded") return "status-processing";
    return "status-failed";
  };

  const getRiskLabel = (score) => {
    if (score <= 30) return "High Risk";
    if (score <= 60) return "Medium Risk";
    return "Low Risk";
  };

  return (
    <div className="history-container">
      <h1 className="history-title">Document History</h1>

      <table className="history-table">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Date Analyzed</th>
            <th>Report Score</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.filename}</td>

              <td>
                {doc.analyzed_date
                  ? new Date(doc.analyzed_date).toLocaleString()
                  : "—"}
              </td>

              <td>
                {doc.ambiguity_score !== undefined ? (
                  <>
                    <span className="score-value">
                      {doc.ambiguity_score}%
                    </span>
                    <div className="risk-label">
                      {getRiskLabel(doc.ambiguity_score)}
                    </div>
                  </>
                ) : (
                  "—"
                )}
              </td>

              <td>
                <span className={`status-badge ${getStatusClass(doc.status)}`}>
                  {doc.status}
                </span>
              </td>

              <td>
                {doc.status === "Analyzed" && (
                  <button
                    className="download-btn"
                    onClick={() => downloadReport(doc.id)}
                  >
                    Download
                  </button>
                )}

                {/* 🔥 DELETE BUTTON ADDED */}
                <button
  className="delete-btn"
  onClick={() => handleDelete(doc.id)}
>
  Delete
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
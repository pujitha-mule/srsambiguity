// File: Reports.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import HealthCircle from "./HealthCircle";

function Reports({ fileId }) {

  const [analysis, setAnalysis] = useState(null);
  const [conclusion, setConclusion] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    axios.post(`http://localhost:5000/analyze/${fileId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {

      setAnalysis(res.data);

      const total = res.data.total_ambiguities || 0;
      const high = res.data.severity_distribution?.High || 0;
      const medium = res.data.severity_distribution?.Medium || 0;
      const low = res.data.severity_distribution?.Low || 0;

      let text="";

      if(total===0){
        text="Great! No ambiguities detected. The document is clear.";
      }else{
        text=`The document contains ${total} ambiguous sentence(s).

High severity: ${high}
Medium severity: ${medium}
Low severity: ${low}

Recommendations:
• Fix high severity issues first
• Clarify vague wording
• Break complex sentences`;
      }

      setConclusion(text);

    })
    .catch(err=>console.error(err));

  },[fileId]);

  const downloadPDF = async () => {

    try{

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/report/${fileId}`,
        {
          headers:{ Authorization:`Bearer ${token}` },
          responseType:"blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href=url;
      link.download=`Ambiguity_Report_${fileId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

    }catch(err){
      console.error(err);
      alert("PDF download failed");
    }

  };

  // 🔥 NEW: severity color helper
  const getSeverityClass = (severity) => {
    if (severity === "High") return "high";
    if (severity === "Medium") return "medium";
    return "low";
  };

  if(!analysis) return <div>Analyzing...</div>;
  const maxType = Math.max(...Object.values(analysis.type_distribution || {}));
  const maxSeverity = Math.max(...Object.values(analysis.severity_distribution || {}));
  return (

    <div className="report-container">

      <div className="report-header">
        <h1>Ambiguity Detection Report</h1>
        <button className="export-btn" onClick={downloadPDF}>
  Export / Print PDF
</button>
      </div>

      {/* 🔥 Executive Summary with Progress Bar */}
      <div className="card">
        <h2>Health Circle</h2>

        <HealthCircle score={analysis.health_score}/>

        <p>Total Ambiguities: {analysis.total_ambiguities}</p>

        {/* 🔥 NEW PROGRESS BAR */}
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${analysis.health_score}%` }}
          ></div>
        </div>

      </div>

      <div className="card">
        <h2>Ambiguity Distribution (Type)</h2>

        {Object.entries(analysis.type_distribution || {}).map(([type, count]) => (
          <div key={type} className="bar-row">

            <span className="label">{type}</span>

            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: `${(count / maxType) * 100}%` }}
              ></div>
            </div>

            <span className="value">{count}</span>

          </div>
        ))}

      </div>

      <div className="card">
        <h2>Severity Distribution</h2>

        {Object.entries(analysis.severity_distribution || {}).map(([sev, count]) => (
          <div key={sev} className="bar-row">

            <span className="label">{sev}</span>

            <div className="bar">
              <div
                className={`bar-fill ${sev.toLowerCase()}`}
                style={{ width: `${(count / maxSeverity) * 100}%` }}
              ></div>
            </div>

            <span className="value">{count}</span>

          </div>
        ))}

      </div>

      {/* 🔥 IMPROVED SENTENCE UI */}
      <div className="card">
        <h2>Sentence-Level Ambiguity Detection</h2>

        <div className="sentence-container">
          {analysis.findings.map(item => (
            <div 
              key={item.id} 
              className={`sentence-card ${getSeverityClass(item.severity)}`}
            >
              <div className="sentence-header">
                <span>#{item.id}</span>
                <span className="badge">{item.type}</span>
                <span className="severity">{item.severity}</span>
              </div>

              <div className="sentence-text">
                {item.sentence}
              </div>

              <div className="suggestion">
                💡 {item.suggestion}
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="card">
        <h2>Conclusion & Next Steps</h2>
        <p style={{whiteSpace:"pre-line"}}>{conclusion}</p>
      </div>

    </div>

  );

}

export default Reports;
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [totalDocs, setTotalDocs] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/history", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const docs = res.data || [];

        // ✅ Total Documents
        setTotalDocs(docs.length);

        // ✅ Average Score
        let totalScore = 0;
        let count = 0;

        docs.forEach(doc => {
          if (doc.ambiguity_score !== null) {
            totalScore += doc.ambiguity_score;
            count++;
          }
        });

        const avg = count > 0 ? Math.round(totalScore / count) : 0;
        setAvgScore(avg);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card-container">

  <div className="card blue">
    <div className="card-header">
      <span className="icon">📄</span>
      
    </div>
    <h4>Total Documents</h4>
    <p>{totalDocs}</p>
  </div>

  <div className="card green">
    <div className="card-header">
      <span className="icon">📊</span>
      
    </div>
    <h4>Average Score</h4>
    <p>{avgScore}%</p>
  </div>

  <div className="card orange">
    <div className="card-header">
      <span className="icon">⚠️</span>
    </div>
    <h4>Most Common Type</h4>
    <h2>Lexical</h2>
  </div>

</div>
  );
}

export default Dashboard;
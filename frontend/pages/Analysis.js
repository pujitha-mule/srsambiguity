import { useParams } from "react-router-dom";

export default function Analysis() {
  const { documentId } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Document Analysis - ID: {documentId}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          PDF Preview (Heatmap Here)
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Sentence: The system should be fast.</p>
          <p>Page: 3</p>
          <p>Type: Lexical</p>
          <p>Confidence: 85%</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">
            Suggest Rewrite
          </button>
        </div>
      </div>
    </div>
  );
}

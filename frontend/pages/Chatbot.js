
export default function Chatbot() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">SRS Assistant</h2>

      <div className="bg-white p-6 rounded-xl shadow h-96 overflow-y-scroll">
        <div className="mb-4">
          <p className="bg-gray-200 p-3 rounded">What is lexical ambiguity?</p>
        </div>

        <div className="mb-4 text-right">
          <p className="bg-blue-600 text-white p-3 rounded">
            Lexical ambiguity occurs when a word has multiple meanings.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useParams } from "react-router-dom";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Analytics() {
  const { documentId } = useParams();

  const pieData = [
    { name: "Lexical", value: 10 },
    { name: "Syntactic", value: 5 },
    { name: "Semantic", value: 8 },
    { name: "Vague", value: 6 },
  ];

  const barData = [
    { page: "1", count: 2 },
    { page: "2", count: 5 },
    { page: "3", count: 7 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Document Analytics - ID: {documentId}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <PieChart width={300} height={300}>
          <Pie data={pieData} dataKey="value" outerRadius={100} fill="#8884d8" />
          <Tooltip />
        </PieChart>

        <BarChart width={400} height={300} data={barData}>
          <XAxis dataKey="page" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  );
}
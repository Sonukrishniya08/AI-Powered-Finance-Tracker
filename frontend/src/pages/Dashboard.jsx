import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);

  const [aiInsight, setAiInsight] = useState("");
  const [aiMonth, setAiMonth] = useState("");
  const [aiYear, setAiYear] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    fetchSummary();
    fetchChart();
  }, []);

  const fetchSummary = async () => {
    const res = await axios.get("/dashboard/summary");
    setSummary(res.data);
  };

  const fetchChart = async () => {
    const res = await axios.get("/dashboard/chart");
    setChartData(res.data);
  };

  // ✅ AI Insight Fetch Function
  const fetchAIInsight = async () => {
    try {
      if (!aiMonth || !aiYear) {
        alert("Please enter month and year");
        return;
      }

      setLoadingAI(true);

      const res = await axios.get(
        `/dashboard/ai-insight?month=${aiMonth}&year=${aiYear}`
      );

      setAiInsight(res.data.insight);

    } catch (err) {
      console.log(err);
      setAiInsight("Failed to generate insight.");
    } finally {
      setLoadingAI(false);
    }
  };

  if (!summary) return <div className="card">Loading...</div>;

  const data = {
    labels: chartData.map((item) => `Month ${item.month}`),
    datasets: [
      {
        label: "Income",
        data: chartData.map((item) => item.income),
        backgroundColor: "#22c55e",
      },
      {
        label: "Expense",
        data: chartData.map((item) => item.expense),
        backgroundColor: "#ef4444",
      },
    ],
  };

  return (
    <div>

      <h2>📊 Financial Overview</h2>

      <div className="dashboard-cards">

        <div className="stat-card income">
          <h3>Total Income</h3>
          <p>₹ {summary.totalIncome}</p>
        </div>

        <div className="stat-card expense">
          <h3>Total Expense</h3>
          <p>₹ {summary.totalExpense}</p>
        </div>

        <div className="stat-card savings">
          <h3>Net Savings</h3>
          <p>₹ {summary.savings}</p>
        </div>

      </div>

      <div className="chart-card">
        <Bar data={data} />
      </div>

      {/* ================= AI SECTION ================= */}

      <div className="ai-section">

        <h3>🤖 AI Financial Insights</h3>

        <div className="ai-inputs">
          <input
            type="number"
            placeholder="Month (1-12)"
            value={aiMonth}
            onChange={(e) => setAiMonth(e.target.value)}
          />

          <input
            type="number"
            placeholder="Year"
            value={aiYear}
            onChange={(e) => setAiYear(e.target.value)}
          />

          <button onClick={fetchAIInsight}>
            {loadingAI ? "Generating..." : "Generate Insight"}
          </button>
        </div>

        {aiInsight && (
          <div className="ai-card">

            {aiInsight.split("\n").map((line, index) => {

              if (line.includes("Short Summary")) {
                return <h4 key={index} className="ai-heading">📊 Summary</h4>;
              }

              if (line.includes("Financial Advice")) {
                return <h4 key={index} className="ai-heading">💡 Financial Advice</h4>;
              }

              if (line.includes("Risk Warning")) {
                return <h4 key={index} className="ai-heading risk-title">⚠ Risk Warning</h4>;
              }

              if (line.trim().startsWith("-") || line.trim().match(/^\d+\./)) {
                return (
                  <li key={index}>
                    {line.replace(/^\d+\.\s*/, "").replace("-", "")}
                  </li>
                );
              }

              return <p key={index}>{line}</p>;
            })}

          </div>
        )}

      </div>

    </div>
  );
}


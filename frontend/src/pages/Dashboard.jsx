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

    </div>
  );
}


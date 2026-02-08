import { useState } from "react";
import axios from "../api/axios";

export default function Reports() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [data, setData] = useState(null);

  const fetchReport = async () => {
    const res = await axios.get(
      `/dashboard/monthly-report?month=${month}&year=${year}`
    );
    setData(res.data);
  };

  return (
    <div className="card">
      <h2>📊 Monthly Report</h2>

      <input
        placeholder="Month"
        type="number"
        onChange={(e) => setMonth(e.target.value)}
      />

      <input
        placeholder="Year"
        type="number"
        onChange={(e) => setYear(e.target.value)}
      />

      <button onClick={fetchReport}>Generate</button>

      {data && (
        <div className="report-card">
          <h3>
            Monthly Report ({data.baseCurrency})
          </h3>

          <div className="report-row">
            <span>Total Income</span>
            <span className="income">
              {data.baseCurrency} {data.income}
            </span>
          </div>

          <div className="report-row">
            <span>Total Expense</span>
            <span className="expense">
              {data.baseCurrency} {data.expense}
            </span>
          </div>

          <div className="report-row savings">
            <span>Net Savings</span>
            <span
              style={{
                color:
                  data.savings >= 0 ? "green" : "red",
              }}
            >
              {data.baseCurrency} {data.savings}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

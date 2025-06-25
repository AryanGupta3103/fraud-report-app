import { useState, useEffect } from "react";
import RiskBadge from "./RiskBadge";
import { supabase } from "../supabaseClient";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
  const fetchAll = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("date", { ascending: false });

    if (!error) {
      setReports(data);
    }
  };
  fetchAll();
}, []);


  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => r.risk === filter);

  const exportCSV = () => {
    const headers = ["Wallet", "Risk", "Date"];
    const rows = filteredReports.map((r) => [
      r.wallet,
      r.risk.toUpperCase(),
      r.date,
    ]);
    const csvContent =
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        <div className="flex justify-between items-center mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Risks</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>

          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
        </div>

        {filteredReports.length === 0 ? (
          <p className="text-gray-500">No reports available.</p>
        ) : (
          <ul className="space-y-3">
            {filteredReports.map((report, index) => (
              <li
                key={index}
                className="bg-gray-50 p-4 rounded border flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-500">{report.date}</p>
                  <p className="text-lg font-semibold">
                    {report.wallet.slice(0, 6)}...{report.wallet.slice(-4)}
                  </p>
                </div>
                <RiskBadge level={report.risk} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

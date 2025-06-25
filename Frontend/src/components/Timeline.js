import RiskBadge from "./RiskBadge";
import { useState } from "react";

export default function Timeline({ reports }) {
  const [sortAsc, setSortAsc] = useState(true);

  const sortedReports = [...reports].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Incident Timeline</h2>
        <button
          className="text-blue-600 underline"
          onClick={() => setSortAsc(!sortAsc)}
        >
          Sort: {sortAsc ? "Oldest First" : "Newest First"}
        </button>
      </div>

      {sortedReports.length === 0 ? (
        <p className="text-gray-500">No reports available.</p>
      ) : (
        <ul className="space-y-3">
          {sortedReports.map((report, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded shadow border flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">{report.date}</p>
                <p className="text-lg font-semibold">
                  Wallet: {report.wallet.slice(0, 6)}...{report.wallet.slice(-4)}
                </p>
              </div>
              <RiskBadge level={report.risk} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

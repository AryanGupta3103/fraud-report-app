export default function RiskBadge({ level }) {
  const colorMap = {
    low: "bg-green-200 text-green-800",
    medium: "bg-orange-200 text-orange-800",
    high: "bg-red-200 text-red-800",
  };

  const labelMap = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-sm font-semibold ${colorMap[level]}`}
    >
      {labelMap[level] || "Unknown"}
    </span>
  );
}
